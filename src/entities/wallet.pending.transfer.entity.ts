import { ApiProperty } from "@nestjs/swagger";

class WalletPendingTransferApproval {
  @ApiProperty()
  user: string;

  @ApiProperty()
  created_at: string;
}

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

  @ApiProperty({ isArray: true, type: WalletPendingTransferApproval })
  approvals: WalletPendingTransferApproval[];

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  submitted_at: string | null;
}
