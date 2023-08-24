import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Observable, lastValueFrom } from "rxjs";

import { MoneroService } from "../monero/monero.service";
import { RinoService } from "../rino/rino.service";

// TODO: Replace this entities for a class one (camelCase attributes)
import {
  AccountInfoEntity,
  FileResponseEntity,
  TaskResponseEntity,
  TaskResponseSubmitTxResult,
  TaskResponseSubmitTxParams,
  WalletActivityEntity,
  WalletEntity,
  WalletMemberEntity,
  WalletPendingTransferEntity,
  WalletRemovedSpenderEntity,
  WalletSubaddressEntity,
  WalletSubaddressPartialUpdatePayload,
  WalletSubaddressUpdatePayload,
  WalletTransactionEntity,
  WalletTransactionSendPayload,
  WalletTransactionSendResponse,
  TaskResponseCreateTxResult,
  TaskResponseCreateTxParams,
  WalletTransactionSubmitPayload,
  WalletTransactionCreatePayload,
  WalletTransactionCreateResponse,
  WalletTransactionSubmitResponse,
  WalletTransactionSupportedExportTypes,
} from "../entities";
import { MoneroWallet } from "../monero/Wallet";
import {
  decryptKeys,
  deriveUserKeys,
  signMessage,
  verifySignature,
} from "../utils/crypto";
import { PerformanceMonitor } from "../utils/performanceMonitor";

const pm = new PerformanceMonitor();

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  private readonly WALLET_MODE: "PERM" | "TEMP" = "PERM";

  private accountInfo: AccountInfoEntity;

  private password: string;

  private walletId: string;

  private wallet: MoneroWallet;

  constructor(
    private configService: ConfigService,
    private moneroService: MoneroService,
    private rinoService: RinoService,
  ) {
    (async () => {
      this.accountInfo = await lastValueFrom(this.rinoService.getAccountInfo());
      this.logger.log(
        `Account info loaded for user "${this.accountInfo.username}"`,
      );

      this.password = this.configService.get<string>("RINO_ACCOUNT_PASSWORD");
      this.walletId = this.configService.get<string>("RINO_WALLET_ID");

      if (this.WALLET_MODE === "PERM") {
        try {
          this.wallet = await this.openWalletInstance();
        } catch (error) {
          this.logger.error(error);
          throw new Error(error);
        }
      }
    })();
  }

  getWallet(): Observable<WalletEntity> {
    return this.rinoService.getWallet();
  }

  getActivity(): Observable<WalletActivityEntity[]> {
    return this.rinoService.getWalletActivity();
  }

  getMembers(): Observable<WalletMemberEntity[]> {
    return this.rinoService.getWalletMembers();
  }

  getRemovedSpenders(): Observable<WalletRemovedSpenderEntity[]> {
    return this.rinoService.getWalletRemovedSpenders();
  }

  getPendingTransfers(): Observable<WalletPendingTransferEntity[]> {
    return this.rinoService.getWalletPendingTransfers();
  }

  getPendingTransfer(
    pendingTransferId: string,
  ): Observable<WalletPendingTransferEntity> {
    return this.rinoService.getWalletPendingTransfer(pendingTransferId);
  }

  async approvePendingTransfer(pendingTransferId: string): Promise<boolean> {
    this.logger.log(`Approving pending transfer "${pendingTransferId}"`);

    const taskId = await lastValueFrom(
      this.rinoService.approveWalletPendingTransfer(pendingTransferId),
    );

    try {
      await this.pollTask(taskId);

      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  cancelPendingTransfer(pendingTransferId: string): Observable<void> {
    this.logger.log(`Cancel pending transfer "${pendingTransferId}"`);

    return this.rinoService.cancelWalletPendingTransfer(pendingTransferId);
  }

  rejectPendingTransfer(pendingTransferId: string): Observable<void> {
    this.logger.log(`Reject pending transfer "${pendingTransferId}"`);

    return this.rinoService.rejectWalletPendingTransfer(pendingTransferId);
  }

  async getSubaddresses() {
    const subaddresses = await lastValueFrom(
      this.rinoService.getWalletSubaddresses(),
    );

    const {
      username,
      keypair: { enc_private_key },
    } = this.accountInfo;

    const encPrivateKey = JSON.parse(enc_private_key);

    const { encryptionKey, clean: cleanDerivedKeys } = await deriveUserKeys(
      this.password,
      username,
    );

    const processedSubaddresses = [];

    for (const subaddress of subaddresses) {
      let validated = false;

      try {
        if (!!subaddress.signature) {
          validated = await verifySignature(
            encPrivateKey,
            encryptionKey,
            subaddress.address,
            Uint8Array.from(Buffer.from(subaddress.signature, "base64")),
          );
        }
      } catch (error) {
        this.logger.error(`Error verifying signature of address ${subaddress}`);
        this.logger.error(error);
      }

      processedSubaddresses.push({
        ...subaddress,
        validated,
      });
    }

    cleanDerivedKeys();

    return processedSubaddresses;
  }

  async createSubaddress(): Promise<WalletSubaddressEntity> {
    const { address, index } = await lastValueFrom(
      this.rinoService.createWalletSubaddress(),
    );

    const wallet = await this.getWalletInstance();

    const [subaddress] = await wallet.getSubaddresses(index);

    if (subaddress.state.address !== address) {
      throw new Error(
        "Created subaddress does not belong to the loaded wallet",
      );
    }

    const { encryptionKey, clean: cleanDerivedKeys } = await deriveUserKeys(
      this.password,
      this.accountInfo.username,
    );

    const {
      keypair: { enc_private_key },
    } = this.accountInfo;

    const { enc_content, nonce } = JSON.parse(enc_private_key);

    const signature = await signMessage(
      { enc_content, nonce },
      encryptionKey,
      address,
    );

    const signedSubaddress = await lastValueFrom(
      this.rinoService.signWalletSubaddress(
        address,
        Buffer.from(signature).toString("base64"),
      ),
    );

    cleanDerivedKeys();

    this.closeWalletInstance();

    return signedSubaddress;
  }

  updateSubaddress(address: string, payload: WalletSubaddressUpdatePayload) {
    return this.rinoService.updateWalletSubaddress(address, payload);
  }

  partialUpdateSubaddress(
    address: string,
    payload: WalletSubaddressPartialUpdatePayload,
  ) {
    return this.rinoService.partialUpdateWalletSubaddress(address, payload);
  }

  getTransactions(): Observable<WalletTransactionEntity[]> {
    return this.rinoService.getWalletTransactions();
  }

  getTransaction(transactionId: string): Observable<WalletTransactionEntity> {
    return this.rinoService.getWalletTransaction(transactionId);
  }

  async sendTransaction({
    destination,
    priority,
  }: WalletTransactionSendPayload): Promise<WalletTransactionSendResponse> {
    pm.markStart("send-tx");
    const wallet = await this.getWalletInstance();

    await this.getOutputs();

    const multisig = await wallet.getMultisigHex();

    let response;

    try {
      const createTxTaskId = await lastValueFrom(
        this.rinoService.createWalletUnsignedTransaction({
          destinations: [destination],
          multisig_hex: multisig,
          priority: priority,
        }),
      );

      const {
        result: { multisig_hex, txs_hex },
      } = await this.pollTask<
        TaskResponseCreateTxResult,
        TaskResponseCreateTxParams
      >(createTxTaskId);

      await wallet.importMultisigHex([multisig_hex]);
      await wallet.loadMultisigTx(txs_hex);

      const validatedTxsHex = await wallet.reconstructAndValidateTransaction(
        txs_hex,
        { ...destination },
      );

      const submitTxResponse = await lastValueFrom(
        this.rinoService.submitWalletTransaction({
          tx_hex: validatedTxsHex,
          memo: "",
        }),
      );

      if (typeof submitTxResponse === "string") {
        const submitTxTaskResult = await this.pollTask<
          TaskResponseSubmitTxResult,
          TaskResponseSubmitTxParams
        >(submitTxResponse);

        response = {
          requiresApproval: false,
          data: submitTxTaskResult,
        };
      } else {
        response = {
          requiresApproval: true,
          data: submitTxResponse,
        };
      }

      this.closeWalletInstance();

      pm.markEnd("send-tx");
      this.logger.log(
        `Tx sent to "${destination.address}" successfully in ${pm.duration(
          "send-tx",
        )}ms`,
      );

      return response;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.result);
    }
  }

  async createUnsignedTransaction({
    destination,
    priority,
  }: WalletTransactionCreatePayload): Promise<WalletTransactionCreateResponse> {
    pm.markStart("create-unsigned-tx");
    const wallet = await this.getWalletInstance();

    await this.getOutputs();

    const multisig = await wallet.getMultisigHex();

    try {
      const createTxTaskId = await lastValueFrom(
        this.rinoService.createWalletUnsignedTransaction({
          destinations: [destination],
          multisig_hex: multisig,
          priority: priority,
        }),
      );

      const {
        result: { multisig_hex, txs_hex },
      } = await this.pollTask<
        TaskResponseCreateTxResult,
        TaskResponseCreateTxParams
      >(createTxTaskId);

      await wallet.importMultisigHex([multisig_hex]);
      await wallet.loadMultisigTx(txs_hex);

      const validatedTxsHex = await wallet.reconstructAndValidateTransaction(
        txs_hex,
        { ...destination },
      );

      this.closeWalletInstance();

      pm.markEnd("create-unsigned-tx");
      this.logger.log(
        `Unsigned Tx created to "${
          destination.address
        }" successfully in ${pm.duration("create-unsigned-tx")}ms`,
      );

      return { txs_hex: validatedTxsHex };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.result);
    }
  }

  async submitTransaction({
    txs_hex,
  }: WalletTransactionSubmitPayload): Promise<WalletTransactionSubmitResponse> {
    pm.markStart("submit-tx");

    try {
      let response;

      const submitTxResponse = await lastValueFrom(
        this.rinoService.submitWalletTransaction({
          tx_hex: txs_hex,
          memo: "",
        }),
      );

      if (typeof submitTxResponse === "string") {
        const submitTxTaskResult = await this.pollTask<
          TaskResponseSubmitTxResult,
          TaskResponseSubmitTxParams
        >(submitTxResponse);

        response = {
          requiresApproval: false,
          data: submitTxTaskResult,
        };
      } else {
        response = {
          requiresApproval: true,
          data: submitTxResponse,
        };
      }

      this.closeWalletInstance();

      pm.markEnd("submit-tx");
      this.logger.log(
        `Tx submitted successfully in ${pm.duration("submit-tx")}ms`,
      );

      return response;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException(error.result);
    }
  }

  exportTransactions(
    type: WalletTransactionSupportedExportTypes,
  ): Observable<FileResponseEntity> {
    this.logger.log(
      `Exporting transactions for wallet ${this.walletId} in ${type} format`,
    );
    return this.rinoService.exportTransactions(type);
  }

  private pollTask<P = any, R = any>(
    taskId: string,
  ): Promise<TaskResponseEntity<P, R>> {
    return new Promise((resolve, reject) => {
      const intervalId = setInterval(async () => {
        const response = await lastValueFrom(this.rinoService.getTask(taskId));
        this.logger.log(`Polling task "${taskId}". ${response.status}`);

        if (response.status === "COMPLETED") {
          clearInterval(intervalId);
          resolve(response);
        } else if (response.status === "FAILED") {
          clearInterval(intervalId);
          reject(response);
        }
      }, 1000);
    });
  }

  private async getWalletInstance(): Promise<MoneroWallet> {
    if (this.WALLET_MODE === "TEMP" && !this.wallet) {
      this.wallet = await this.openWalletInstance();
    }

    return this.wallet;
  }

  private closeWalletInstance() {
    if (this.WALLET_MODE === "TEMP" && this.wallet) {
      this.wallet.close();
    }
  }

  private async openWalletInstance(): Promise<MoneroWallet> {
    pm.markStart("open-wallet");

    const {
      email,
      keypair: { enc_private_key, encryption_public_key: encryptionPublicKey },
    } = this.accountInfo;

    const encPrivateKey = JSON.parse(enc_private_key);

    const wallet = await lastValueFrom(this.getWallet());

    const { encryptionKey, clean: cleanDeriveUserKeys } = await deriveUserKeys(
      this.password,
      this.accountInfo.username,
    );

    const currentMember = wallet.members.find((m) => m.user === email);
    const encryptedWalletKeysJson = currentMember?.encrypted_keys || "";

    const encryptedWalletKeys = JSON.parse(encryptedWalletKeysJson).enc_content;

    const { encryptionPrivateKey, clean: cleanDecryptedKeys } =
      await decryptKeys(
        Uint8Array.from(Buffer.from(encPrivateKey.enc_content, "base64")),
        Uint8Array.from(Buffer.from(encPrivateKey.nonce, "base64")),
        encryptionKey,
      );

    await this.moneroService.openWallet(
      encryptedWalletKeys,
      encryptionPublicKey,
      encryptionPrivateKey,
    );

    cleanDeriveUserKeys();
    cleanDecryptedKeys();

    pm.markEnd("open-wallet");
    this.logger.log(
      `Wallet "${this.walletId}" opened successfully in ${pm.duration(
        "open-wallet",
      )}ms`,
    );

    return this.moneroService.userWallet;
  }

  private async getOutputs(): Promise<void> {
    const requestOutputsTaskId = await lastValueFrom(
      this.rinoService.getWalletOutputs(),
    );

    try {
      const {
        result: { outputs_hex },
      } = await this.pollTask(requestOutputsTaskId);

      await (await this.getWalletInstance()).importOutputs(outputs_hex);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
