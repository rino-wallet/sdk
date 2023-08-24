import { ApiProperty } from "@nestjs/swagger";

export class WalletPendingTransferEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  creator: string;

  @ApiProperty()
  rejected_by: string | null;

  @ApiProperty()
  address: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  memo: string;

  @ApiProperty()
  min_approvals: number;

  @ApiProperty()
  signed_multisig_tx: string;

  @ApiProperty()
  approvals: Array<{
    user: string;
    created_at: string;
  }>;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  submitted_at: string | null;
}
