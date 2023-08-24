import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { RinoService } from "./rino.service";
import { HttpConfigService } from "./http.config.service";

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useClass: HttpConfigService,
      inject: [ConfigService],
    }),
  ],
  providers: [RinoService],
  exports: [RinoService],
})
export class RinoModule {}
