import { ApiProperty } from "@nestjs/swagger";

export class WalletSubaddressUpdatePayload {
  @ApiProperty()
  label: string;
}
