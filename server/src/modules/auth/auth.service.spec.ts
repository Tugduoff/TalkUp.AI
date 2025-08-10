import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConflictException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/createUser.dto";

import { user, user_password, user_phone_number } from "@entities/user.entity";

jest.mock("bcrypt");
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

jest.mock("@common/utils/passwordHasher", () => ({
  hashPassword: jest.fn().mockResolvedValue("hashed-password"),
}));

describe("AuthService", () => {
  let service: AuthService;
  let mockUserRepo: Partial<Repository<user>>;
  let mockUserPhoneNumberRepo: Partial<Repository<user_phone_number>>;
  let mockUserPasswordRepo: Partial<Repository<user_password>>;
  let mockJwtService: Partial<JwtService>;

  const mockUser: user = {
    user_id: "test-user-id",
    username: "testuser",
    profile_picture: "",
    provider: "",
    verification_code: "",
    last_accessed_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockPhoneNumber = {
    phone_number_id: 1,
    user_id: "test-user-id",
    phone_number: "+33640404040",
    is_verified: false,
  };

  const mockPassword = {
    password_id: 1,
    user_id: "test-user-id",
    password: "hashed-password",
  };

  beforeEach(async () => {
    mockUserRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockUserPhoneNumberRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockUserPasswordRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    mockJwtService = {
      signAsync: jest.fn(),
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(user),
          useValue: mockUserRepo,
        },
        {
          provide: getRepositoryToken(user_phone_number),
          useValue: mockUserPhoneNumberRepo,
        },
        {
          provide: getRepositoryToken(user_password),
          useValue: mockUserPasswordRepo,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("register", () => {
    const createUserDto: CreateUserDto = {
      username: "testuser",
      phoneNumber: "+33640404040",
      password: "password123",
    };

    it("should successfully register a new user", async () => {
      mockUserPhoneNumberRepo.findOne = jest.fn().mockResolvedValue(null);
      mockUserRepo.create = jest.fn().mockReturnValue(mockUser);
      mockUserRepo.save = jest.fn().mockResolvedValue(mockUser);
      mockUserPasswordRepo.create = jest.fn().mockReturnValue(mockPassword);
      mockUserPasswordRepo.save = jest.fn().mockResolvedValue(mockPassword);
      mockUserPhoneNumberRepo.create = jest
        .fn()
        .mockReturnValue(mockPhoneNumber);
      mockUserPhoneNumberRepo.save = jest
        .fn()
        .mockResolvedValue(mockPhoneNumber);
      mockJwtService.signAsync = jest.fn().mockResolvedValue("jwt-token");

      const result = await service.register(createUserDto);

      expect(result).toEqual({ accessToken: "jwt-token" });
      expect(mockUserPhoneNumberRepo.findOne).toHaveBeenCalledWith({
        where: { phone_number: "+33640404040" },
      });
      expect(mockUserRepo.create).toHaveBeenCalledWith({
        username: "testuser",
      });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        userId: "test-user-id",
        username: "testuser",
      });
    });

    it("should throw ConflictException if phone number already exists", async () => {
      mockUserPhoneNumberRepo.findOne = jest
        .fn()
        .mockResolvedValue(mockPhoneNumber);

      await expect(service.register(createUserDto)).rejects.toThrow(
        new ConflictException(
          "An account with this phone number already exists",
        ),
      );

      expect(mockUserPhoneNumberRepo.findOne).toHaveBeenCalledWith({
        where: { phone_number: "+33640404040" },
      });
      expect(mockUserRepo.create).not.toHaveBeenCalled();
    });
  });

  describe("validateUser", () => {
    const phoneNumber = "+33640404040";
    const password = "password123";

    it("should successfully validate user with correct credentials", async () => {
      mockUserPhoneNumberRepo.findOne = jest
        .fn()
        .mockResolvedValue(mockPhoneNumber);
      mockUserPasswordRepo.findOne = jest.fn().mockResolvedValue(mockPassword);
      mockUserRepo.findOne = jest.fn().mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.validateUser(phoneNumber, password);

      expect(result).toEqual(mockUser);
      expect(mockUserPhoneNumberRepo.findOne).toHaveBeenCalledWith({
        where: { phone_number: phoneNumber },
      });
      expect(mockUserPasswordRepo.findOne).toHaveBeenCalledWith({
        where: { user_id: "test-user-id" },
      });
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { user_id: "test-user-id" },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, "hashed-password");
    });

    it("should throw UnauthorizedException if phone number not found", async () => {
      mockUserPhoneNumberRepo.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.validateUser(phoneNumber, password)).rejects.toThrow(
        new UnauthorizedException("Phone number not found"),
      );

      expect(mockUserPhoneNumberRepo.findOne).toHaveBeenCalledWith({
        where: { phone_number: phoneNumber },
      });
      expect(mockUserPasswordRepo.findOne).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedException if password entity not found", async () => {
      mockUserPhoneNumberRepo.findOne = jest
        .fn()
        .mockResolvedValue(mockPhoneNumber);
      mockUserPasswordRepo.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.validateUser(phoneNumber, password)).rejects.toThrow(
        new UnauthorizedException("Phone number not found"),
      );
    });

    it("should throw UnauthorizedException if user entity not found", async () => {
      mockUserPhoneNumberRepo.findOne = jest
        .fn()
        .mockResolvedValue(mockPhoneNumber);
      mockUserPasswordRepo.findOne = jest.fn().mockResolvedValue(mockPassword);
      mockUserRepo.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.validateUser(phoneNumber, password)).rejects.toThrow(
        new UnauthorizedException("Phone number not found"),
      );
    });

    it("should throw UnauthorizedException if password doesn't match", async () => {
      mockUserPhoneNumberRepo.findOne = jest
        .fn()
        .mockResolvedValue(mockPhoneNumber);
      mockUserPasswordRepo.findOne = jest.fn().mockResolvedValue(mockPassword);
      mockUserRepo.findOne = jest.fn().mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      await expect(service.validateUser(phoneNumber, password)).rejects.toThrow(
        new UnauthorizedException("Invalid password"),
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(password, "hashed-password");
    });
  });

  describe("login", () => {
    it("should return access token for valid user", () => {
      mockJwtService.sign = jest.fn().mockReturnValue("signed-jwt-token");

      const result = service.login(mockUser);

      expect(result).toEqual({ access_token: "signed-jwt-token" });
      expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: "test-user-id" });
    });

    it("should handle different user IDs correctly", () => {
      const differentUser = { ...mockUser, user_id: "different-user-id" };
      mockJwtService.sign = jest.fn().mockReturnValue("different-token");

      const result = service.login(differentUser);

      expect(result).toEqual({ access_token: "different-token" });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: "different-user-id",
      });
    });
  });
});
