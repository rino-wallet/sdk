import { ApiProperty } from "@nestjs/swagger";

export class WalletActivityEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  author: string;

  @ApiProperty()
  action: string;

  @ApiProperty()
  ip_address: string;

  @ApiProperty()
  country_code: string;

  @ApiProperty()
  user_agent: string;
}
