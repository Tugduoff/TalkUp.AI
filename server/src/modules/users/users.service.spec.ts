import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";

import { UsersService } from "./users.service";
import { user, user_email, user_password } from "@entities/user.entity";

describe("UsersService", () => {
  let service: UsersService;
  let mockUserRepo: Partial<Repository<user>>;
  let mockEmailRepo: Partial<Repository<user_email>>;
  let mockPasswordRepo: Partial<Repository<user_password>>;

  const mockEmail = {
    email_id: 1,
    user_id: "test-user-id",
    email: "test@example.com",
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

    mockEmailRepo = {
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
          provide: getRepositoryToken(user_email),
          useValue: mockEmailRepo,
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

  describe("changeUserPassword", () => {
    it("should throw NotFoundException when email not found", async () => {
      mockEmailRepo.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        service.changeUserPassword("test@example.com", "newPassword123"),
      ).rejects.toThrow(
        new NotFoundException("There is no user with that email"),
      );

      expect(mockEmailRepo.findOne).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
    });

    it("should create new password entry when user has no password", async () => {
      const newPasswordEntity: user_password = {
        ...mockPassword,
        password: "newHashedPassword",
      };

      mockEmailRepo.findOne = jest.fn().mockResolvedValue(mockEmail);
      mockPasswordRepo.findOne = jest.fn().mockResolvedValue(null);
      mockPasswordRepo.create = jest.fn().mockReturnValue(newPasswordEntity);
      mockPasswordRepo.save = jest.fn((_entity: user_password) =>
        Promise.resolve(newPasswordEntity),
      ) as unknown as typeof mockPasswordRepo.save;

      jest.doMock("@common/utils/passwordHasher", () => ({
        hashPassword: jest.fn().mockResolvedValue("newHashedPassword"),
      }));

      const result = await service.changeUserPassword(
        "test@example.com",
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
      mockEmailRepo.findOne = jest.fn().mockResolvedValue(mockEmail);
      mockPasswordRepo.findOne = jest.fn().mockResolvedValue(existingPassword);
      const updatedPassword: user_password = {
        ...existingPassword,
        password: "newHashedPassword",
      };
      mockPasswordRepo.save = jest.fn((_entity: Partial<user_password>) =>
        Promise.resolve(updatedPassword),
      ) as unknown as typeof mockPasswordRepo.save;

      const result = await service.changeUserPassword(
        "test@example.com",
        "newPassword123",
      );

      expect(result).toBe(true);
      expect(mockPasswordRepo.save).toHaveBeenCalledWith({
        ...existingPassword,
        password: expect.stringContaining("") as unknown,
      });
    });

    it("should throw InternalServerErrorException when save fails", async () => {
      mockEmailRepo.findOne = jest
        .fn()
        .mockRejectedValueOnce(new Error("DB error"));

      await expect(
        service.changeUserPassword("test@example.com", "newPassword123"),
      ).rejects.toThrow(
        new InternalServerErrorException(
          "Internal server error while changing password.",
        ),
      );

      expect(mockEmailRepo.findOne).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
    });
  });
});
