import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsStrongPassword, Length } from "class-validator";

export class UpdatePasswordDto {
  @IsEmail()
  @ApiProperty({
    description:
      "The user's email address. It will be used for login and verification.",
    example: "john.doe@example.com",
  })
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @Length(8, 50)
  @ApiProperty({
    description: "The user's new password.",
    minLength: 8,
    example: "Hello@2012",
  })
  newPassword: string;
}
