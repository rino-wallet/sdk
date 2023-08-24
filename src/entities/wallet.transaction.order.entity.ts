import { ApiProperty } from "@nestjs/swagger";

export class WalletTransactionOrderEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  created_by: number;

  @ApiProperty()
  paid_with: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  expires_at: string;

  @ApiProperty()
  platform: string;

  @ApiProperty()
  platform_order_id: string;

  @ApiProperty()
  payment_currency: string;

  @ApiProperty()
  payment_amount: string;

  @ApiProperty()
  payment_address: string;

  @ApiProperty()
  payment_txid: string;

  @ApiProperty()
  refund_address: string;

  @ApiProperty()
  paid_at: string;

  @ApiProperty()
  acknowledged_at: string;

  @ApiProperty()
  outgoing_currency: string;

  @ApiProperty()
  outgoing_amount: string;

  @ApiProperty()
  outgoing_address: string;

  @ApiProperty()
  outgoing_txid: string;
}
