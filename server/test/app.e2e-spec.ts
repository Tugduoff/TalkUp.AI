import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/ (GET)", () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return request(app.getHttpServer())
      .get("/")
      .expect(200)
      .expect("Hello World!");
  });
  it("/updatePassword (PUT)", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await request(app.getHttpServer())
      .post("/register")
      .send({
        username: "name",
        phoneNumber: "0600000000",
        password: "oldPassword",
      })
      .expect(201);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(app.getHttpServer())
      .put("/updatePassword")
      .send({
        phoneNumber: "0600000000",
        newPassword: "newSecurePassword123",
      })
      .expect(200);
    expect(res.body as boolean).toEqual(true);
  });
  it("/updatePassword (PUT)", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const res = await request(app.getHttpServer())
      .put("/updatePassword")
      .send({
        phoneNumber: "0999999999", // non-existent number
        newPassword: "somePassword",
      })
      .expect(401);
    expect((res.body as { message: string }).message).toBe(
      "There is no user with that phone number",
    );
  });
  it("/updatePassword (PUT)", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await request(app.getHttpServer())
      .put("/updatePassword")
      .send({}) // no data send
      .expect(400);
  });
});
