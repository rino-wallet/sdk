import { ApiProperty } from "@nestjs/swagger";

import { WalletTransactionDestinationEntity } from "./wallet.trasaction.destination.entity";
import { WalletTransactionOrderEntity } from "./wallet.transaction.order.entity";

export class WalletTransactionEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: string;

  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  direction: string;

  @ApiProperty()
  fee: string;

  @ApiProperty()
  confirmations: number;

  @ApiProperty({ isArray: true, type: WalletTransactionDestinationEntity })
  destinations: WalletTransactionDestinationEntity[];

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  memo: string;

  @ApiProperty()
  tx_to_self: false;

  @ApiProperty()
  order?: WalletTransactionOrderEntity;
}
