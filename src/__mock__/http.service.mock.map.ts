import config from "../config/test.config";
import { accountInfoMock } from "./account.info.mock";
import { walletMock } from "./wallet.mock";
import { taskResponseMock } from "./task.response.mock";
import { walletActivitiesMock } from "./wallet.activities.mock";
import { walletMembersMock } from "./wallet.members.mock";
import { walletPendingTransfersMock } from "./wallet.pending.transfers.mock";
import { walletRemovedSpendersMock } from "./wallet.removed.spenders.mock";
import { walletSubaddressesMock } from "./wallet.subaddresses.mock";
import { walletTransactionsMock } from "./wallet.transactions.mock";

import { WalletTransactionSupportedExportTypes } from "../entities";

const {
  RINO_WALLET_ID: WALLET_ID,
  // Test vars
  PENDING_TRANSFER_ID,
  TASK_ID,
  TRANSACTION_ID,
} = config();

export const httpServiceMockMap: Record<string, any> = {
  "GET /health": {},

  "GET /accounts/me": accountInfoMock,

  [`GET /wallets/${WALLET_ID}`]: walletMock,

  [`GET /wallets/${WALLET_ID}/activity`]: walletActivitiesMock,

  [`GET /wallets/${WALLET_ID}/members`]: walletMembersMock,

  [`GET /wallets/${WALLET_ID}/pending_transfers`]: walletPendingTransfersMock,

  [`GET /wallets/${WALLET_ID}/pending_transfers/${PENDING_TRANSFER_ID}`]:
    walletPendingTransfersMock.results.find(
      (item) => item.id === PENDING_TRANSFER_ID,
    ),

  [`GET /wallets/${WALLET_ID}/removed_spenders`]: walletRemovedSpendersMock,

  [`GET /wallets/${WALLET_ID}/subaddresses`]: walletSubaddressesMock,

  [`GET /wallets/${WALLET_ID}/transactions`]: walletTransactionsMock,

  [`GET /wallets/${WALLET_ID}/transactions/${TRANSACTION_ID}`]:
    walletTransactionsMock.results.find((item) => item.id === TRANSACTION_ID),

  [`GET /tasks/${TASK_ID}`]: taskResponseMock,

  [`GET /wallets/${WALLET_ID}/transactions/export/?type=${WalletTransactionSupportedExportTypes.CSV}`]:
    "csv file data",

  [`GET /wallets/${WALLET_ID}/transactions/export/?type=${WalletTransactionSupportedExportTypes.XLS}`]:
    "xls file data",
};
