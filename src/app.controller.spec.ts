import { Test, TestingModule } from "@nestjs/testing";
import { of } from "rxjs";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    })
      .useMocker((token) => {
        if (token === AppService) {
          return {
            getHealth: jest.fn().mockResolvedValue(of(200)),
          };
        }
      })
      .compile();

    appController = app.get<AppController>(AppController);
  });

  describe("root", () => {
    it("should be defined", () => {
      expect(appController).toBeDefined();
    });
  });
});
