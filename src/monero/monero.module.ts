import { Module } from "@nestjs/common";
import { MoneroService } from "./monero.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule],
  providers: [MoneroService],
  exports: [MoneroService],
})
export class MoneroModule {}
