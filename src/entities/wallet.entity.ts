import { ApiProperty } from "@nestjs/swagger";
import { MemberEntity } from "./member.entity";

export class WalletEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  max_daily_amount: number;

  @ApiProperty()
  max_amount: number;

  @ApiProperty()
  min_approvals: number;

  @ApiProperty()
  requires_2fa: boolean;

  @ApiProperty()
  members: MemberEntity[];

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  height: number;

  @ApiProperty()
  address: string;

  @ApiProperty()
  balance: string;

  @ApiProperty()
  unlocked_balance: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  locked_amounts: string[];

  @ApiProperty()
  is_public: boolean;

  @ApiProperty()
  public_slug: string;
}
