import { ApiProperty } from "@nestjs/swagger";

export class WalletMemberEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  access_level: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  user: {
    email: string;
    name: string;
  };

  @ApiProperty()
  wallet: {
    id: string;
    name: string;
  };
}
