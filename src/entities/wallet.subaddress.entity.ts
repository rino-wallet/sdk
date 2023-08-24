import { ApiProperty } from "@nestjs/swagger";

export class WalletSubaddressEntity {
  @ApiProperty()
  index: number;

  @ApiProperty()
  address: string;

  @ApiProperty()
  is_used: boolean;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  label?: string;

  @ApiProperty()
  signature?: string;

  @ApiProperty()
  validated?: boolean = false;
}
