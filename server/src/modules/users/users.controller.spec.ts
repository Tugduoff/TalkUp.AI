import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";

import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UpdatePasswordDto } from "./dto/updatePassword.dto";

describe("UsersController", () => {
  let controller: UsersController;
  let mockUsersService: Partial<UsersService>;

  beforeEach(async () => {
    mockUsersService = {
      changeUserPassword: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("updatePassword", () => {
    const updatePasswordDto: UpdatePasswordDto = {
      email: "test@example.com",
      newPassword: "newPassword123",
    };

    it("should successfully update password", async () => {
      mockUsersService.changeUserPassword = jest.fn().mockResolvedValue(true);

      const result = await controller.updatePassword(updatePasswordDto);

      expect(result).toBe(true);
      expect(mockUsersService.changeUserPassword).toHaveBeenCalledWith(
        "test@example.com",
        "newPassword123",
      );
      expect(mockUsersService.changeUserPassword).toHaveBeenCalledTimes(1);
    });

    it("should throw NotFoundException when user not found", async () => {
      mockUsersService.changeUserPassword = jest
        .fn()
        .mockRejectedValue(
          new NotFoundException("There is no user with that email"),
        );

      await expect(
        controller.updatePassword(updatePasswordDto),
      ).rejects.toThrow(
        new NotFoundException("There is no user with that email"),
      );

      expect(mockUsersService.changeUserPassword).toHaveBeenCalledWith(
        "test@example.com",
        "newPassword123",
      );
      expect(mockUsersService.changeUserPassword).toHaveBeenCalledTimes(1);
    });

    it("should handle service errors properly", async () => {
      const serviceError = new Error("Database connection failed");
      mockUsersService.changeUserPassword = jest
        .fn()
        .mockRejectedValue(serviceError);

      await expect(
        controller.updatePassword(updatePasswordDto),
      ).rejects.toThrow(serviceError);

      expect(mockUsersService.changeUserPassword).toHaveBeenCalledWith(
        "test@example.com",
        "newPassword123",
      );
    });

    it("should pass correct parameters to service", async () => {
      const customDto: UpdatePasswordDto = {
        email: "test@example.com",
        newPassword: "superSecretPassword!@#",
      };

      mockUsersService.changeUserPassword = jest.fn().mockResolvedValue(true);

      await controller.updatePassword(customDto);

      expect(mockUsersService.changeUserPassword).toHaveBeenCalledWith(
        "test@example.com",
        "superSecretPassword!@#",
      );
    });
  });
});
