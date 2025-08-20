import { validate } from "class-validator";
import { LinkedInTokenDto } from "./linkedin-token.dto";

describe("LinkedInTokenDto", () => {
  let dto: LinkedInTokenDto;

  beforeEach(() => {
    dto = new LinkedInTokenDto();
  });

  describe("Valid DTOs", () => {
    it("should pass validation with all required fields", async () => {
      dto.access_token = "AQXdF1234567890abcdef";
      dto.expires_in = "5184000";
      dto.scope = "r_liteprofile r_emailaddress";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should pass validation with all fields including optional ones", async () => {
      dto.access_token = "AQXdF1234567890abcdef";
      dto.expires_in = "5184000";
      dto.scope = "r_liteprofile r_emailaddress";
      dto.refresh_token = "AQXdRefresh1234567890";
      dto.refresh_token_expires_in = "31536000";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should pass validation with different token values", async () => {
      dto.access_token = "Bearer_Token_12345";
      dto.expires_in = "3600";
      dto.scope = "profile email";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe("Invalid DTOs - access_token field", () => {
    it("should fail validation when access_token is missing", async () => {
      dto.expires_in = "5184000";
      dto.scope = "r_liteprofile";

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("access_token");
      expect(errors[0].constraints).toHaveProperty("isString");
    });

    it("should fail validation when access_token is not a string", async () => {
      Object.assign(dto, { access_token: 12345 });
      dto.expires_in = "5184000";
      dto.scope = "r_liteprofile";

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("access_token");
      expect(errors[0].constraints).toHaveProperty("isString");
    });

    it("should pass validation when access_token is empty string", async () => {
      dto.access_token = "";
      dto.expires_in = "5184000";
      dto.scope = "r_liteprofile";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe("Invalid DTOs - expires_in field", () => {
    it("should fail validation when expires_in is missing", async () => {
      dto.access_token = "AQXdF1234567890abcdef";
      dto.scope = "r_liteprofile";

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("expires_in");
      expect(errors[0].constraints).toHaveProperty("isString");
    });

    it("should fail validation when expires_in is not a string", async () => {
      dto.access_token = "AQXdF1234567890abcdef";
      Object.assign(dto, { expires_in: 5184000 });
      dto.scope = "r_liteprofile";

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("expires_in");
      expect(errors[0].constraints).toHaveProperty("isString");
    });

    it("should pass validation when expires_in is string representation of number", async () => {
      dto.access_token = "AQXdF1234567890abcdef";
      dto.expires_in = "0";
      dto.scope = "r_liteprofile";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe("Invalid DTOs - scope field", () => {
    it("should fail validation when scope is missing", async () => {
      dto.access_token = "AQXdF1234567890abcdef";
      dto.expires_in = "5184000";

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("scope");
      expect(errors[0].constraints).toHaveProperty("isString");
    });

    it("should fail validation when scope is not a string", async () => {
      dto.access_token = "AQXdF1234567890abcdef";
      dto.expires_in = "5184000";
      Object.assign(dto, { scope: ["r_liteprofile", "r_emailaddress"] });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("scope");
      expect(errors[0].constraints).toHaveProperty("isString");
    });

    it("should pass validation when scope is empty string", async () => {
      dto.access_token = "AQXdF1234567890abcdef";
      dto.expires_in = "5184000";
      dto.scope = "";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe("Invalid DTOs - optional fields", () => {
    it("should fail validation when refresh_token is not a string", async () => {
      dto.access_token = "AQXdF1234567890abcdef";
      dto.expires_in = "5184000";
      dto.scope = "r_liteprofile";
      Object.assign(dto, { refresh_token: 12345 });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("refresh_token");
      expect(errors[0].constraints).toHaveProperty("isString");
    });

    it("should fail validation when refresh_token_expires_in is not a string", async () => {
      dto.access_token = "AQXdF1234567890abcdef";
      dto.expires_in = "5184000";
      dto.scope = "r_liteprofile";
      Object.assign(dto, { refresh_token_expires_in: 31536000 });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe("refresh_token_expires_in");
      expect(errors[0].constraints).toHaveProperty("isString");
    });

    it("should pass validation when optional fields are undefined", async () => {
      dto.access_token = "AQXdF1234567890abcdef";
      dto.expires_in = "5184000";
      dto.scope = "r_liteprofile";
      dto.refresh_token = undefined;
      dto.refresh_token_expires_in = undefined;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should pass validation when optional fields are empty strings", async () => {
      dto.access_token = "AQXdF1234567890abcdef";
      dto.expires_in = "5184000";
      dto.scope = "r_liteprofile";
      dto.refresh_token = "";
      dto.refresh_token_expires_in = "";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe("Multiple validation errors", () => {
    it("should return multiple errors when multiple required fields are invalid", async () => {
      Object.assign(dto, {
        access_token: 123,
        expires_in: 5184000,
        scope: ["scope1", "scope2"],
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(3);

      const errorProperties = errors.map((error) => error.property);
      expect(errorProperties).toContain("access_token");
      expect(errorProperties).toContain("expires_in");
      expect(errorProperties).toContain("scope");
    });

    it("should return errors for both required and optional fields when invalid", async () => {
      Object.assign(dto, {
        access_token: 123,
        expires_in: "5184000",
        scope: "r_liteprofile",
        refresh_token: 456,
        refresh_token_expires_in: 789,
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(3);

      const errorProperties = errors.map((error) => error.property);
      expect(errorProperties).toContain("access_token");
      expect(errorProperties).toContain("refresh_token");
      expect(errorProperties).toContain("refresh_token_expires_in");
    });
  });

  describe("Edge cases", () => {
    it("should handle very long token strings", async () => {
      const longToken = "A".repeat(1000);
      dto.access_token = longToken;
      dto.expires_in = "5184000";
      dto.scope = "r_liteprofile r_emailaddress";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should handle tokens with special characters", async () => {
      dto.access_token = "AQXd-F123456_7890abcdef.token";
      dto.expires_in = "5184000";
      dto.scope = "r_liteprofile r_emailaddress";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should handle zero expiration time", async () => {
      dto.access_token = "AQXdF1234567890abcdef";
      dto.expires_in = "0";
      dto.scope = "r_liteprofile";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should handle complex scope strings", async () => {
      dto.access_token = "AQXdF1234567890abcdef";
      dto.expires_in = "5184000";
      dto.scope =
        "r_liteprofile r_emailaddress w_member_social rw_organization_admin";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it("should handle single character values", async () => {
      dto.access_token = "A";
      dto.expires_in = "1";
      dto.scope = "r";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });

  describe("Real LinkedIn token formats", () => {
    it("should validate realistic LinkedIn access token format", async () => {
      dto.access_token = "AQXdYXNzA7WEFlIGEhraVdVSLXwtNHVfwwWY8Ni4YjIZjrfCYb";
      dto.expires_in = "5184000";
      dto.scope = "r_liteprofile r_emailaddress";
      dto.refresh_token =
        "AQWb3VWY8Ni4YjIZjrfCYbxdYXNzA7WEFlIGEhraVdVSLXwtNHVfw";
      dto.refresh_token_expires_in = "31536000";

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });
  });
});
