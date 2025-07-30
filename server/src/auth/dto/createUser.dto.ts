import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { Length, IsPhoneNumber, IsStrongPassword } from "class-validator";

@ApiSchema({
  name: "CreateUserRequest",
  description: "Request to populate of the CreateUserDto schema",
})
export class CreateUserDto {
  @Length(1, 50)
  @ApiProperty({
    description: "The user's display name",
    maxLength: 50,
    minLength: 1,
    example: "John Doe",
  })
  username: string;

  @Length(1, 50)
  @IsPhoneNumber("FR") // temporary, to be removed when internationalization is implemented
  @ApiProperty({
    description:
      "The user's phone number in international format (currently French numbers only)",
    example: "+33769293743",
  })
  phoneNumber: string;

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
      "Strong password: minimum 8 characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    minLength: 8,
    maxLength: 50,
    example: "SecurePass123@",
  })
  password: string;
}
