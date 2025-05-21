import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

import { user, user_password, user_phonenumber } from "@entities/user.entity";

describe("AuthController", () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(user),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(user_password),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(user_phonenumber),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue("mocked-jwt-token"),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
