import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class StatusEntity {
  @ApiProperty()
  status: number;

  constructor(status: number) {
    this.status = status;
  }

  @Expose()
  @ApiProperty()
  get message(): string {
    switch (this.status) {
      case 200:
        return "Ok";
      default:
        return "Error";
    }
  }
}
