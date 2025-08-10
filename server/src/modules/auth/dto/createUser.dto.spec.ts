import { validate } from "class-validator";
import { CreateUserDto } from "./createUser.dto";

describe("CreateUserDto", () => {
  let dto: CreateUserDto;

  beforeEach(() => {
    dto = new CreateUserDto();
  });

  describe("Valid DTOs", () => {
    it("should pass validation with all valid fields", async () => {
      dto.username = "AdminSys819";
      dto.phoneNumber = "+33123456789";
      dto.password = "Abcdefg1*";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should pass validation with various valid usernames", async () => {
      const validUsernames = [
        "A",
        "AdminSys819",
        "user123",
        "TestUser",
        "a".repeat(50),
        "UserWith Spaces",
        "User-With-Dashes",
        "User_With_Underscores",
        "User.With.Dots",
        "User@Email",
        "UserWith123Numbers",
        "SpecialChars!@#$%",
        "José",
        "用户名",
      ];

      for (const username of validUsernames) {
        const testDto = new CreateUserDto();
        testDto.username = username;
        testDto.phoneNumber = "+33123456789";
        testDto.password = "ValidPass123!";

        const errors = await validate(testDto);
        expect(errors).toHaveLength(0);
      }
    });

    it("should pass validation with various valid French phone numbers", async () => {
      const validPhones = [
        "+33123456789",
        "+33612345678",
        "+33987654321",
        "+33612349876",
        "+33145678901",
        "+33298765432",
      ];

      for (const phone of validPhones) {
        const testDto = new CreateUserDto();
        testDto.username = "TestUser";
        testDto.phoneNumber = phone;
        testDto.password = "ValidPass123!";

        const errors = await validate(testDto);
        expect(errors).toHaveLength(0);
      }
    });

    it("should pass validation with various strong passwords", async () => {
      const strongPasswords = [
        "Abcdefg1*",
        "Password1@",
        "MyStrongP@ss1",
        "Complex123!",
        "Hello@2012",
        "SecureP@ssw0rd123$",
        "A1@bcdefg",
      ];

      for (const password of strongPasswords) {
        const testDto = new CreateUserDto();
        testDto.username = "TestUser";
        testDto.phoneNumber = "+33123456789";
        testDto.password = password;

        const errors = await validate(testDto);
        expect(errors).toHaveLength(0);
      }
    });
  });

  describe("Invalid username", () => {
    beforeEach(() => {
      dto.phoneNumber = "+33123456789";
      dto.password = "ValidPass123!";
    });

    it("should fail validation for missing username", async () => {
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("username");
      expect(errors[0].constraints).toHaveProperty("isLength");
    });

    it("should fail validation for empty username", async () => {
      dto.username = "";

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("username");
      expect(errors[0].constraints).toHaveProperty("isLength");
    });

    it("should fail validation for username too long", async () => {
      dto.username = "a".repeat(51);

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("username");
      expect(errors[0].constraints).toHaveProperty("isLength");
    });

    it("should fail validation for non-string username", async () => {
      Object.assign(dto, { username: 12345 });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      const usernameError = errors.find(
        (error) => error.property === "username",
      );
      expect(usernameError).toBeDefined();
    });

    it("should fail validation for null/undefined username", async () => {
      Object.assign(dto, { username: null });
      let errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);

      Object.assign(dto, { username: undefined });
      errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe("Invalid phone number", () => {
    beforeEach(() => {
      dto.username = "TestUser";
      dto.password = "ValidPass123!";
    });

    it("should fail validation for missing phone number", async () => {
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("phoneNumber");
      expect(errors[0].constraints).toHaveProperty("isLength");
    });

    it("should fail validation for empty phone number", async () => {
      dto.phoneNumber = "";

      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("phoneNumber");
      expect(errors[0].constraints).toHaveProperty("isLength");
    });

    it("should fail validation for non-French phone numbers", async () => {
      const invalidPhones = [
        "+1234567890",
        "+44123456789",
        "+49123456789",
        "+8612345678",
        "+39123456789",
      ];

      for (const phone of invalidPhones) {
        const testDto = new CreateUserDto();
        testDto.username = "TestUser";
        testDto.phoneNumber = phone;
        testDto.password = "ValidPass123!";

        const errors = await validate(testDto);
        expect(errors.length).toBeGreaterThan(0);
        const phoneError = errors.find(
          (error) => error.property === "phoneNumber",
        );
        expect(phoneError).toBeDefined();
      }
    });

    it("should fail validation for phone number too long", async () => {
      dto.phoneNumber = "+33" + "1".repeat(50);

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      const phoneError = errors.find(
        (error) => error.property === "phoneNumber",
      );
      expect(phoneError).toBeDefined();
    });
  });

  describe("Invalid password", () => {
    beforeEach(() => {
      dto.username = "TestUser";
      dto.phoneNumber = "+33123456789";
    });

    it("should fail validation for missing password", async () => {
      const errors = await validate(dto);

      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("password");
      expect(errors[0].constraints).toHaveProperty("isStrongPassword");
    });

    it("should fail validation for weak passwords", async () => {
      const weakPasswords = [
        "",
        "pass",
        "password",
        "Password",
        "Password1",
        "password1@",
        "PASSWORD1@",
        "Password@",
        "12345678@A",
        "a".repeat(8),
      ];

      for (const password of weakPasswords) {
        const testDto = new CreateUserDto();
        testDto.username = "TestUser";
        testDto.phoneNumber = "+33123456789";
        testDto.password = password;

        const errors = await validate(testDto);
        expect(errors.length).toBeGreaterThan(0);
        const passwordError = errors.find(
          (error) => error.property === "password",
        );
        expect(passwordError).toBeDefined();
      }
    });

    it("should fail validation for password too short", async () => {
      dto.password = "Str0ng!";

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe("password");
      expect(errors[0].constraints).toHaveProperty("isLength");
    });

    it("should fail validation for password too long", async () => {
      dto.password = "A1@" + "b".repeat(50);

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      const passwordError = errors.find(
        (error) => error.property === "password",
      );
      expect(passwordError).toBeDefined();
      expect(passwordError!.constraints).toHaveProperty("isLength");
    });

    it("should fail validation for password missing required character types", async () => {
      const invalidPasswords = [
        "strongpass123!",
        "STRONGPASS123!",
        "StrongPass!",
        "StrongPass123",
      ];

      for (const password of invalidPasswords) {
        const testDto = new CreateUserDto();
        testDto.username = "TestUser";
        testDto.phoneNumber = "+33123456789";
        testDto.password = password;

        const errors = await validate(testDto);
        expect(errors.length).toBeGreaterThan(0);
        const passwordError = errors.find(
          (error) => error.property === "password",
        );
        expect(passwordError).toBeDefined();
        expect(passwordError!.constraints).toHaveProperty("isStrongPassword");
      }
    });
  });

  describe("Multiple validation errors", () => {
    it("should return multiple errors when all fields are invalid", async () => {
      dto.username = "";
      dto.phoneNumber = "invalid";
      dto.password = "weak";

      const errors = await validate(dto);

      expect(errors).toHaveLength(3);

      const usernameError = errors.find(
        (error) => error.property === "username",
      );
      const phoneError = errors.find(
        (error) => error.property === "phoneNumber",
      );
      const passwordError = errors.find(
        (error) => error.property === "password",
      );

      expect(usernameError).toBeDefined();
      expect(phoneError).toBeDefined();
      expect(passwordError).toBeDefined();
    });

    it("should handle non-string values for all fields", async () => {
      Object.assign(dto, { username: 123, phoneNumber: 456, password: 789 });

      const errors = await validate(dto);

      expect(errors).toHaveLength(3);
      expect(errors.map((e) => e.property).sort()).toEqual([
        "password",
        "phoneNumber",
        "username",
      ]);
    });
  });

  describe("Edge cases", () => {
    it("should handle minimum valid lengths", async () => {
      dto.username = "A";
      dto.phoneNumber = "+33123456789";
      dto.password = "A1@bcdef";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should handle maximum valid lengths", async () => {
      dto.username = "a".repeat(50);
      dto.phoneNumber = "+33123456789";
      dto.password = "A1@" + "b".repeat(46);

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should validate usernames with special characters", async () => {
      const specialUsernames = [
        "User@Domain",
        "User.Name",
        "User-Name",
        "User_Name",
        "User Name",
        "User123!@#",
        "José María",
        "用户123",
      ];

      for (const username of specialUsernames) {
        const testDto = new CreateUserDto();
        testDto.username = username;
        testDto.phoneNumber = "+33123456789";
        testDto.password = "ValidPass123!";

        const errors = await validate(testDto);
        expect(errors).toHaveLength(0);
      }
    });

    it("should validate passwords with all required character types", async () => {
      dto.username = "TestUser";
      dto.phoneNumber = "+33123456789";
      dto.password = "Aa1!bcdefg";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should validate passwords with various symbols", async () => {
      const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?/";

      for (const symbol of symbols) {
        const testDto = new CreateUserDto();
        testDto.username = "TestUser";
        testDto.phoneNumber = "+33123456789";
        testDto.password = `Password1${symbol}`;

        const errors = await validate(testDto);
        expect(errors).toHaveLength(0);
      }
    });
  });
});
