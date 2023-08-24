import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { WalletController } from "./wallet.controller";
import { WalletService } from "./wallet.service";
import { MoneroModule } from "../monero/monero.module";
import { RinoModule } from "../rino/rino.module";

@Module({
  imports: [ConfigModule, MoneroModule, RinoModule],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
