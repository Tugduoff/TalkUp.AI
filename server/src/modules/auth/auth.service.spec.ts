import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HttpService } from "@nestjs/axios";

import { AuthService } from "./auth.service";

import {
  user,
  user_email,
  user_oauth,
  user_password,
  user_phone_number,
} from "@entities/user.entity";
import { UsersService } from "@src/modules/users/users.service";
import { Mocked } from "jest-mock";

describe("AuthService", () => {
  let service: AuthService;
  let mockUserPhoneNumberRepo: Mocked<Repository<user_phone_number>>;
  let mockUserPasswordRepo: Mocked<Repository<user_password>>;

  beforeEach(async () => {
    mockUserPhoneNumberRepo = {
      findOne: jest.fn(),
    } as unknown as Mocked<Repository<user_phone_number>>;

    mockUserPasswordRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    } as unknown as Mocked<Repository<user_password>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(user_phone_number),
          useValue: mockUserPhoneNumberRepo,
        },
        {
          provide: getRepositoryToken(user_password),
          useValue: mockUserPasswordRepo,
        },
        {
          provide: getRepositoryToken(user),
          useValue: {},
        },
        {
          provide: getRepositoryToken(user_email),
          useValue: {},
        },
        {
          provide: getRepositoryToken(user_oauth),
          useValue: {},
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(null),
            create: jest
              .fn()
              .mockResolvedValue({ id: 1, email: "test@example.com" }),
            update: jest
              .fn()
              .mockResolvedValue({ id: 1, email: "updated@example.com" }),
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

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
