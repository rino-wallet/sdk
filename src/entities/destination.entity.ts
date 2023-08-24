import { ApiProperty } from "@nestjs/swagger";

export class Destination {
  @ApiProperty()
  address: string;

  @ApiProperty()
  amount: string;
}
