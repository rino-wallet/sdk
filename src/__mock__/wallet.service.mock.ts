import { createMock } from "@golevelup/ts-jest";

import { of } from "rxjs";

import config from "../config/test.config";
import {
  exportFileCSV,
  exportFileXLS,
  walletMock,
  walletActivitiesMock,
  walletMembersMock,
  walletPendingTransfersMock,
  walletRemovedSpendersMock,
  walletSubaddressesMock,
  walletTransactionsMock,
  walletTransactionSendResponseMock,
  taskResponseCreateTxResultMock,
} from ".";

import { WalletService } from "../wallet/wallet.service";
import { WalletTransactionSupportedExportTypes } from "../entities";

const {
  // Test vars
  ADDRESS,
  PENDING_TRANSFER_ID,
  TRANSACTION_ID,
} = config();

export const walletServiceMock = createMock<WalletService>({
  getWallet: jest.fn(() => of(walletMock)),
  getActivity: jest.fn(() => of(walletActivitiesMock)),
  getMembers: jest.fn(() => of(walletMembersMock)),
  getRemovedSpenders: jest.fn(() => of(walletRemovedSpendersMock)),
  getPendingTransfers: jest.fn(() => of(walletPendingTransfersMock)),
  getPendingTransfer: jest.fn(() =>
    of(
      walletPendingTransfersMock.results.find(
        (item) => item.id === PENDING_TRANSFER_ID,
      ),
    ),
  ),
  getSubaddresses: jest.fn(() => Promise.resolve(walletSubaddressesMock)),
  createSubaddress: jest.fn(() =>
    Promise.resolve(walletSubaddressesMock.results[0]),
  ),
  updateSubaddress: jest.fn(() =>
    of(walletSubaddressesMock.results.find((item) => item.address === ADDRESS)),
  ),
  partialUpdateSubaddress: jest.fn(() =>
    of(walletSubaddressesMock.results.find((item) => item.address === ADDRESS)),
  ),
  getTransactions: jest.fn(() => of(walletTransactionsMock)),
  getTransaction: jest.fn(() =>
    of(
      walletTransactionsMock.results.find((item) => item.id === TRANSACTION_ID),
    ),
  ),
  sendTransaction: jest.fn(() =>
    Promise.resolve(walletTransactionSendResponseMock),
  ),
  createUnsignedTransaction: jest.fn(() =>
    Promise.resolve(taskResponseCreateTxResultMock),
  ),
  // submitTransaction: jest.fn(() => of("task_id")),
  // signWalletSubaddress: jest.fn(() => of(walletSubaddressesMock.results[0])),
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
