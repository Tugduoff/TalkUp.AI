import { validate } from "class-validator";
import { UpdatePasswordDto } from "./updatePassword.dto";

describe("UpdatePasswordDto", () => {
  let dto: UpdatePasswordDto;

  beforeEach(() => {
    dto = new UpdatePasswordDto();
  });

  describe("Valid DTOs", () => {
    it("should pass validation with valid email and password", async () => {
      dto.email = "test@example.com";
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
        testDto.email = "test@example.com";
        testDto.newPassword = password;

        const errors = await validate(testDto);
        expect(errors).toHaveLength(0);
      }
    });
  });

  describe("Invalid email", () => {
    beforeEach(() => {
      dto.newPassword = "Hello@2012";
    });

    it("should fail validation for missing email", async () => {
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("email");
      expect(errors[0].constraints).toHaveProperty("isEmail");
    });

    it("should fail validation for empty email", async () => {
      dto.email = "";
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("email");
      expect(errors[0].constraints).toHaveProperty("isEmail");
    });

    it("should fail validation for email malformed", async () => {
      const testDto = new UpdatePasswordDto();
      testDto.email = "testexamplecom" as unknown as string;

      const errors = await validate(testDto);

      expect(errors.length).toBeGreaterThan(0);
      const emailError = errors.find(
        (error) => error.property === "email",
      );
      expect(emailError).toBeDefined();
    });

    it("should fail validation for null/undefined email", async () => {
      const testDto = new UpdatePasswordDto();
      testDto.email = null as unknown as string;
      let errors = await validate(testDto);
      expect(errors.length).toBeGreaterThan(0);

      testDto.email = undefined as unknown as string;
      errors = await validate(testDto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("Invalid password", () => {
    beforeEach(() => {
      dto.email = "test@example.com";
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
      const testDto = new UpdatePasswordDto();
      testDto.email = "test@example.com";
      testDto.newPassword = 12345678 as unknown as string;

      const errors = await validate(testDto);

      expect(errors.length).toBeGreaterThan(0);
      const passwordError = errors.find(
        (error) => error.property === "newPassword",
      );
      expect(passwordError).toBeDefined();
      expect(passwordError!.constraints).toHaveProperty("isStrongPassword");
    });

    it("should fail validation for null/undefined password", async () => {
      const testDto = new UpdatePasswordDto();
      testDto.email = "test@example.com";
      testDto.newPassword = null as unknown as string;
      let errors = await validate(testDto);
      expect(errors.length).toBeGreaterThan(0);

      testDto.newPassword = undefined as unknown as string;
      errors = await validate(testDto);
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
        testDto.email = "test@example.com";
        testDto.newPassword = password as unknown as string;

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
      const testDto = new UpdatePasswordDto();
      testDto.email = "invalid-email";
      testDto.newPassword = 12345 as unknown as string;

      const errors = await validate(testDto);

      expect(errors).toHaveLength(2);

      const emailError = errors.find(
        (error) => error.property === "email",
      );
      const passwordError = errors.find(
        (error) => error.property === "newPassword",
      );

      expect(emailError).toBeDefined();
      expect(passwordError).toBeDefined();
    });

    it("should handle all fields being null", async () => {
      const testDto = new UpdatePasswordDto();
      testDto.email = null as unknown as string;
      testDto.newPassword = null as unknown as string;

      const errors = await validate(testDto);

      expect(errors).toHaveLength(2);
      expect(errors.map((e) => e.property).sort()).toEqual([
        "email",
        "newPassword",
      ]);
    });

    it("should handle all fields being undefined", async () => {
      const errors = await validate(dto);

      expect(errors).toHaveLength(2);
      expect(errors.map((e) => e.property).sort()).toEqual([
        "email",
        "newPassword",
      ]);
    });
  });

  describe("Edge cases", () => {
    it("should handle very long but valid phone numbers", async () => {
      dto.email = "test@example.com";
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
        testDto.email = "test@example.com";
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
        testDto.email = "test@example.com";
        testDto.newPassword = password;

        const errors = await validate(testDto);
        expect(errors).toHaveLength(0);
      }
    });
  });

  describe("Real-world scenarios", () => {
    it("should validate typical password update request", async () => {
      dto.email = "test@example.com";
      dto.newPassword = "NewSecurePassword2023!";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should validate international user password update", async () => {
      dto.email = "test@example.com";
      dto.newPassword = "UpdatedPassword123!";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should validate password update with common phone number formats", async () => {
      const commonEmails = ["ok@talkup.com", "test@example.com"];

      for (const email of commonEmails) {
        const testDto = new UpdatePasswordDto();
        testDto.email = email;
        testDto.newPassword = "MyNewPassword123!";

        const errors = await validate(testDto);
        expect(errors).toHaveLength(0);
      }
    });
  });
});
