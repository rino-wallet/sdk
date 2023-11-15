import { createMock } from "@golevelup/ts-jest";

import { of } from "rxjs";

import config from "../config/test.config";
import {
  accountInfoMock,
  taskResponseMock,
  walletMock,
  walletActivitiesMock,
  walletMembersMock,
  walletPendingTransfersMock,
  walletRemovedSpendersMock,
  walletSubaddressesMock,
  walletTransactionsMock,
  exportFileCSV,
  exportFileXLS,
} from ".";

import { RinoService } from "../rino/rino.service";
import { WalletTransactionSupportedExportTypes } from "../entities";

const {
  // Test vars
  ADDRESS,
  PENDING_TRANSFER_ID,
  TRANSACTION_ID,
} = config();

export const rinoServiceMock = createMock<RinoService>({
  getAccountInfo: jest.fn(() => of(accountInfoMock)),
  getTask: jest.fn(() => of(taskResponseMock)),
  getWallet: jest.fn(() => of(walletMock)),
  getWalletActivity: jest.fn(() => of(walletActivitiesMock)),
  getWalletMembers: jest.fn(() => of(walletMembersMock)),
  getWalletOutputs: jest.fn(() => of("task_id")),
  getWalletRemovedSpenders: jest.fn(() => of(walletRemovedSpendersMock)),
  getWalletPendingTransfers: jest.fn(() => of(walletPendingTransfersMock)),
  getWalletPendingTransfer: jest.fn(() =>
    of(
      walletPendingTransfersMock.results.find(
        (item) => item.id === PENDING_TRANSFER_ID,
      ),
    ),
  ),
  getWalletSubaddresses: jest.fn(() => of(walletSubaddressesMock)),
  getWalletSubaddress: jest.fn(() => of(walletSubaddressesMock.results[0])),
  createWalletSubaddress: jest.fn(() => of(walletSubaddressesMock.results[0])),
  updateWalletSubaddress: jest.fn(() =>
    of(walletSubaddressesMock.results.find((item) => item.address === ADDRESS)),
  ),
  partialUpdateWalletSubaddress: jest.fn(() =>
    of(walletSubaddressesMock.results.find((item) => item.address === ADDRESS)),
  ),
  getWalletTransactions: jest.fn(() => of(walletTransactionsMock)),
  getWalletTransaction: jest.fn(() =>
    of(
      walletTransactionsMock.results.find((item) => item.id === TRANSACTION_ID),
    ),
  ),
  createWalletUnsignedTransaction: jest.fn(() => of("task_id")),
  submitWalletTransaction: jest.fn(() => of("task_id")),
  signWalletSubaddress: jest.fn(() => of(walletSubaddressesMock.results[0])),
  exportTransactions: jest.fn((type) => {
    let file;

    if (type === WalletTransactionSupportedExportTypes.CSV) {
      file = exportFileCSV;
    } else if (type === WalletTransactionSupportedExportTypes.XLS) {
      file = exportFileXLS;
    } else {
      throw new Error(`Unsupported export type '${type}'`);
    }

    return of(file);
  }),
});
