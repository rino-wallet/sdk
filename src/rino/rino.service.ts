import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Observable, map } from "rxjs";
import { AxiosRequestConfig, AxiosResponse } from "axios";

import {
  AccountInfoEntity,
  MimeTypes,
  PolledTaskResponse,
  TaskResponseEntity,
  WalletEntity,
  WalletActivityEntity,
  WalletCreateTransactionPayload,
  WalletMemberEntity,
  WalletPendingTransferEntity,
  WalletRemovedSpenderEntity,
  WalletSubaddressEntity,
  WalletSubaddressPartialUpdatePayload,
  WalletSubaddressUpdatePayload,
  WalletSubmitTransactionPayload,
  WalletTransactionEntity,
  WalletTransactionSupportedExportTypes,
  FileResponseEntity,
} from "../entities";
import { Page } from "../types";

const responseDataMapCallback = (response) => response.data;

const responseTaskIdMapCallback = (response) => response.data.task_id;

const defaultMapCallback = responseDataMapCallback;

@Injectable()
export class RinoService {
  private walletId: string;

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.walletId = this.configService.get<string>("RINO_WALLET_ID");
  }

  getHealth(): Observable<number> {
    return this.get<number>(
      "/health",
      undefined,
      (response) => response.status,
    );
  }

  getAccountInfo(): Observable<AccountInfoEntity> {
    return this.get<AccountInfoEntity>("/accounts/me");
  }

  getTask(taskId: string): Observable<TaskResponseEntity> {
    return this.get<TaskResponseEntity>(`/tasks/${taskId}`);
  }

  getWallet(): Observable<WalletEntity> {
    return this.get<WalletEntity>(`/wallets/${this.walletId}`);
  }

  getWalletActivity(
    limit?: number,
    offset?: number,
  ): Observable<Page<WalletActivityEntity>> {
    return this.get<Page<WalletActivityEntity>>(
      `/wallets/${this.walletId}/activity`,
      {
        params: {
          limit,
          offset,
        },
      },
      responseDataMapCallback,
    );
  }

  getWalletMembers(
    limit?: number,
    offset?: number,
  ): Observable<Page<WalletMemberEntity>> {
    return this.get<Page<WalletMemberEntity>>(
      `/wallets/${this.walletId}/members`,
      {
        params: {
          limit,
          offset,
        },
      },
      responseDataMapCallback,
    );
  }

  getWalletRemovedSpenders(
    limit?: number,
    offset?: number,
  ): Observable<Page<WalletRemovedSpenderEntity>> {
    return this.get<Page<WalletRemovedSpenderEntity>>(
      `/wallets/${this.walletId}/removed_spenders`,
      {
        params: {
          limit,
          offset,
        },
      },
      responseDataMapCallback,
    );
  }

  getWalletPendingTransfers(
    limit?: number,
    offset?: number,
  ): Observable<Page<WalletPendingTransferEntity>> {
    return this.get<Page<WalletPendingTransferEntity>>(
      `/wallets/${this.walletId}/pending_transfers`,
      {
        params: {
          limit,
          offset,
        },
      },
      responseDataMapCallback,
    );
  }

  getWalletPendingTransfer(
    pendingTransferId: string,
  ): Observable<WalletPendingTransferEntity> {
    return this.get<WalletPendingTransferEntity>(
      `/wallets/${this.walletId}/pending_transfers/${pendingTransferId}`,
    );
  }

  approveWalletPendingTransfer(pendingTransferId: string): Observable<string> {
    return this.post<string>(
      `/wallets/${this.walletId}/pending_transfers/${pendingTransferId}/approve/`,
      undefined,
      responseTaskIdMapCallback,
    );
  }

  cancelWalletPendingTransfer(pendingTransferId: string): Observable<void> {
    return this.post<void>(
      `/wallets/${this.walletId}/pending_transfers/${pendingTransferId}/cancel/`,
      undefined,
      () => {
        return;
      },
    );
  }

  rejectWalletPendingTransfer(pendingTransferId: string): Observable<void> {
    return this.post<void>(
      `/wallets/${this.walletId}/pending_transfers/${pendingTransferId}/reject/`,
      undefined,
      () => {
        return;
      },
    );
  }

  getWalletSubaddresses(
    limit?: number,
    offset?: number,
  ): Observable<Page<WalletSubaddressEntity>> {
    return this.get<Page<WalletSubaddressEntity>>(
      `/wallets/${this.walletId}/subaddresses`,
      {
        params: {
          limit,
          offset,
        },
      },
      responseDataMapCallback,
    );
  }

  getWalletSubaddress(address: string): Observable<WalletSubaddressEntity> {
    return this.get<WalletSubaddressEntity>(
      `/wallets/${this.walletId}/subaddresses/${address}`,
    );
  }

  createWalletSubaddress(): Observable<WalletSubaddressEntity> {
    return this.post<WalletSubaddressEntity>(
      `/wallets/${this.walletId}/subaddresses/`,
      undefined,
    );
  }

  signWalletSubaddress(
    address: string,
    signature: string,
  ): Observable<WalletSubaddressEntity> {
    return this.post<WalletSubaddressEntity>(
      `/wallets/${this.walletId}/subaddresses/${address}/sign/`,
      {
        signature,
      },
    );
  }

  updateWalletSubaddress(
    address: string,
    payload: WalletSubaddressUpdatePayload,
  ): Observable<WalletSubaddressEntity> {
    return this.put<WalletSubaddressEntity>(
      `/wallets/${this.walletId}/subaddresses/${address}/`,
      payload,
    );
  }

  partialUpdateWalletSubaddress(
    subaddressId: string,
    payload: WalletSubaddressPartialUpdatePayload,
  ): Observable<WalletSubaddressEntity> {
    return this.patch<WalletSubaddressEntity>(
      `/wallets/${this.walletId}/subaddresses/${subaddressId}/`,
      payload,
    );
  }

  getWalletTransactions(
    limit?: number,
    offset?: number,
  ): Observable<Page<WalletTransactionEntity>> {
    return this.get<Page<WalletTransactionEntity>>(
      `/wallets/${this.walletId}/transactions`,
      {
        params: {
          limit,
          offset,
        },
      },
      responseDataMapCallback,
    );
  }

  getWalletTransaction(
    transactionId: string,
  ): Observable<WalletTransactionEntity> {
    return this.get<WalletTransactionEntity>(
      `/wallets/${this.walletId}/transactions/${transactionId}`,
    );
  }

  getWalletOutputs(): Observable<string> {
    return this.post<string>(
      `/wallets/${this.walletId}/get_outputs/`,
      undefined,
      responseTaskIdMapCallback,
    );
  }

  createWalletUnsignedTransaction(
    payload: WalletCreateTransactionPayload,
  ): Observable<string> {
    return this.post<string>(
      `/wallets/${this.walletId}/transactions/`,
      payload,
      responseTaskIdMapCallback,
    );
  }

  submitWalletTransaction(
    payload: WalletSubmitTransactionPayload,
  ): Observable<string | WalletPendingTransferEntity | undefined> {
    return this.post<string | WalletPendingTransferEntity>(
      `/wallets/${this.walletId}/transactions/submit/`,
      payload,
      (response) => {
        if (response.status === 201) {
          return (response.data as PolledTaskResponse).task_id;
        } else if (response.status === 202) {
          return response.data as WalletPendingTransferEntity;
        }

        return undefined;
      },
      { headers: { "X-RINO-2FA": "" } },
    );
  }

  exportTransactions(
    type: WalletTransactionSupportedExportTypes,
  ): Observable<FileResponseEntity> {
    return this.get(
      `/wallets/${this.walletId}/transactions/export/`,
      {
        params: { type },
        responseType: "arraybuffer",
      },
      (response) => {
        return {
          filename: `${this.walletId}.${type}`,
          mimeType: MimeTypes[type],
          data: Buffer.from(response.data),
        };
      },
    );
  }

  private get<T>(
    url: string,
    config?: AxiosRequestConfig,
    mapCallback: (response: AxiosResponse) => T = defaultMapCallback,
  ): Observable<T> {
    return this.httpService.get<T>(url, config).pipe(map(mapCallback));
  }

  private post<T>(
    url: string,
    payload: any,
    mapCallback: (response: AxiosResponse) => T = defaultMapCallback,
    config?: AxiosRequestConfig<any>,
  ): Observable<T> {
    return this.httpService
      .post<T>(url, payload, config)
      .pipe(map(mapCallback));
  }

  private put<T>(
    url: string,
    payload: any,
    mapCallback: (response: AxiosResponse) => T = defaultMapCallback,
  ): Observable<T> {
    return this.httpService.put<T>(url, payload).pipe(map(mapCallback));
  }

  private patch<T>(
    url: string,
    payload: any,
    mapCallback: (response: AxiosResponse) => T = defaultMapCallback,
  ): Observable<T> {
    return this.httpService.patch<T>(url, payload).pipe(map(mapCallback));
  }
}
