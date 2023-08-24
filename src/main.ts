import { NestFactory } from "@nestjs/core";
import { VersioningType } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import { GlobalExceptionsFilter } from "./filters/global.exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalFilters(new GlobalExceptionsFilter());

  const configService: ConfigService = app.get(ConfigService);
  const port = configService.get<number>("RINO_PORT");

  const config = new DocumentBuilder()
    .setTitle("Rino SDK")
    .setDescription("Rino SDK API Documentation")
    .setVersion("0.1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(port);
}

bootstrap();
