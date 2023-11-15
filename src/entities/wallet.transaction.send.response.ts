import { ApiProperty } from "@nestjs/swagger";

import { WalletTransactionSubmitResultResponse } from "./wallet.transaction.submit.result.response";
import { WalletPendingTransferEntity } from "./wallet.pending.transfer.entity";

export class WalletTransactionSendResponse {
  @ApiProperty()
  requiresApproval: boolean;

  @ApiProperty()
  result?: WalletTransactionSubmitResultResponse | WalletPendingTransferEntity;
}
