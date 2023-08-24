import { TaskResponseSubmitTxResult } from "./task.response.submittx.result";
import { WalletPendingTransferEntity } from "./wallet.pending.transfer.entity";

export class WalletTransactionSendResponse {
  requiresApproval: boolean;
  data: TaskResponseSubmitTxResult | WalletPendingTransferEntity;
}
