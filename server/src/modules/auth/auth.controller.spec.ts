import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HttpService } from "@nestjs/axios";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

import {
  user,
  user_email,
  user_oauth,
  user_password,
  user_phone_number,
} from "@entities/user.entity";

import { UsersService } from "@src/modules/users/users.service";

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
          provide: getRepositoryToken(user_phone_number),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(user_email),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(user_oauth),
          useClass: Repository,
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(null), // Mock findOne method
            create: jest
              .fn()
              .mockResolvedValue({ id: 1, email: "test@example.com" }), // Mock create method
            update: jest
              .fn()
              .mockResolvedValue({ id: 1, email: "updated@example.com" }), // Mock update method
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue("mocked-jwt-token"),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn().mockResolvedValue({
              data: { access_token: "mocked-access-token" },
            }),
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
