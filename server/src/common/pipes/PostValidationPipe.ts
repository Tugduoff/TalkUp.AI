import {
  BadRequestException,
  HttpStatus,
  Injectable,
  ValidationPipe,
  UnprocessableEntityException,
} from "@nestjs/common";

import { ValidationError } from "class-validator";

@Injectable()
export class PostValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]) => {
        // Missing parameters in the errors array are identifiable by an undefined value
        const missingParams = errors.filter(
          (error) => error.constraints && error.value === undefined,
        );

        // If there are missing parameters, return 422 instead of 400
        if (missingParams.length > 0) {
          return new UnprocessableEntityException({
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            message: "Missing required parameters",
            errors: missingParams.map((error) => ({
              field: error.property,
            })),
          });
        }

        // If badly formatted, return 400
        return new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Badly formatted parameters",
          errors: errors.map((error) => ({
            field: error.property,
            constraints: error.constraints,
          })),
        });
      },
    });
  }
}
