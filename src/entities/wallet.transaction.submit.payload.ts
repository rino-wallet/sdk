import { ApiProperty } from "@nestjs/swagger";

export class WalletTransactionSubmitPayload {
  @ApiProperty()
  txs_hex: string;
}
