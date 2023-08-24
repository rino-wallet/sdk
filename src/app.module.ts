import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MoneroModule } from "./monero/monero.module";
import { RinoModule } from "./rino/rino.module";
import { WalletModule } from "./wallet/wallet.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        RINO_API_KEY: Joi.string().required(),
        RINO_ACCOUNT_PASSWORD: Joi.string().required(),
        RINO_WALLET_ID: Joi.string().required(),
        RINO_ENV: Joi.string().valid("test", "prod").default("test"),
        RINO_PORT: Joi.number().default(3000),
        RINO_API_URL_TEST: Joi.string().default(
          "https://app.test.rino.io/api/v1",
        ),
        RINO_API_URL_PROD: Joi.string().default("https://app.rino.io/api/v1"),
      }),
    }),
    WalletModule,
    RinoModule,
    MoneroModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
