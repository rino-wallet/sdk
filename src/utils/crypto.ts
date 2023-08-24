// import _sodium from "libsodium-wrappers-sumo";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const _sodium = require("libsodium-wrappers-sumo");

/**
 * Derivation of authentication and encryption keys from the user password and username.
 *
 * This function generates a 64 bytes key using the crypto_pwhash derivation function.
 * This means using the key-derivation algorithm on a password that the user chooses.
 * This algorithm requires a password and salt. We'll use username as salt
 * The first 32 bytes, should be used for authentication purposes.
 * The last 32 bytes, should be used for encryption purposes.
 * This function should be called everytime when we ask for the user's password.
 *
 * This function is based in a Rino Frontend implementation.
 */
export async function deriveUserKeys(
  password: string,
  username: string,
): Promise<{
  authKey: Uint8Array;
  encryptionKey: Uint8Array;
  clean: () => void;
}> {
  await _sodium.ready;
  const sodium = _sodium;

  const enc = new TextEncoder();
  const usernameSalt = Uint8Array.from(enc.encode(username));

  const salt = new Uint8Array(sodium.crypto_pwhash_SALTBYTES);
  salt.set(usernameSalt.subarray(0, sodium.crypto_pwhash_SALTBYTES));

  const key = sodium?.crypto_pwhash(
    64,
    password,
    salt,
    sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    sodium.crypto_pwhash_ALG_DEFAULT,
  );
  const authKey = key.slice(0, 32);
  const encryptionKey = key.slice(32);

  sodium.memzero(usernameSalt);
  sodium.memzero(salt);

  return {
    authKey,
    encryptionKey,
    clean(): void {
      sodium.memzero(authKey);
      sodium.memzero(encryptionKey);
      sodium.memzero(key);
    },
  };
}

/**
 * Decrypt data using the encryption key.
 *
 * This function is based in a Rino Frontend implementation.
 */
export async function decryptKeys(
  encryptedMessage: Uint8Array,
  nonce: Uint8Array,
  encryptionKey: Uint8Array,
): Promise<{
  version: number;
  encryptionPrivateKey: Uint8Array;
  signingPrivateKey: Uint8Array;
  clean: () => void;
}> {
  try {
    await _sodium.ready;
    const sodium = _sodium;

    const decryptedMessage = sodium.crypto_secretbox_open_easy(
      encryptedMessage,
      nonce,
      encryptionKey,
    );

    const version = decryptedMessage[1];
    const encryptionPrivateKey = decryptedMessage.slice(2, 34);
    const signingPrivateKey = decryptedMessage.slice(34);

    return {
      version,
      encryptionPrivateKey,
      signingPrivateKey,
      clean(): void {
        sodium.memzero(encryptionPrivateKey);
        sodium.memzero(signingPrivateKey);
      },
    };
  } catch (error) {
    throw {
      decryptKeys: "Decryption failed.",
      password: "Incorrect password.",
    };
  }
}

/**
 * This function is used to get signingPrivateKey and signingPublicKey from enc_private_key.
 *
 * This function is based in a Rino Frontend implementation.
 *
 * @param data enc_private_key data
 */
export async function getSigningKeys(
  data: { enc_content: string; nonce: string },
  encryptionKey: Uint8Array,
): Promise<{
  signingPrivateKey: Uint8Array;
  signingPublicKey: Uint8Array;
  clean: () => void;
}> {
  const sodium = _sodium;
  const enc_content = Buffer.from(data.enc_content, "base64");
  const nonce = Buffer.from(data.nonce, "base64");

  const { signingPrivateKey, clean } = await decryptKeys(
    enc_content,
    nonce,
    encryptionKey,
  );

  const signingPublicKey =
    sodium.crypto_sign_ed25519_sk_to_pk(signingPrivateKey);

  return {
    signingPrivateKey,
    signingPublicKey,
    clean,
  };
}

/**
 * This function is used to create signature for message.
 * @param data enc_private_key data
 *
 * This function is based in a Rino Frontend implementation.
 */
export async function signMessage(
  data: any,
  encryptionKey: Uint8Array,
  message: string,
): Promise<Uint8Array> {
  const sodium = _sodium;
  const { signingPrivateKey, clean } = await getSigningKeys(
    data,
    encryptionKey,
  );

  const signature = sodium.crypto_sign_detached(message, signingPrivateKey);

  clean();
  return signature;
}

/**
 * This function is used to verify signature
 *
 * This function is based in a Rino Frontend implementation.
 */
export async function verifySignature(
  data: any,
  encryptionKey: Uint8Array,
  message: string,
  signature: Uint8Array,
): Promise<boolean> {
  const sodium = _sodium;

  const { signingPublicKey, clean } = await getSigningKeys(data, encryptionKey);
  clean();

  return sodium.crypto_sign_verify_detached(
    signature,
    message,
    signingPublicKey,
  );
}
