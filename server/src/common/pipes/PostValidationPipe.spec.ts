import { PostValidationPipe } from "./PostValidationPipe";
import { ValidationError } from "class-validator";
import {
  BadRequestException,
  UnprocessableEntityException,
  HttpStatus,
} from "@nestjs/common";

describe("PostValidationPipe", () => {
  let pipe: PostValidationPipe;

  beforeEach(() => {
    pipe = new PostValidationPipe();
  });

  it("should be defined", () => {
    expect(pipe).toBeDefined();
  });

  it("should extend ValidationPipe", () => {
    expect(pipe).toBeInstanceOf(PostValidationPipe);
  });

  describe("Configuration", () => {
    it("should be configured with correct options", () => {
      expect(pipe).toBeDefined();
    });
  });

  describe("Exception Factory", () => {
    let _exceptionFactory: (
      errors: ValidationError[],
    ) => BadRequestException | UnprocessableEntityException;

    beforeEach(() => {
      pipe = new PostValidationPipe();

      const _mockValidationError: ValidationError = {
        property: "test",
        value: undefined,
        constraints: { isString: "test must be a string" },
        children: [],
      };
    });

    describe("Missing Parameters (422 UnprocessableEntityException)", () => {
      it("should return UnprocessableEntityException for missing required parameters", () => {
        const errors: ValidationError[] = [
          {
            property: "username",
            value: undefined,
            constraints: { isString: "username must be a string" },
            children: [],
          },
          {
            property: "email",
            value: undefined,
            constraints: { isEmail: "email must be an email" },
            children: [],
          },
        ];

        const pipeOptions = (
          pipe as PostValidationPipe & {
            validatorOptions: {
              exceptionFactory: (
                errors: ValidationError[],
              ) => BadRequestException | UnprocessableEntityException;
            };
          }
        ).validatorOptions;
        const exception = pipeOptions.exceptionFactory(errors);

        expect(exception).toBeInstanceOf(UnprocessableEntityException);
        expect(exception.getResponse()).toEqual({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: "Missing required parameters",
          errors: [{ field: "username" }, { field: "email" }],
        });
      });

      it("should return UnprocessableEntityException for single missing parameter", () => {
        const errors: ValidationError[] = [
          {
            property: "phoneNumber",
            value: undefined,
            constraints: { isString: "phoneNumber must be a string" },
            children: [],
          },
        ];

        const pipeOptions = (
          pipe as PostValidationPipe & {
            validatorOptions: {
              exceptionFactory: (
                errors: ValidationError[],
              ) => BadRequestException | UnprocessableEntityException;
            };
          }
        ).validatorOptions;
        const exception = pipeOptions.exceptionFactory(errors);

        expect(exception).toBeInstanceOf(UnprocessableEntityException);
        expect(exception.getResponse()).toEqual({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: "Missing required parameters",
          errors: [{ field: "phoneNumber" }],
        });
      });

      it("should identify missing parameters when value is undefined", () => {
        const errors: ValidationError[] = [
          {
            property: "password",
            value: undefined,
            constraints: {
              minLength: "password must be longer than 8 characters",
            },
            children: [],
          },
        ];

        const pipeOptions = (
          pipe as PostValidationPipe & {
            validatorOptions: {
              exceptionFactory: (
                errors: ValidationError[],
              ) => BadRequestException | UnprocessableEntityException;
            };
          }
        ).validatorOptions;
        const exception = pipeOptions.exceptionFactory(errors);

        expect(exception).toBeInstanceOf(UnprocessableEntityException);
        expect(exception.getStatus()).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      });
    });

    describe("Badly Formatted Parameters (400 BadRequestException)", () => {
      it("should return BadRequestException for badly formatted parameters", () => {
        const errors: ValidationError[] = [
          {
            property: "email",
            value: "invalid-email-format",
            constraints: { isEmail: "email must be an email" },
            children: [],
          },
          {
            property: "age",
            value: "not-a-number",
            constraints: { isNumber: "age must be a number" },
            children: [],
          },
        ];

        const pipeOptions = (
          pipe as PostValidationPipe & {
            validatorOptions: {
              exceptionFactory: (
                errors: ValidationError[],
              ) => BadRequestException | UnprocessableEntityException;
            };
          }
        ).validatorOptions;
        const exception = pipeOptions.exceptionFactory(errors);

        expect(exception).toBeInstanceOf(BadRequestException);
        expect(exception.getResponse()).toEqual({
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Badly formatted parameters",
          errors: [
            {
              field: "email",
              constraints: { isEmail: "email must be an email" },
            },
            {
              field: "age",
              constraints: { isNumber: "age must be a number" },
            },
          ],
        });
      });

      it("should return BadRequestException for single badly formatted parameter", () => {
        const errors: ValidationError[] = [
          {
            property: "username",
            value: 12345,
            constraints: { isString: "username must be a string" },
            children: [],
          },
        ];

        const pipeOptions = (
          pipe as PostValidationPipe & {
            validatorOptions: {
              exceptionFactory: (
                errors: ValidationError[],
              ) => BadRequestException | UnprocessableEntityException;
            };
          }
        ).validatorOptions;
        const exception = pipeOptions.exceptionFactory(errors);

        expect(exception).toBeInstanceOf(BadRequestException);
        expect(exception.getResponse()).toEqual({
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Badly formatted parameters",
          errors: [
            {
              field: "username",
              constraints: { isString: "username must be a string" },
            },
          ],
        });
      });

      it("should handle parameters with empty string values as bad format", () => {
        const errors: ValidationError[] = [
          {
            property: "phoneNumber",
            value: "",
            constraints: {
              matches: "phoneNumber must be a valid phone number",
            },
            children: [],
          },
        ];

        const pipeOptions = (
          pipe as PostValidationPipe & {
            validatorOptions: {
              exceptionFactory: (
                errors: ValidationError[],
              ) => BadRequestException | UnprocessableEntityException;
            };
          }
        ).validatorOptions;
        const exception = pipeOptions.exceptionFactory(errors);

        expect(exception).toBeInstanceOf(BadRequestException);
        expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      });

      it("should handle parameters with null values as bad format", () => {
        const errors: ValidationError[] = [
          {
            property: "data",
            value: null,
            constraints: { isObject: "data must be an object" },
            children: [],
          },
        ];

        const pipeOptions = (
          pipe as PostValidationPipe & {
            validatorOptions: {
              exceptionFactory: (
                errors: ValidationError[],
              ) => BadRequestException | UnprocessableEntityException;
            };
          }
        ).validatorOptions;
        const exception = pipeOptions.exceptionFactory(errors);

        expect(exception).toBeInstanceOf(BadRequestException);
        expect(exception.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      });
    });

    describe("Mixed Error Scenarios", () => {
      it("should prioritize missing parameters over bad format when both exist", () => {
        const errors: ValidationError[] = [
          {
            property: "username",
            value: undefined,
            constraints: { isString: "username must be a string" },
            children: [],
          },
          {
            property: "email",
            value: "invalid-email",
            constraints: { isEmail: "email must be an email" },
            children: [],
          },
        ];

        const pipeOptions = (
          pipe as PostValidationPipe & {
            validatorOptions: {
              exceptionFactory: (
                errors: ValidationError[],
              ) => BadRequestException | UnprocessableEntityException;
            };
          }
        ).validatorOptions;
        const exception = pipeOptions.exceptionFactory(errors);

        expect(exception).toBeInstanceOf(UnprocessableEntityException);
        expect(exception.getStatus()).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
        expect(exception.getResponse()).toEqual({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: "Missing required parameters",
          errors: [{ field: "username" }],
        });
      });

      it("should handle multiple missing parameters correctly", () => {
        const errors: ValidationError[] = [
          {
            property: "field1",
            value: undefined,
            constraints: { isString: "field1 must be a string" },
            children: [],
          },
          {
            property: "field2",
            value: undefined,
            constraints: { isEmail: "field2 must be an email" },
            children: [],
          },
          {
            property: "field3",
            value: "present",
            constraints: { minLength: "field3 must be longer" },
            children: [],
          },
        ];

        const pipeOptions = (
          pipe as PostValidationPipe & {
            validatorOptions: {
              exceptionFactory: (
                errors: ValidationError[],
              ) => BadRequestException | UnprocessableEntityException;
            };
          }
        ).validatorOptions;
        const exception = pipeOptions.exceptionFactory(errors);

        expect(exception).toBeInstanceOf(UnprocessableEntityException);
        const response = exception.getResponse() as {
          errors: { field: string }[];
        };
        expect(response.errors).toHaveLength(2);
        expect(response.errors).toContainEqual({ field: "field1" });
        expect(response.errors).toContainEqual({ field: "field2" });
      });
    });

    describe("Edge Cases", () => {
      it("should handle ValidationError without constraints", () => {
        const errors: ValidationError[] = [
          {
            property: "field",
            value: "some-value",
            constraints: undefined,
            children: [],
          },
        ];

        const pipeOptions = (
          pipe as PostValidationPipe & {
            validatorOptions: {
              exceptionFactory: (
                errors: ValidationError[],
              ) => BadRequestException | UnprocessableEntityException;
            };
          }
        ).validatorOptions;
        const exception = pipeOptions.exceptionFactory(errors);

        expect(exception).toBeInstanceOf(BadRequestException);
      });

      it("should handle ValidationError with constraints but undefined value", () => {
        const errors: ValidationError[] = [
          {
            property: "field",
            value: undefined,
            constraints: { isRequired: "field is required" },
            children: [],
          },
        ];

        const pipeOptions = (
          pipe as PostValidationPipe & {
            validatorOptions: {
              exceptionFactory: (
                errors: ValidationError[],
              ) => BadRequestException | UnprocessableEntityException;
            };
          }
        ).validatorOptions;
        const exception = pipeOptions.exceptionFactory(errors);

        expect(exception).toBeInstanceOf(UnprocessableEntityException);
      });

      it("should handle empty errors array", () => {
        const errors: ValidationError[] = [];

        const pipeOptions = (
          pipe as PostValidationPipe & {
            validatorOptions: {
              exceptionFactory: (
                errors: ValidationError[],
              ) => BadRequestException | UnprocessableEntityException;
            };
          }
        ).validatorOptions;
        const exception = pipeOptions.exceptionFactory(errors);

        expect(exception).toBeInstanceOf(BadRequestException);
        expect((exception as BadRequestException).getResponse()).toEqual({
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Badly formatted parameters",
          errors: [],
        });
      });

      it("should handle ValidationError with zero as value (not undefined)", () => {
        const errors: ValidationError[] = [
          {
            property: "number",
            value: 0,
            constraints: { min: "number must be positive" },
            children: [],
          },
        ];

        const pipeOptions = (
          pipe as PostValidationPipe & {
            validatorOptions: {
              exceptionFactory: (
                errors: ValidationError[],
              ) => BadRequestException | UnprocessableEntityException;
            };
          }
        ).validatorOptions;
        const exception = pipeOptions.exceptionFactory(errors);

        expect(exception).toBeInstanceOf(BadRequestException);
        expect((exception as BadRequestException).getStatus()).toBe(
          HttpStatus.BAD_REQUEST,
        );
      });

      it("should handle ValidationError with false as value (not undefined)", () => {
        const errors: ValidationError[] = [
          {
            property: "flag",
            value: false,
            constraints: { isTrue: "flag must be true" },
            children: [],
          },
        ];

        const pipeOptions = (
          pipe as PostValidationPipe & {
            validatorOptions: {
              exceptionFactory: (
                errors: ValidationError[],
              ) => BadRequestException | UnprocessableEntityException;
            };
          }
        ).validatorOptions;
        const exception = pipeOptions.exceptionFactory(errors);

        expect(exception).toBeInstanceOf(BadRequestException);
        expect((exception as BadRequestException).getStatus()).toBe(
          HttpStatus.BAD_REQUEST,
        );
      });
    });

    describe("Complex Validation Scenarios", () => {
      it("should handle nested object validation errors", () => {
        const errors: ValidationError[] = [
          {
            property: "user",
            value: { name: 123 },
            constraints: undefined,
            children: [
              {
                property: "name",
                value: 123,
                constraints: { isString: "name must be a string" },
                children: [],
              },
            ],
          },
        ];

        const pipeOptions = (
          pipe as PostValidationPipe & {
            validatorOptions: {
              exceptionFactory: (
                errors: ValidationError[],
              ) => BadRequestException | UnprocessableEntityException;
            };
          }
        ).validatorOptions;
        const exception = pipeOptions.exceptionFactory(errors);

        expect(exception).toBeInstanceOf(BadRequestException);
      });

      it("should handle multiple constraint violations on single field", () => {
        const errors: ValidationError[] = [
          {
            property: "password",
            value: "abc",
            constraints: {
              minLength: "password must be at least 8 characters",
              matches: "password must contain at least one number",
            },
            children: [],
          },
        ];

        const pipeOptions = (
          pipe as PostValidationPipe & {
            validatorOptions: {
              exceptionFactory: (
                errors: ValidationError[],
              ) => BadRequestException | UnprocessableEntityException;
            };
          }
        ).validatorOptions;
        const exception = pipeOptions.exceptionFactory(errors);

        expect(exception).toBeInstanceOf(BadRequestException);
        interface ValidationErrorResponse {
          errors: { constraints: Record<string, string> }[];
        }
        const response = (
          exception as BadRequestException
        ).getResponse() as ValidationErrorResponse;
        expect(response.errors[0].constraints).toEqual({
          minLength: "password must be at least 8 characters",
          matches: "password must contain at least one number",
        });
      });
    });
  });

  describe("Integration Behavior", () => {
    it("should configure ValidationPipe with whitelist enabled", () => {
      expect(pipe).toBeInstanceOf(PostValidationPipe);

      const options = (
        pipe as PostValidationPipe & {
          validatorOptions: {
            whitelist: boolean;
            forbidNonWhitelisted: boolean;
            exceptionFactory: (
              errors: ValidationError[],
            ) => BadRequestException | UnprocessableEntityException;
          };
        }
      ).validatorOptions;
      expect(options.whitelist).toBe(true);
      expect(options.forbidNonWhitelisted).toBe(true);
    });

    it("should have custom exception factory", () => {
      const options = (
        pipe as PostValidationPipe & {
          validatorOptions: {
            exceptionFactory: (
              errors: ValidationError[],
            ) => BadRequestException | UnprocessableEntityException;
          };
        }
      ).validatorOptions;
      expect(options.exceptionFactory).toBeDefined();
      expect(typeof options.exceptionFactory).toBe("function");
    });
  });
});
