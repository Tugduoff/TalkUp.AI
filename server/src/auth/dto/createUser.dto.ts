import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { Length, IsPhoneNumber, IsStrongPassword } from "class-validator";

@ApiSchema({
  name: "CreateUserRequest",
  description: "Request to populate of the CreateUserDto schema",
})
export class CreateUserDto {
  @Length(1, 50)
  @ApiProperty({
    description: "The user's name",
    maxLength: 50,
    minLength: 1,
    example: "AdminSys819",
  })
  username: string;

  @Length(1, 50)
  @IsPhoneNumber("FR") // temporary, to be removed when internationalization is implemented
  @ApiProperty({
    description:
      "The user's phone number. It will be used later for verification.",
    example: "+33123456789",
  })
  phonenumber: string;

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
    example: "Abcdefg1*",
  })
  password: string;
}
