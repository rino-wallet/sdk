import { ApiProperty } from "@nestjs/swagger";

export class TaskResponseCreateTxResult {
  @ApiProperty()
  txs_hex: string;

  @ApiProperty()
  multisig_hex: string;
}
