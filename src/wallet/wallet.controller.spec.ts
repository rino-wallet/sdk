import { Test, TestingModule } from "@nestjs/testing";
import { createMock } from "@golevelup/ts-jest";

import { lastValueFrom } from "rxjs";

import { WalletController } from "./wallet.controller";
import { WalletService } from "./wallet.service";

import { walletServiceMock } from "../__mock__";

import config from "../config/test.config";
import {
  WalletTransactionSendPayload,
  WalletSubaddressPartialUpdatePayload,
  WalletSubaddressUpdatePayload,
  WalletTransactionSubmitPayload,
  WalletTransactionSupportedExportTypes,
} from "../entities";

const {
  // Test vars
  ADDRESS,
  PENDING_TRANSFER_ID,
  TRANSACTION_ID,
} = config();

describe("WalletController", () => {
  let controller: WalletController;
  let walletService: WalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [
        {
          provide: WalletService,
          useValue: walletServiceMock,
        },
      ],
    }).compile();

    controller = module.get<WalletController>(WalletController);
    walletService = module.get<WalletService>(WalletService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("gets the wallet data", async () => {
    await lastValueFrom(controller.getWallet());

    expect(walletService.getWallet).toHaveBeenCalled();
  });

  it("gets the wallet activity", async () => {
    await lastValueFrom(controller.getActivity());

    expect(walletService.getActivity).toHaveBeenCalled();
  });

  it("gets the wallet members", async () => {
    await lastValueFrom(controller.getMembers());

    expect(walletService.getMembers).toHaveBeenCalled();
  });

  it("gets the wallet removed spenders", async () => {
    await lastValueFrom(controller.getRemovedSpenders());

    expect(walletService.getRemovedSpenders).toHaveBeenCalled();
  });

  it("gets the wallet pending transfers", async () => {
    await lastValueFrom(controller.getPendingTransfers());

    expect(walletService.getPendingTransfers).toHaveBeenCalled();
  });

  it("gets a pending transfer in the wallet", async () => {
    await lastValueFrom(controller.getPendingTransfer(PENDING_TRANSFER_ID));

    expect(walletService.getPendingTransfer).toHaveBeenCalledWith(
      PENDING_TRANSFER_ID,
    );
  });

  it("approves a pending transfer in the wallet", async () => {
    controller.approvePendingTransfer(PENDING_TRANSFER_ID);

    expect(walletService.approvePendingTransfer).toHaveBeenCalledWith(
      PENDING_TRANSFER_ID,
    );
  });

  it("cancels a pending transfer in the wallet", async () => {
    controller.cancelPendingTransfer(PENDING_TRANSFER_ID);

    expect(walletService.cancelPendingTransfer).toHaveBeenCalledWith(
      PENDING_TRANSFER_ID,
    );
  });

  it("rejects a pending transfer in the wallet", async () => {
    controller.rejectPendingTransfer(PENDING_TRANSFER_ID);

    expect(walletService.rejectPendingTransfer).toHaveBeenCalledWith(
      PENDING_TRANSFER_ID,
    );
  });

  it("gets the wallet subaddresses", async () => {
    await controller.getSubaddresses();

    expect(walletService.getSubaddresses).toHaveBeenCalled();
  });

  it("gets a single subaddress in the configured wallet", async () => {
    await controller.getSubaddress(ADDRESS);

    expect(walletService.getSubaddress).toHaveBeenCalledWith(ADDRESS);
  });

  it("creates a subaddress in the configured wallet", () => {
    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        await controller.createSubaddress();

        expect(walletService.createSubaddress).toHaveBeenCalled();

        resolve();
      }, 1000);
    });
  });

  it("updates a subaddress in the configured wallet", async () => {
    const payload = createMock<WalletSubaddressUpdatePayload>();

    await lastValueFrom(controller.updateSubaddress(ADDRESS, payload));

    expect(walletService.updateSubaddress).toHaveBeenCalledWith(
      ADDRESS,
      payload,
    );
  });

  it("partially updates a subaddress in the configured wallet", async () => {
    const payload = createMock<WalletSubaddressPartialUpdatePayload>();

    await lastValueFrom(controller.partiallyUpdateSubaddress(ADDRESS, payload));

    expect(walletService.partialUpdateSubaddress).toHaveBeenCalledWith(
      ADDRESS,
      payload,
    );
  });

  it("gets the configured wallet transactions", async () => {
    await lastValueFrom(controller.getTransactions());

    expect(walletService.getTransactions).toHaveBeenCalled();
  });

  it("gets a transaction in the configured wallet", async () => {
    await lastValueFrom(controller.getTransaction(TRANSACTION_ID));

    expect(walletService.getTransaction).toHaveBeenCalledWith(TRANSACTION_ID);
  });

  it("sends a transaction through the configured wallet", async () => {
    const payload = createMock<WalletTransactionSendPayload>();
    const response = createMock({
      send: jest.fn(),
      status: jest.fn(() => ({
        send: jest.fn(),
      })),
    });

    await controller.sendTransaction(payload, response);

    expect(walletService.sendTransaction).toHaveBeenCalled();
  });

  it("creates an unsigned transaction through the configured wallet", async () => {
    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        const payload = createMock<WalletTransactionSendPayload>();

        await controller.createUnsignedTransaction(payload);

        expect(walletService.createUnsignedTransaction).toHaveBeenCalled();

        resolve();
      }, 1000);
    });
  });

  it("submits a transaction through the configured wallet", async () => {
    const payload = createMock<WalletTransactionSubmitPayload>();
    const response = createMock({
      send: jest.fn(),
      status: jest.fn(() => ({
        send: jest.fn(),
      })),
    });

    await controller.submitTransaction(payload, response);

    expect(walletService.sendTransaction).toHaveBeenCalled();
  });

  it("downloads a blob with the wallet transactions in csv format", async () => {
    const type = WalletTransactionSupportedExportTypes.CSV;
    const response = createMock({
      send: jest.fn(),
      status: jest.fn(() => ({
        send: jest.fn(),
      })),
    });

    await controller.exportTransactions(type, response);

    expect(walletService.exportTransactions).toHaveBeenCalledWith(type);
  });

  it("downloads a blob with the wallet transactions in xls format", async () => {
    const type = WalletTransactionSupportedExportTypes.XLS;
    const response = createMock({
      send: jest.fn(),
      status: jest.fn(() => ({
        send: jest.fn(),
      })),
    });

    await controller.exportTransactions(type, response);

    expect(walletService.exportTransactions).toHaveBeenCalledWith(type);
  });
});
