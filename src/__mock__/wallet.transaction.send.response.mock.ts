import { WalletTransactionSendResponse } from "../entities";

import { submitResultMock } from "./task.response.mock";

export const walletTransactionSendResponseMock: WalletTransactionSendResponse =
  {
    requiresApproval: false,
    result: submitResultMock,
  };
