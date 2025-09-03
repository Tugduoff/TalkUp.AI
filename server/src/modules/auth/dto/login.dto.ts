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
      "The user's password. It will be hashed before added to the database.",
    minLength: 8,
    example: "Hello@2012",
  })
  password: string;
}
