import { Test, TestingModule } from "@nestjs/testing";
import { createMock } from "@golevelup/ts-jest";
import { of } from "rxjs";

import { AppService } from "./app.service";
import { RinoService } from "./rino/rino.service";

describe("AppService", () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: RinoService,
          useValue: createMock<RinoService>({
            getHealth: jest.fn().mockResolvedValue(of(200)),
          }),
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
