import { validate } from "class-validator";
import { LoginDto } from "./login.dto";

describe("LoginDto", () => {
  let dto: LoginDto;

  beforeEach(() => {
    dto = new LoginDto();
  });

  describe("Valid DTOs", () => {
    it("should pass validation with valid French phone number and strong password", async () => {
      dto.phoneNumber = "+33123456789";
      dto.password = "StrongPass1@";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should pass validation with different valid French phone formats", async () => {
      const validPhones = [
        "+33123456789",
        "+33612345678",
        "+33987654321",
        "+33612349876",
      ];

      for (const phone of validPhones) {
        const testDto = new LoginDto();
        testDto.phoneNumber = phone;
        testDto.password = "ValidPass123!";

        const errors = await validate(testDto);
        expect(errors).toHaveLength(0);
      }
    });

    it("should pass validation with various strong passwords", async () => {
      const strongPasswords = [
        "Password1@",
        "MyStrongP@ss1",
        "Complex123!",
        "Hello@2012",
        "SecureP@ssw0rd",
        "Abcdefg1*",
      ];

      for (const password of strongPasswords) {
        const testDto = new LoginDto();
        testDto.phoneNumber = "+33123456789";
        testDto.password = password;

        const errors = await validate(testDto);
        expect(errors).toHaveLength(0);
      }
    });
  });

  describe("Invalid phone number", () => {
    beforeEach(() => {
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
      ];

      for (const phone of invalidPhones) {
        const testDto = new LoginDto();
        testDto.phoneNumber = phone;
        testDto.password = "ValidPass123!";

        const errors = await validate(testDto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe("phoneNumber");
      }
    });

    it("should fail validation for phone number too long", async () => {
      dto.phoneNumber = "+33" + "1".repeat(50);

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe("phoneNumber");
      expect(errors[0].constraints).toHaveProperty("isLength");
    });
  });

  describe("Invalid password", () => {
    beforeEach(() => {
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
      ];

      for (const password of weakPasswords) {
        const testDto = new LoginDto();
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
      dto.password = "A1@" + "a".repeat(50);

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe("password");
      expect(errors[0].constraints).toHaveProperty("isLength");
    });

    it("should fail validation for password without lowercase", async () => {
      dto.password = "STRONGPASS123!";

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe("password");
      expect(errors[0].constraints).toHaveProperty("isStrongPassword");
    });

    it("should fail validation for password without uppercase", async () => {
      dto.password = "strongpass123!";

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe("password");
      expect(errors[0].constraints).toHaveProperty("isStrongPassword");
    });

    it("should fail validation for password without numbers", async () => {
      dto.password = "StrongPass!";

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe("password");
      expect(errors[0].constraints).toHaveProperty("isStrongPassword");
    });

    it("should fail validation for password without symbols", async () => {
      dto.password = "StrongPass123";

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe("password");
      expect(errors[0].constraints).toHaveProperty("isStrongPassword");
    });
  });

  describe("Multiple validation errors", () => {
    it("should return multiple errors when both fields are invalid", async () => {
      dto.phoneNumber = "invalid";
      dto.password = "weak";

      const errors = await validate(dto);

      expect(errors).toHaveLength(2);

      const phoneError = errors.find(
        (error) => error.property === "phoneNumber",
      );
      const passwordError = errors.find(
        (error) => error.property === "password",
      );

      expect(phoneError).toBeDefined();
      expect(passwordError).toBeDefined();
    });

    it("should handle non-string values", async () => {
      Object.assign(dto, { phoneNumber: 123456789, password: 12345678 });

      const errors = await validate(dto);

      expect(errors).toHaveLength(2);
      expect(errors.map((e) => e.property)).toContain("phoneNumber");
      expect(errors.map((e) => e.property)).toContain("password");
    });
  });

  describe("Edge cases", () => {
    it("should handle minimum valid lengths", async () => {
      dto.phoneNumber = "+33123456789";
      dto.password = "A1@bcdef";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should handle maximum valid lengths", async () => {
      dto.phoneNumber = "+33123456789";
      dto.password = "A1@" + "b".repeat(46);

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should validate password with various symbols", async () => {
      const symbolPasswords = [
        "Password1!",
        "Password1@",
        "Password1#",
        "Password1$",
        "Password1%",
        "Password1^",
        "Password1&",
        "Password1*",
        "Password1(",
        "Password1)",
        "Password1-",
        "Password1_",
        "Password1+",
        "Password1=",
        "Password1|",
        "Password1\\",
        "Password1[",
        "Password1]",
        "Password1{",
        "Password1}",
        "Password1;",
        "Password1:",
        "Password1'",
        'Password1"',
        "Password1,",
        "Password1.",
        "Password1<",
        "Password1>",
        "Password1?",
        "Password1/",
      ];

      for (const password of symbolPasswords) {
        const testDto = new LoginDto();
        testDto.phoneNumber = "+33123456789";
        testDto.password = password;

        const errors = await validate(testDto);
        expect(errors).toHaveLength(0);
      }
    });
  });
});
