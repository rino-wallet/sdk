import { Test, TestingModule } from "@nestjs/testing";
import { createMock } from "@golevelup/ts-jest";

import { ConfigModule } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { lastValueFrom } from "rxjs";

import { RinoService } from "./rino.service";

import config from "../config/test.config";
import {
  accountInfoMock,
  exportFileCSV,
  httpServiceMock,
  taskResponseMock,
  walletActivitiesMock,
  walletMembersMock,
  walletPendingTransfersMock,
  walletRemovedSpendersMock,
  walletSubaddressesMock,
  walletTransactionsMock,
} from "../__mock__";
import {
  WalletCreateTransactionPayload,
  WalletSubaddressPartialUpdatePayload,
  WalletSubaddressUpdatePayload,
  WalletSubmitTransactionPayload,
  WalletTransactionSupportedExportTypes,
} from "../entities";

const {
  RINO_WALLET_ID: WALLET_ID,
  // Test vars
  ADDRESS,
  PENDING_TRANSFER_ID,
  SIGNATURE,
  TASK_ID,
  TRANSACTION_ID,
} = config();

describe("RinoService", () => {
  let service: RinoService;
  let httpService: HttpService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [config],
          ignoreEnvFile: true,
        }),
      ],
      providers: [
        RinoService,
        {
          provide: HttpService,
          useValue: httpServiceMock,
        },
      ],
    }).compile();

    service = module.get<RinoService>(RinoService);
    httpService = module.get<HttpService>(HttpService);
  });

  it("is defined", () => {
    expect(service).toBeDefined();
  });

  it("gets health correctly", async () => {
    const result = await lastValueFrom(service.getHealth());

    expect(httpService.get).toHaveBeenCalledWith("/health", undefined);

    expect(result).toBe(200);
  });

  it("gets the account info related with the configured wallet", async () => {
    const result = await lastValueFrom(service.getAccountInfo());

    expect(httpService.get).toHaveBeenCalledWith("/accounts/me", undefined);

    expect(result).toStrictEqual(accountInfoMock);
  });

  it("gets the configured wallet data", async () => {
    const result = await lastValueFrom(service.getWallet());

    expect(httpService.get).toHaveBeenCalledWith(
      `/wallets/${WALLET_ID}`,
      undefined,
    );

    expect(result.id).toBe(WALLET_ID);
  });

  it("gets the configured wallet activity", async () => {
    const result = await lastValueFrom(service.getWalletActivity());

    expect(httpService.get).toHaveBeenCalledWith(
      `/wallets/${WALLET_ID}/activity`,
      undefined,
    );

    expect(result).toStrictEqual(walletActivitiesMock);
  });

  it("gets the configured wallet members", async () => {
    const result = await lastValueFrom(service.getWalletMembers());

    expect(httpService.get).toHaveBeenCalledWith(
      `/wallets/${WALLET_ID}/members`,
      undefined,
    );

    expect(result).toStrictEqual(walletMembersMock);
  });

  it("gets the configured wallet removed spenders", async () => {
    const result = await lastValueFrom(service.getWalletRemovedSpenders());

    expect(httpService.get).toHaveBeenCalledWith(
      `/wallets/${WALLET_ID}/removed_spenders`,
      undefined,
    );

    expect(result).toStrictEqual(walletRemovedSpendersMock);
  });

  it("gets the configured wallet pending transfers", async () => {
    const result = await lastValueFrom(service.getWalletPendingTransfers());

    expect(httpService.get).toHaveBeenCalledWith(
      `/wallets/${WALLET_ID}/pending_transfers`,
      undefined,
    );

    expect(result).toStrictEqual(walletPendingTransfersMock);
  });

  it("gets a pending transfer in the configured wallet", async () => {
    const pendingTransfer = walletPendingTransfersMock.find(
      (item) => item.id === PENDING_TRANSFER_ID,
    );
    const result = await lastValueFrom(
      service.getWalletPendingTransfer(PENDING_TRANSFER_ID),
    );

    expect(httpService.get).toHaveBeenCalledWith(
      `/wallets/${WALLET_ID}/pending_transfers/${PENDING_TRANSFER_ID}`,
      undefined,
    );

    expect(result).toStrictEqual(pendingTransfer);
  });

  it("approves a pending transfer in the configured wallet", async () => {
    service.approveWalletPendingTransfer(PENDING_TRANSFER_ID);

    expect(httpService.post).toHaveBeenCalledWith(
      `/wallets/${WALLET_ID}/pending_transfers/${PENDING_TRANSFER_ID}/approve/`,
      undefined,
      undefined,
    );
  });

  it("cancels a pending transfer in the configured wallet", async () => {
    service.cancelWalletPendingTransfer(PENDING_TRANSFER_ID);

    expect(httpService.post).toHaveBeenCalledWith(
      `/wallets/${WALLET_ID}/pending_transfers/${PENDING_TRANSFER_ID}/cancel/`,
      undefined,
      undefined,
    );
  });

  it("rejects a pending transfer in the configured wallet", async () => {
    service.rejectWalletPendingTransfer(PENDING_TRANSFER_ID);

    expect(httpService.post).toHaveBeenCalledWith(
      `/wallets/${WALLET_ID}/pending_transfers/${PENDING_TRANSFER_ID}/reject/`,
      undefined,
      undefined,
    );
  });

  it("gets the configured wallet subaddresses", async () => {
    const result = await lastValueFrom(service.getWalletSubaddresses());

    expect(httpService.get).toHaveBeenCalledWith(
      `/wallets/${WALLET_ID}/subaddresses`,
      undefined,
    );

    expect(result).toStrictEqual(walletSubaddressesMock);
  });

  it("creates a subaddress in the configured wallet", async () => {
    await lastValueFrom(service.createWalletSubaddress());

    expect(httpService.post).toHaveBeenCalledWith(
      `/wallets/${WALLET_ID}/subaddresses/`,
      undefined,
      undefined,
    );
  });

  it("signs a subaddress in the configured wallet", async () => {
    await lastValueFrom(service.signWalletSubaddress(ADDRESS, SIGNATURE));

    expect(httpService.post).toHaveBeenCalledWith(
      `/wallets/${WALLET_ID}/subaddresses/${ADDRESS}/sign/`,
      { signature: SIGNATURE },
      undefined,
    );
  });

  it("updates a subaddress in the configured wallet", async () => {
    const payload = createMock<WalletSubaddressUpdatePayload>();

    await lastValueFrom(service.updateWalletSubaddress(ADDRESS, payload));

    expect(httpService.put).toHaveBeenCalledWith(
      `/wallets/${WALLET_ID}/subaddresses/${ADDRESS}/`,
      payload,
    );
  });

  it("partially updates a subaddress in the configured wallet", async () => {
    const payload = createMock<WalletSubaddressPartialUpdatePayload>();

    await lastValueFrom(
      service.partialUpdateWalletSubaddress(ADDRESS, payload),
    );

    expect(httpService.patch).toHaveBeenCalledWith(
      `/wallets/${WALLET_ID}/subaddresses/${ADDRESS}/`,
      payload,
    );
  });

  it("gets the configured wallet transactions", async () => {
    const result = await lastValueFrom(service.getWalletTransactions());

    expect(httpService.get).toHaveBeenCalledWith(
      `/wallets/${WALLET_ID}/transactions`,
      undefined,
    );

    expect(result).toStrictEqual(walletTransactionsMock);
  });

  it("gets a transaction in the configured wallet", async () => {
    const transaction = walletTransactionsMock.find(
      (item) => item.id === TRANSACTION_ID,
    );
    const result = await lastValueFrom(
      service.getWalletTransaction(TRANSACTION_ID),
    );

    expect(httpService.get).toHaveBeenCalledWith(
      `/wallets/${WALLET_ID}/transactions/${TRANSACTION_ID}`,
      undefined,
    );

    expect(result).toStrictEqual(transaction);
  });

  it("gets the configured wallet outputs", async () => {
    await lastValueFrom(service.getWalletOutputs());

    expect(httpService.post).toHaveBeenCalledWith(
      `/wallets/${WALLET_ID}/get_outputs/`,
      undefined,
      undefined,
    );
  });

  it("creates an unsigned transaction in the configured wallet outputs", async () => {
    const payload = createMock<WalletCreateTransactionPayload>();

    await lastValueFrom(service.createWalletUnsignedTransaction(payload));

    expect(httpService.post).toHaveBeenCalledWith(
      `/wallets/${WALLET_ID}/transactions/`,
      payload,
      undefined,
    );
  });

  it("submits a transaction in the configured wallet outputs", async () => {
    const payload = createMock<WalletSubmitTransactionPayload>();

    await lastValueFrom(service.submitWalletTransaction(payload));

    expect(httpService.post).toHaveBeenCalledWith(
      `/wallets/${WALLET_ID}/transactions/submit/`,
      payload,
      { headers: { "X-RINO-2FA": "" } },
    );
  });

  it("gets the task response accordingly to each type or state", async () => {
    const result = await lastValueFrom(service.getTask(TASK_ID));

    expect(httpService.get).toHaveBeenCalledWith(
      `/tasks/${TASK_ID}`,
      undefined,
    );

    expect(result).toStrictEqual(taskResponseMock);
  });

  it("downloads a blob with the wallet transactions in csv format", async () => {
    const type = WalletTransactionSupportedExportTypes.CSV;

    const result = await lastValueFrom(service.exportTransactions(type));

    expect(httpService.get).toHaveBeenCalledWith(
      `/wallets/${WALLET_ID}/transactions/export/`,
      {
        params: {
          type: "csv",
        },
        responseType: "arraybuffer",
      },
    );

    expect(result).toStrictEqual(exportFileCSV);
  });
});
