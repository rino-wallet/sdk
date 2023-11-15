import { ApiProperty } from "@nestjs/swagger";

export class Page<T> {
  @ApiProperty()
  count: number;

  @ApiProperty()
  next: string;

  @ApiProperty()
  previous: string;

  results: T[];
}
