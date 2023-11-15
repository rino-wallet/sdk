import { NestFactory } from "@nestjs/core";
import { VersioningType } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import * as path from "path";
import { writeFileSync } from "fs";

import { AppModule } from "./app.module";
import { GlobalExceptionsFilter } from "./filters/global.exception.filter";

async function generateDocs() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalFilters(new GlobalExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle("Rino SDK")
    .setDescription("Rino SDK API Documentation")
    .setVersion("0.1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  const outputPath = path.resolve(process.cwd(), "swagger.json");
  writeFileSync(outputPath, JSON.stringify(document), { encoding: "utf8" });

  await app.close();
}

generateDocs();
