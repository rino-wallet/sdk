import { WalletTransactionSendResponse } from "../entities";

import { taskResponseSubmitTxResultMock } from "./task.response.mock";

export const walletTransactionSendResponseMock: WalletTransactionSendResponse =
  {
    requiresApproval: false,
    data: taskResponseSubmitTxResultMock,
  };
