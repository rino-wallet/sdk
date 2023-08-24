import { ApiProperty } from "@nestjs/swagger";

export class WalletRemovedSpenderEntity {
  @ApiProperty()
  user: string;

  @ApiProperty()
  deleted_at: string;
}
