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
        // les paramètres manquants dans le tableau errors sont identifiable via une value undefined.
        const missingParams = errors.filter(
          (error) => error.constraints && error.value === undefined,
        );

        // si ya des missing params, on renvoie 422 au lieu de 400
        if (missingParams.length > 0) {
          return new UnprocessableEntityException({
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            message: "Missing required parameters",
            errors: missingParams.map((error) => ({
              field: error.property,
            })),
          });
        }

        // si badly formatted, renvoie 400
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
