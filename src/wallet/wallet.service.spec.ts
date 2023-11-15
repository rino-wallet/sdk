import { Test, TestingModule } from "@nestjs/testing";
import { createMock } from "@golevelup/ts-jest";

import { ConfigModule } from "@nestjs/config";

import { WalletService } from "./wallet.service";
import { RinoService } from "../rino/rino.service";

import config from "../config/test.config";
import { MoneroService } from "../monero/monero.service";
import { lastValueFrom } from "rxjs";
import { moneroServiceMock, rinoServiceMock } from "../__mock__";
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

describe("WalletService", () => {
  let service: WalletService;
  let rinoService: RinoService;

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
        {
          provide: MoneroService,
          useValue: moneroServiceMock,
        },
        {
          provide: RinoService,
          useValue: rinoServiceMock,
        },
        WalletService,
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
    rinoService = module.get<RinoService>(RinoService);
  });

  it("Is defined", () => {
    expect(service).toBeDefined();
  });

  it("gets the wallet data", async () => {
    await lastValueFrom(service.getWallet());

    expect(rinoService.getWallet).toHaveBeenCalled();
  });

  it("gets the wallet activity", async () => {
    await lastValueFrom(service.getActivity());

    expect(rinoService.getWalletActivity).toHaveBeenCalled();
  });

  it("gets the wallet members", async () => {
    await lastValueFrom(service.getMembers());

    expect(rinoService.getWalletMembers).toHaveBeenCalled();
  });

  it("gets the wallet removed spenders", async () => {
    await lastValueFrom(service.getRemovedSpenders());

    expect(rinoService.getWalletRemovedSpenders).toHaveBeenCalled();
  });

  it("gets the wallet pending transfers", async () => {
    await lastValueFrom(service.getPendingTransfers());

    expect(rinoService.getWalletPendingTransfers).toHaveBeenCalled();
  });

  it("gets a pending transfer in the wallet", async () => {
    await lastValueFrom(service.getPendingTransfer(PENDING_TRANSFER_ID));

    expect(rinoService.getWalletPendingTransfer).toHaveBeenCalledWith(
      PENDING_TRANSFER_ID,
    );
  });

  it("approves a pending transfer in the wallet", async () => {
    service.approvePendingTransfer(PENDING_TRANSFER_ID);

    expect(rinoService.approveWalletPendingTransfer).toHaveBeenCalledWith(
      PENDING_TRANSFER_ID,
    );
  });

  it("cancels a pending transfer in the wallet", async () => {
    service.cancelPendingTransfer(PENDING_TRANSFER_ID);

    expect(rinoService.cancelWalletPendingTransfer).toHaveBeenCalledWith(
      PENDING_TRANSFER_ID,
    );
  });

  it("rejects a pending transfer in the wallet", async () => {
    service.rejectPendingTransfer(PENDING_TRANSFER_ID);

    expect(rinoService.rejectWalletPendingTransfer).toHaveBeenCalledWith(
      PENDING_TRANSFER_ID,
    );
  });

  it("gets the wallet subaddresses", async () => {
    await service.getSubaddresses();

    expect(rinoService.getWalletSubaddresses).toHaveBeenCalled();
  });

  it("get single subaddress in the configured wallet", async () => {
    await service.getSubaddress(ADDRESS);

    expect(rinoService.getWalletSubaddress).toHaveBeenCalledWith(ADDRESS);
  });

  it("creates a subaddress in the configured wallet", () => {
    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        await service.createSubaddress();

        expect(rinoService.createWalletSubaddress).toHaveBeenCalled();
        // TODO: Assess `wallet.getSubaddresses`
        // TODO: Assess `crypto.deriveUserKeys`
        // TODO: Assess `crypto.signMessage`
        expect(rinoService.signWalletSubaddress).toHaveBeenCalled();
        // TODO: Assess `crypto.signMessage`

        resolve();
      }, 1000);
    });
  });

  it("updates a subaddress in the configured wallet", async () => {
    const payload = createMock<WalletSubaddressUpdatePayload>();

    await lastValueFrom(service.updateSubaddress(ADDRESS, payload));

    expect(rinoService.updateWalletSubaddress).toHaveBeenCalledWith(
      ADDRESS,
      payload,
    );
  });

  it("partially updates a subaddress in the configured wallet", async () => {
    const payload = createMock<WalletSubaddressPartialUpdatePayload>();

    await lastValueFrom(service.partialUpdateSubaddress(ADDRESS, payload));

    expect(rinoService.partialUpdateWalletSubaddress).toHaveBeenCalledWith(
      ADDRESS,
      payload,
    );
  });

  it("gets the configured wallet transactions", async () => {
    await lastValueFrom(service.getTransactions());

    expect(rinoService.getWalletTransactions).toHaveBeenCalled();
  });

  it("gets a transaction in the configured wallet", async () => {
    await lastValueFrom(service.getTransaction(TRANSACTION_ID));

    expect(rinoService.getWalletTransaction).toHaveBeenCalledWith(
      TRANSACTION_ID,
    );
  });

  it("sends a transaction through the configured wallet", async () => {
    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        const payload = createMock<WalletTransactionSendPayload>();

        await service.sendTransaction(payload);

        expect(rinoService.createWalletUnsignedTransaction).toHaveBeenCalled();
        expect(rinoService.submitWalletTransaction).toHaveBeenCalled();

        resolve();
      }, 1000);
    });
  });

  it("creates an unsigned transaction through the configured wallet", async () => {
    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        const payload = createMock<WalletTransactionSendPayload>();

        await service.createUnsignedTransaction(payload);

        expect(rinoService.createWalletUnsignedTransaction).toHaveBeenCalled();

        resolve();
      }, 1000);
    });
  });

  it("submits a transaction through the configured wallet", async () => {
    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        const payload = createMock<WalletTransactionSubmitPayload>();

        await service.submitTransaction(payload);

        expect(rinoService.submitWalletTransaction).toHaveBeenCalled();

        resolve();
      }, 1000);
    });
  });

  it("downloads a blob with the wallet transactions in csv format", async () => {
    const type = WalletTransactionSupportedExportTypes.CSV;

    await lastValueFrom(service.exportTransactions(type));

    expect(rinoService.exportTransactions).toHaveBeenCalledWith(type);
  });

  it("downloads a blob with the wallet transactions in xls format", async () => {
    const type = WalletTransactionSupportedExportTypes.XLS;

    await lastValueFrom(service.exportTransactions(type));

    expect(rinoService.exportTransactions).toHaveBeenCalledWith(type);
  });
});
