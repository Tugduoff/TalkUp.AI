import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { AuthService } from "./auth.service";

import { user, user_password, user_phonenumber } from "@entities/user.entity";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeUndefined();
  });
});
