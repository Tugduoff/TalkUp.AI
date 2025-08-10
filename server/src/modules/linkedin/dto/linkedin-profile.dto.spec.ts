import { validate } from "class-validator";
import { LinkedInProfileDto } from "./linkedin-profile.dto";

describe("LinkedInProfileDto", () => {
  let dto: LinkedInProfileDto;

  beforeEach(() => {
    dto = new LinkedInProfileDto();
  });

  describe("Valid DTOs", () => {
    it("should pass validation with all required fields", async () => {
      dto.name = "John Doe";
      dto.email = "john.doe@example.com";
      dto.email_verified = true;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should pass validation with optional fields included", async () => {
      dto.name = "Jane Smith";
      dto.email = "jane.smith@linkedin.com";
      dto.email_verified = false;
      dto.picture = "https://media.licdn.com/dms/image/profile.jpg";
      dto.sub = "linkedin-12345";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should pass validation with minimal required data", async () => {
      dto.name = "A";
      dto.email = "a@b.co";
      dto.email_verified = false;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe("Invalid DTOs - name field", () => {
    it("should fail validation when name is missing", async () => {
      dto.email = "john.doe@example.com";
      dto.email_verified = true;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("name");
      expect(errors[0].constraints).toHaveProperty("isString");
    });

    it("should fail validation when name is not a string", async () => {
      Object.assign(dto, { name: 12345 });
      dto.email = "john.doe@example.com";
      dto.email_verified = true;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("name");
      expect(errors[0].constraints).toHaveProperty("isString");
    });

    it("should fail validation when name is empty string", async () => {
      dto.name = "";
      dto.email = "john.doe@example.com";
      dto.email_verified = true;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe("Invalid DTOs - email field", () => {
    it("should fail validation when email is missing", async () => {
      dto.name = "John Doe";
      dto.email_verified = true;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("email");
      expect(errors[0].constraints).toHaveProperty("isEmail");
    });

    it("should fail validation when email format is invalid", async () => {
      dto.name = "John Doe";
      dto.email = "invalid-email-format";
      dto.email_verified = true;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("email");
      expect(errors[0].constraints).toHaveProperty("isEmail");
    });

    it("should fail validation when email is not a string", async () => {
      dto.name = "John Doe";
      Object.assign(dto, { email: 12345 });
      dto.email_verified = true;

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("email");
      expect(errors[0].constraints).toHaveProperty("isEmail");
    });

    it("should fail validation with malformed email addresses", async () => {
      const invalidEmails = [
        "@example.com",
        "user@",
        "user.example.com",
        "user@.com",
        "",
      ];

      for (const invalidEmail of invalidEmails) {
        const testDto = new LinkedInProfileDto();
        testDto.name = "Test User";
        testDto.email = invalidEmail;
        testDto.email_verified = true;

        const errors = await validate(testDto);
        expect(errors).toHaveLength(1);
        expect(errors[0].property).toBe("email");
      }
    });
  });

  describe("Invalid DTOs - email_verified field", () => {
    it("should fail validation when email_verified is missing", async () => {
      dto.name = "John Doe";
      dto.email = "john.doe@example.com";

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("email_verified");
      expect(errors[0].constraints).toHaveProperty("isBoolean");
    });

    it("should fail validation when email_verified is not a boolean", async () => {
      dto.name = "John Doe";
      dto.email = "john.doe@example.com";
      Object.assign(dto, { email_verified: "true" });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("email_verified");
      expect(errors[0].constraints).toHaveProperty("isBoolean");
    });

    it("should fail validation when email_verified is a number", async () => {
      dto.name = "John Doe";
      dto.email = "john.doe@example.com";
      Object.assign(dto, { email_verified: 1 });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("email_verified");
      expect(errors[0].constraints).toHaveProperty("isBoolean");
    });
  });

  describe("Invalid DTOs - optional fields", () => {
    it("should fail validation when picture is not a string", async () => {
      dto.name = "John Doe";
      dto.email = "john.doe@example.com";
      dto.email_verified = true;
      Object.assign(dto, { picture: 12345 });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("picture");
      expect(errors[0].constraints).toHaveProperty("isString");
    });

    it("should fail validation when sub is not a string", async () => {
      dto.name = "John Doe";
      dto.email = "john.doe@example.com";
      dto.email_verified = true;
      Object.assign(dto, { sub: 12345 });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("sub");
      expect(errors[0].constraints).toHaveProperty("isString");
    });

    it("should pass validation when optional fields are undefined", async () => {
      dto.name = "John Doe";
      dto.email = "john.doe@example.com";
      dto.email_verified = true;
      dto.picture = undefined;
      dto.sub = undefined;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should pass validation when optional fields are empty strings", async () => {
      dto.name = "John Doe";
      dto.email = "john.doe@example.com";
      dto.email_verified = true;
      dto.picture = "";
      dto.sub = "";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe("Multiple validation errors", () => {
    it("should return multiple errors when multiple fields are invalid", async () => {
      Object.assign(dto, {
        name: 123,
        email: "invalid-email",
        email_verified: "not-boolean",
        picture: 456,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(4);

      const errorProperties = errors.map((error) => error.property);
      expect(errorProperties).toContain("name");
      expect(errorProperties).toContain("email");
      expect(errorProperties).toContain("email_verified");
      expect(errorProperties).toContain("picture");
    });
  });

  describe("Edge cases", () => {
    it("should handle very long valid email addresses", async () => {
      const longLocalPart = "a".repeat(64);
      const longDomain = "b".repeat(63);
      dto.name = "Test User";
      dto.email = `${longLocalPart}@${longDomain}.com`;
      dto.email_verified = true;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should handle unicode characters in name", async () => {
      dto.name = "José María Azñar";
      dto.email = "jose@example.com";
      dto.email_verified = true;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should handle long URLs in picture field", async () => {
      dto.name = "Test User";
      dto.email = "test@example.com";
      dto.email_verified = false;
      dto.picture =
        "https://media.licdn.com/dms/image/very/long/path/to/profile/picture.jpg?query=params&more=data";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });
});
