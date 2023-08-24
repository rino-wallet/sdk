import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

import { AppService } from "./app.service";
import { StatusEntity } from "./entities";

@Controller({
  version: "1",
})
@UseInterceptors(ClassSerializerInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("health")
  @ApiOperation({ summary: "Checks the service health" })
  @ApiResponse({
    status: 200,
    description: "The service status",
    type: StatusEntity,
  })
  getHealth(): Observable<StatusEntity> {
    return this.appService.getHealth();
  }
}
