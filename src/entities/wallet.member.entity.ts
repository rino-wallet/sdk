import { ApiProperty } from "@nestjs/swagger";

class WalletMemberEntityUser {
  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;
}

class WalletMemberEntityWallet {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}
export class WalletMemberEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  access_level: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  user: WalletMemberEntityUser;

  @ApiProperty()
  wallet: WalletMemberEntityWallet;
}
