import { ApiProperty } from "@nestjs/swagger";

export class WalletSubaddressPartialUpdatePayload {
  @ApiProperty()
  label: string;
}
