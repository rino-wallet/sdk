import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class StatusEntity {
  @ApiProperty({ example: 200 })
  status: number;

  constructor(status: number) {
    this.status = status;
  }

  @Expose()
  @ApiProperty({ example: "Ok" })
  get message(): string {
    switch (this.status) {
      case 200:
        return "Ok";
      default:
        return "Error";
    }
  }
}
