import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { Length, IsEmail, IsStrongPassword } from "class-validator";

@ApiSchema({
  name: "User login",
  description: "Request for the user login",
})
export class LoginDto {
  @IsEmail()
  @ApiProperty({
    description: "The user's email address for login.",
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
    description:
      "The user's password. It must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols.",
    minLength: 8,
    example: "Abcdefg1*",
  })
  password: string;
}
