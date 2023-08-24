import { ApiProperty } from "@nestjs/swagger";

import { Destination } from "./destination.entity";
import { WalletTransactionPriority } from "./wallet.transaction.priority";

export class WalletTransactionSendPayload {
  @ApiProperty()
  destination: Destination;

  @ApiProperty()
  priority: WalletTransactionPriority;
}
