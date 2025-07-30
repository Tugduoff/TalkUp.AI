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
import { organization } from "@entities/organization.entity";
import { UserOrganization } from "@entities/userOrganization.entity";
import { LinkedInOAuthService } from "./services/linkedin-oauth.service";
import { OrganizationService } from "../organization/organization.service";
import { SSOAuthenticationService } from "./services/sso-authentication.service";
import { UserRepositoryService } from "./services/user-repository.service";
import { TokenService } from "./services/token.service";

import { UsersService } from "@src/users/users.service";

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
          provide: getRepositoryToken(organization),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserOrganization),
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

    controller = module.get<AuthController>(AuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
