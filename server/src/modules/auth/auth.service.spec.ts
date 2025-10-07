import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConflictException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/createUser.dto";

import { user, user_password, user_email } from "@entities/user.entity";

jest.mock("bcrypt");
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

jest.mock("@common/utils/passwordHasher", () => ({
  hashPassword: jest.fn().mockResolvedValue("hashed-password"),
}));

describe("AuthService", () => {
  let service: AuthService;
  let mockUserRepo: Partial<Repository<user>>;
  let mockUserEmailRepo: Partial<Repository<user_email>>;
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

  const mockEmail = {
    email_id: 1,
    user_id: "test-user-id",
    email: "test@example.com",
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

    mockUserEmailRepo = {
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
          provide: getRepositoryToken(user_email),
          useValue: mockUserEmailRepo,
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
      email: "test@example.com",
      password: "password123",
    };

    it("should successfully register a new user", async () => {
      mockUserEmailRepo.findOne = jest.fn().mockResolvedValue(null);
      mockUserRepo.create = jest.fn().mockReturnValue(mockUser);
      mockUserRepo.save = jest.fn().mockResolvedValue(mockUser);
      mockUserPasswordRepo.create = jest.fn().mockReturnValue(mockPassword);
      mockUserPasswordRepo.save = jest.fn().mockResolvedValue(mockPassword);
      mockUserEmailRepo.create = jest.fn().mockReturnValue(mockEmail);
      mockUserEmailRepo.save = jest.fn().mockResolvedValue(mockEmail);
      mockJwtService.signAsync = jest.fn().mockResolvedValue("jwt-token");

      const result = await service.register(createUserDto);

      expect(result).toEqual({ accessToken: "jwt-token" });
      expect(mockUserEmailRepo.findOne).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(mockUserRepo.create).toHaveBeenCalledWith({
        username: "testuser",
      });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        userId: "test-user-id",
        username: "testuser",
      });
    });

    it("should throw ConflictException if email already exists", async () => {
      mockUserEmailRepo.findOne = jest.fn().mockResolvedValue(mockEmail);

      await expect(service.register(createUserDto)).rejects.toThrow(
        new ConflictException("An account with this email already exists"),
      );

      expect(mockUserEmailRepo.findOne).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(mockUserRepo.create).not.toHaveBeenCalled();
    });
  });

  describe("validateUser", () => {
    const email = "test@example.com";
    const password = "password123";

    it("should successfully validate user with correct credentials", async () => {
      mockUserEmailRepo.findOne = jest.fn().mockResolvedValue(mockEmail);
      mockUserPasswordRepo.findOne = jest.fn().mockResolvedValue(mockPassword);
      mockUserRepo.findOne = jest.fn().mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.validateUser(email, password);

      expect(result).toEqual(mockUser);
      expect(mockUserEmailRepo.findOne).toHaveBeenCalledWith({
        where: { email: email },
      });
      expect(mockUserPasswordRepo.findOne).toHaveBeenCalledWith({
        where: { user_id: "test-user-id" },
      });
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { user_id: "test-user-id" },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, "hashed-password");
    });

    it("should throw UnauthorizedException if email not found", async () => {
      mockUserEmailRepo.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.validateUser(email, password)).rejects.toThrow(
        new UnauthorizedException("Email not found"),
      );

      expect(mockUserEmailRepo.findOne).toHaveBeenCalledWith({
        where: { email: email },
      });
      expect(mockUserPasswordRepo.findOne).not.toHaveBeenCalled();
    });

    it("should throw UnauthorizedException if password entity not found", async () => {
      mockUserEmailRepo.findOne = jest.fn().mockResolvedValue(mockEmail);
      mockUserPasswordRepo.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.validateUser(email, password)).rejects.toThrow(
        new UnauthorizedException("Email not found"),
      );
    });

    it("should throw UnauthorizedException if user entity not found", async () => {
      mockUserEmailRepo.findOne = jest.fn().mockResolvedValue(mockEmail);
      mockUserPasswordRepo.findOne = jest.fn().mockResolvedValue(mockPassword);
      mockUserRepo.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.validateUser(email, password)).rejects.toThrow(
        new UnauthorizedException("Email not found"),
      );
    });

    it("should throw UnauthorizedException if password doesn't match", async () => {
      mockUserEmailRepo.findOne = jest.fn().mockResolvedValue(mockEmail);
      mockUserPasswordRepo.findOne = jest.fn().mockResolvedValue(mockPassword);
      mockUserRepo.findOne = jest.fn().mockResolvedValue(mockUser);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      await expect(service.validateUser(email, password)).rejects.toThrow(
        new UnauthorizedException("Invalid password"),
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(password, "hashed-password");
    });
  });

  describe("login", () => {
    it("should return access token for valid user", async () => {
      mockJwtService.signAsync = jest
        .fn()
        .mockResolvedValue("signed-jwt-token");

      const result = await service.login(mockUser);

      expect(result).toEqual({ accessToken: "signed-jwt-token" });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        userId: "test-user-id",
        username: "testuser",
      });
    });

    it("should handle different user IDs correctly", async () => {
      const differentUser = { ...mockUser, user_id: "different-user-id" };
      mockJwtService.signAsync = jest.fn().mockResolvedValue("different-token");

      const result = await service.login(differentUser);

      expect(result).toEqual({ accessToken: "different-token" });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        userId: "different-user-id",
        username: "testuser",
      });
    });
  });
});
