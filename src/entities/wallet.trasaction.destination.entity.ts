import { ApiProperty } from "@nestjs/swagger";

export class WalletTransactionDestinationEntity {
  @ApiProperty()
  index: number;

  @ApiProperty()
  address: string;

  @ApiProperty()
  address_label: string;

  @ApiProperty()
  amount: string;
}
