import { ApiProperty } from "@nestjs/swagger";

export class WalletTransactionCreateResponse {
  @ApiProperty()
  txs_hex: string;
}
