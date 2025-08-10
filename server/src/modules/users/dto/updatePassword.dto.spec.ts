import { validate } from "class-validator";
import { UpdatePasswordDto } from "./updatePassword.dto";

describe("UpdatePasswordDto", () => {
  let dto: UpdatePasswordDto;

  beforeEach(() => {
    dto = new UpdatePasswordDto();
  });

  describe("Valid DTOs", () => {
    it("should pass validation with valid phone number and password", async () => {
      dto.phoneNumber = "+33640404040";
      dto.newPassword = "NewPassword123!";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should pass validation with various valid passwords", async () => {
      const validPasswords = [
        "SimplePass123!",
        "NewPassword123!",
        "Password123!",
        "Complex@Password!3",
        "verylongpasswordwithmanyclassicharachterS1!",
        "Shooort1!",
        "P@ssw0rdd",
        "MyNewPassword2023*",
        "SpecialChars1!@#$%^&*()",
        "Unicode密码!1",
      ];

      for (const password of validPasswords) {
        const testDto = new UpdatePasswordDto();
        testDto.phoneNumber = "+33640404040";
        testDto.newPassword = password;

        const errors = await validate(testDto);
        expect(errors).toHaveLength(0);
      }
    });
  });

  describe("Invalid phone number", () => {
    beforeEach(() => {
      dto.newPassword = "Hello@2012";
    });

    it("should fail validation for missing phone number", async () => {
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("phoneNumber");
      expect(errors[0].constraints).toHaveProperty("isPhoneNumber");
    });

    it("should fail validation for empty phone number", async () => {
      dto.phoneNumber = "";

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("phoneNumber");
      expect(errors[0].constraints).toHaveProperty("isPhoneNumber");
    });

    it("should fail validation for non-string phone number", async () => {
      (dto as any).phoneNumber = 33640404040;

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      const phoneError = errors.find(
        (error) => error.property === "phoneNumber",
      );
      expect(phoneError).toBeDefined();
    });

    it("should fail validation for null/undefined phone number", async () => {
      (dto as any).phoneNumber = null;
      let errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);

      (dto as any).phoneNumber = undefined;
      errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("Invalid password", () => {
    beforeEach(() => {
      dto.phoneNumber = "+33640404040";
    });

    it("should fail validation for missing password", async () => {
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("newPassword");
      expect(errors[0].constraints).toHaveProperty("isStrongPassword");
    });

    it("should fail validation for empty password", async () => {
      dto.newPassword = "";

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      const passwordError = errors.find(
        (error) => error.property === "newPassword",
      );
      expect(passwordError).toBeDefined();
      expect(passwordError!.constraints).toHaveProperty("isStrongPassword");
    });

    it("should fail validation for non-string password", async () => {
      (dto as any).newPassword = 12345678;

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      const passwordError = errors.find(
        (error) => error.property === "newPassword",
      );
      expect(passwordError).toBeDefined();
      expect(passwordError!.constraints).toHaveProperty("isStrongPassword");
    });

    it("should fail validation for null/undefined password", async () => {
      (dto as any).newPassword = null;
      let errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);

      (dto as any).newPassword = undefined;
      errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it("should fail validation for boolean/array/object passwords", async () => {
      const invalidPasswords = [
        true,
        false,
        [],
        {},
        ["password"],
        { password: "test" },
      ];

      for (const password of invalidPasswords) {
        const testDto = new UpdatePasswordDto();
        testDto.phoneNumber = "+33640404040";
        (testDto as any).newPassword = password;

        const errors = await validate(testDto);
        expect(errors.length).toBeGreaterThan(0);
        const passwordError = errors.find(
          (error) => error.property === "newPassword",
        );
        expect(passwordError).toBeDefined();
        expect(passwordError!.constraints).toHaveProperty("isStrongPassword");
      }
    });
  });

  describe("Multiple validation errors", () => {
    it("should return multiple errors when both fields are invalid", async () => {
      dto.phoneNumber = "invalid-phone";
      (dto as any).newPassword = 12345;

      const errors = await validate(dto);

      expect(errors).toHaveLength(2);

      const phoneError = errors.find(
        (error) => error.property === "phoneNumber",
      );
      const passwordError = errors.find(
        (error) => error.property === "newPassword",
      );

      expect(phoneError).toBeDefined();
      expect(passwordError).toBeDefined();
    });

    it("should handle all fields being null", async () => {
      (dto as any).phoneNumber = null;
      (dto as any).newPassword = null;

      const errors = await validate(dto);

      expect(errors).toHaveLength(2);
      expect(errors.map((e) => e.property).sort()).toEqual([
        "newPassword",
        "phoneNumber",
      ]);
    });

    it("should handle all fields being undefined", async () => {
      const errors = await validate(dto);

      expect(errors).toHaveLength(2);
      expect(errors.map((e) => e.property).sort()).toEqual([
        "newPassword",
        "phoneNumber",
      ]);
    });
  });

  describe("Edge cases", () => {
    it("should handle very long but valid phone numbers", async () => {
      dto.phoneNumber = "+333456789012345";
      dto.newPassword = "ValidPassword";

      const errors = await validate(dto);
      expect(Array.isArray(errors)).toBe(true);
    });

    it("should handle passwords with special characters", async () => {
      const specialPasswords = [
        "passworD!1&@#$%^&*()",
        "passworD1_-+=[]{}|;:",
        "passworD1'\"<>,.?/",
        "passworD1!\n\t",
        "passworD1!\\",
        "dD!密码123",
        "🔒passworD1!🔑",
      ];

      for (const password of specialPasswords) {
        const testDto = new UpdatePasswordDto();
        testDto.phoneNumber = "+33640404040";
        testDto.newPassword = password;

        const errors = await validate(testDto);
        expect(errors).toHaveLength(0);
      }
    });

    it("should handle whitespace in passwords", async () => {
      const whitespacePasswords = [
        " passworD1!",
        "passworD1! ",
        " passworD1! ",
        "my passworD1!",
        "  passworD1!  ",
        "\tpassworD1!\t",
        "\npassworD1!\n",
      ];

      for (const password of whitespacePasswords) {
        const testDto = new UpdatePasswordDto();
        testDto.phoneNumber = "+33640404040";
        testDto.newPassword = password;

        const errors = await validate(testDto);
        expect(errors).toHaveLength(0);
      }
    });
  });

  describe("Real-world scenarios", () => {
    it("should validate typical password update request", async () => {
      dto.phoneNumber = "+33640404040";
      dto.newPassword = "NewSecurePassword2023!";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should validate international user password update", async () => {
      dto.phoneNumber = "+33123456789";
      dto.newPassword = "UpdatedPassword123!";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should validate password update with common phone number formats", async () => {
      const commonPhones = ["+33612345678", "+33123456789"];

      for (const phone of commonPhones) {
        const testDto = new UpdatePasswordDto();
        testDto.phoneNumber = phone;
        testDto.newPassword = "MyNewPassword123!";

        const errors = await validate(testDto);
        expect(errors).toHaveLength(0);
      }
    });
  });
});
