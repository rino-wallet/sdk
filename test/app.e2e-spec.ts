import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";

describe.skip("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach((done) => {
    (async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    })();

    // TODO: Improve by adding an inquiry to MoneroService.
    setTimeout(() => done(), 5000);
  });

  it("GET /health", () => {
    return request(app.getHttpServer()).get("/health").expect(200);
  });
});
