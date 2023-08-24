import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { IWalletData, ExchangeMultisigKeysResult } from "../types";
import { MoneroWallet } from "./Wallet";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const _sodium = require("libsodium-wrappers");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const monerojs = require("@rino-wallet/monero-javascript");

type Multisig = string;

@Injectable()
export class MoneroService {
  private networkType;

  userWallet: InstanceType<typeof MoneroWallet> | null;

  backupWallet: InstanceType<typeof MoneroWallet> | null;

  walletPassword: Uint8Array;

  constructor(private configService: ConfigService) {
    this.userWallet = null;
    this.backupWallet = null;
    this.walletPassword = new Uint8Array();

    const env = this.configService.get<string>("RINO_ENV");

    switch (env) {
      case "test":
        this.networkType = monerojs.MoneroNetworkType.STAGENET;
        break;
      case "prod":
        this.networkType = monerojs.MoneroNetworkType.MAINNET;
        break;
      default:
        throw new Error("Invalid value for RINO_ENV");
    }
  }

  /**
   * exchange multisig keys among participants and collect results
   * @param  {Multisig[]} madeMultisigs - [madeUserMultisig, madeBackupMultisig, madeServerMultisig]
   */
  exchangeMultisigKeys = async (
    madeMultisigs: Multisig[],
  ): Promise<{
    userResult: ExchangeMultisigKeysResult;
    backupResult: ExchangeMultisigKeysResult;
  }> => {
    const userResult = (await this.userWallet?.exchangeMultisigKeys(
      [madeMultisigs[1], madeMultisigs[2]],
      " ",
    )) as ExchangeMultisigKeysResult;
    const backupResult = (await this.backupWallet?.exchangeMultisigKeys(
      [madeMultisigs[0], madeMultisigs[2]],
      " ",
    )) as ExchangeMultisigKeysResult;
    return {
      userResult,
      backupResult,
    };
  };

  /**
   * Open walllet in browser using wallet keys
   */
  openWallet = async (
    encryptedPrivateKeyContent: string,
    encryptionPublicKey: string,
    encryptionPrivateKey: Uint8Array,
  ): Promise<IWalletData> => {
    const { walletKeys: decryptedKeys, walletPassword } =
      await this.decryptWalletKeys(
        // encryptedWalletKeys
        Uint8Array.from(Buffer.from(encryptedPrivateKeyContent, "base64")),
        // encryptionPublicKey
        Uint8Array.from(Buffer.from(encryptionPublicKey, "base64")),
        encryptionPrivateKey,
      );

    this.userWallet = await MoneroWallet.init(
      {
        password: Buffer.from(walletPassword).toString("hex"),
        networkType: this.networkType,
        keysData: decryptedKeys,
        cacheData: new Uint8Array(),
        path: "",
      },
      true,
    );
    this.walletPassword = walletPassword;
    const userWallet = await this.userWallet.getWalletJSON();

    return userWallet;
  };

  /**
   * Close wallet
   */
  closeWallet = (): void => {
    this.userWallet?.close();
    this.backupWallet?.close();
    this.userWallet = null;
    this.backupWallet = null;
    this.walletPassword = new Uint8Array();
  };

  /**
   * Decrypt wallet keys with user's encryption keys
   */
  private decryptWalletKeys = async (
    encryptedWalletKeys: Uint8Array,
    publicKey: Uint8Array,
    privateKey: Uint8Array,
  ): Promise<{ walletKeys: Uint8Array; walletPassword: Uint8Array }> => {
    try {
      await _sodium.ready;
      const sodium = _sodium;
      const decryptedMessage = sodium.crypto_box_seal_open(
        encryptedWalletKeys,
        publicKey,
        privateKey,
      );
      return {
        walletKeys: decryptedMessage.slice(16),
        walletPassword: decryptedMessage.slice(0, 16),
      };
    } catch (error) {
      console.log(error);
      throw { password: "Wallet keys decryption failed." };
    }
  };
}
