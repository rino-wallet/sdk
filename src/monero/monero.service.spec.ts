import { Test, TestingModule } from "@nestjs/testing";
import { MoneroService } from "./monero.service";
import { ConfigModule } from "@nestjs/config";

import config from "../config/test.config";

describe("MoneroService", () => {
  let service: MoneroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [config],
        }),
      ],
      providers: [MoneroService],
    }).compile();

    service = module.get<MoneroService>(MoneroService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
