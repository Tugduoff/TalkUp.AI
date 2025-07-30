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
import { organization } from "@entities/organization.entity";
import { UserOrganization } from "@entities/userOrganization.entity";
import { UsersService } from "@src/users/users.service";
import { LinkedInOAuthService } from "./services/linkedin-oauth.service";
import { OrganizationService } from "../organization/organization.service";
import { SSOAuthenticationService } from "./services/sso-authentication.service";
import { UserRepositoryService } from "./services/user-repository.service";
import { TokenService } from "./services/token.service";
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
          provide: getRepositoryToken(organization),
          useValue: {},
        },
        {
          provide: getRepositoryToken(UserOrganization),
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
        {
          provide: LinkedInOAuthService,
          useValue: {
            getAccessTokenDatasFromQueryCode: jest.fn(),
            getLinkedInProfileFromAccessToken: jest.fn(),
            saveTokenDataFromUser: jest.fn(),
            saveLinkedInUser: jest.fn(),
          },
        },
        {
          provide: OrganizationService,
          useValue: {
            findOrganizationByDomain: jest.fn(),
            findOrganizationBySsoIdentifier: jest.fn(),
            linkUserToOrganization: jest.fn(),
            getUserOrganizationRelation: jest.fn(),
            findOrganizationById: jest.fn(),
          },
        },
        {
          provide: SSOAuthenticationService,
          useValue: {
            authenticateWithSSO: jest.fn(),
          },
        },
        {
          provide: UserRepositoryService,
          useValue: {
            findUserByAnyIdentifier: jest.fn(),
            getAllUsers: jest.fn(),
            getUserById: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            login: jest.fn(),
            generateOrganizationToken: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should throw if user does not exist", async () => {
    mockUserPhoneNumberRepo.findOne.mockResolvedValue(null);

    await expect(
      service.changeUserPassword("0600000000", "newPassword"),
    ).rejects.toThrow("There is no user with that phone number");
  });

  it("should update existing password", async () => {
    mockUserPhoneNumberRepo.findOne.mockResolvedValue({
      user_id: "a1-b2...",
      phone_number_id: 0,
      phone_number: "",
      is_verified: false,
    });
    mockUserPasswordRepo.findOne.mockResolvedValue({
      password: "old",
      user_id: "a1-b2...",
      password_id: 0,
    });
    mockUserPasswordRepo.save.mockResolvedValue({
      password: "newPass",
      user_id: "a1-b2...",
      password_id: 0,
    });

    const result = await service.changeUserPassword("0600000000", "newPass");

    expect(result).toBe(true);
  });
});
