import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UnauthorizedException } from "@nestjs/common";

import { UsersService } from "./users.service";
import { user, user_phone_number, user_password } from "@entities/user.entity";

describe("UsersService", () => {
  let service: UsersService;
  let mockUserRepo: Partial<Repository<user>>;
  let mockPhoneNumberRepo: Partial<Repository<user_phone_number>>;
  let mockPasswordRepo: Partial<Repository<user_password>>;

  const mockUser = {
    user_id: "test-user-id",
    username: "testuser",
    profile_picture: null,
    provider: null,
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
    password: "hashedpassword123",
    user: null as any,
  };

  beforeEach(async () => {
    mockUserRepo = {
      findOne: jest.fn(),
    };

    mockPhoneNumberRepo = {
      findOne: jest.fn(),
    };

    mockPasswordRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    } as Partial<Repository<user_password>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(user),
          useValue: mockUserRepo,
        },
        {
          provide: getRepositoryToken(user_phone_number),
          useValue: mockPhoneNumberRepo,
        },
        {
          provide: getRepositoryToken(user_password),
          useValue: mockPasswordRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findUserWithPasswordByPhoneNumber", () => {
    it("should return user with password hash when found", async () => {
      mockPhoneNumberRepo.findOne = jest
        .fn()
        .mockResolvedValue(mockPhoneNumber);
      mockPasswordRepo.findOne = jest.fn().mockResolvedValue(mockPassword);
      mockUserRepo.findOne = jest.fn().mockResolvedValue(mockUser);

      const result =
        await service.findUserWithPasswordByPhoneNumber("+33640404040");

      expect(result).toEqual({
        user: mockUser,
        passwordHash: "hashedpassword123",
      });
      expect(mockPhoneNumberRepo.findOne).toHaveBeenCalledWith({
        where: { phone_number: "+33640404040" },
      });
      expect(mockPasswordRepo.findOne).toHaveBeenCalledWith({
        where: { user_id: "test-user-id" },
      });
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { user_id: "test-user-id" },
      });
    });

    it("should return null when phone number not found", async () => {
      mockPhoneNumberRepo.findOne = jest.fn().mockResolvedValue(null);

      const result =
        await service.findUserWithPasswordByPhoneNumber("+33640404040");

      expect(result).toBeNull();
      expect(mockPhoneNumberRepo.findOne).toHaveBeenCalledWith({
        where: { phone_number: "+33640404040" },
      });
      expect(mockPasswordRepo.findOne).not.toHaveBeenCalled();
      expect(mockUserRepo.findOne).not.toHaveBeenCalled();
    });

    it("should return null when password not found", async () => {
      mockPhoneNumberRepo.findOne = jest
        .fn()
        .mockResolvedValue(mockPhoneNumber);
      mockPasswordRepo.findOne = jest.fn().mockResolvedValue(null);

      const result =
        await service.findUserWithPasswordByPhoneNumber("+33640404040");

      expect(result).toBeNull();
    });

    it("should return null when user not found", async () => {
      mockPhoneNumberRepo.findOne = jest
        .fn()
        .mockResolvedValue(mockPhoneNumber);
      mockPasswordRepo.findOne = jest.fn().mockResolvedValue(mockPassword);
      mockUserRepo.findOne = jest.fn().mockResolvedValue(null);

      const result =
        await service.findUserWithPasswordByPhoneNumber("+33640404040");

      expect(result).toBeNull();
    });
  });

  describe("changeUserPassword", () => {
    it("should throw UnauthorizedException when phone number not found", async () => {
      mockPhoneNumberRepo.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        service.changeUserPassword("+33640404040", "newPassword123"),
      ).rejects.toThrow(
        new UnauthorizedException("There is no user with that phone number"),
      );

      expect(mockPhoneNumberRepo.findOne).toHaveBeenCalledWith({
        where: { phone_number: "+33640404040" },
      });
    });

    it("should create new password entry when user has no password", async () => {
      const newPasswordEntity: user_password = {
        ...mockPassword,
        password: "newHashedPassword",
      };

      mockPhoneNumberRepo.findOne = jest
        .fn()
        .mockResolvedValue(mockPhoneNumber);
      mockPasswordRepo.findOne = jest.fn().mockResolvedValue(null);
      mockPasswordRepo.create = jest.fn().mockReturnValue(newPasswordEntity);
      mockPasswordRepo.save = jest.fn((_entity: user_password) =>
        Promise.resolve(newPasswordEntity),
      ) as unknown as typeof mockPasswordRepo.save;

      jest.doMock("@common/utils/passwordHasher", () => ({
        hashPassword: jest.fn().mockResolvedValue("newHashedPassword"),
      }));

      const result = await service.changeUserPassword(
        "+33640404040",
        "newPassword123",
      );

      expect(result).toBe(true);
      expect(mockPasswordRepo.create).toHaveBeenCalledWith({
        password: expect.stringContaining("") as unknown,
        user_id: "test-user-id",
      });
      expect(mockPasswordRepo.save).toHaveBeenCalledWith(newPasswordEntity);
    });

    it("should update existing password when user has password", async () => {
      const existingPassword = { ...mockPassword };
      mockPhoneNumberRepo.findOne = jest
        .fn()
        .mockResolvedValue(mockPhoneNumber);
      mockPasswordRepo.findOne = jest.fn().mockResolvedValue(existingPassword);
      const updatedPassword: user_password = {
        ...existingPassword,
        password: "newHashedPassword",
      };
      mockPasswordRepo.save = jest.fn((_entity: Partial<user_password>) =>
        Promise.resolve(updatedPassword),
      ) as unknown as typeof mockPasswordRepo.save;

      const result = await service.changeUserPassword(
        "+33640404040",
        "newPassword123",
      );

      expect(result).toBe(true);
      expect(mockPasswordRepo.save).toHaveBeenCalledWith({
        ...existingPassword,
        password: expect.stringContaining("") as unknown,
      });
    });
  });
});
