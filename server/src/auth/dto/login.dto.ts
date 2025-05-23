import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { Length, IsPhoneNumber, IsStrongPassword } from "class-validator";

@ApiSchema({
  name: "User login",
  description: "Request for the user login",
})
export class LoginDto {
  @Length(1, 50)
  @IsPhoneNumber("FR") // temporary, to be removed when internationalization is implemented
  @ApiProperty({
    description:
      "The user's phone number. It will be used later for verification.",
    example: "+33123456789",
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
      "The user's password. It will be hashed before added to the database.",
    minLength: 8,
    example: "Hello@2012",
  })
  password: string;
}
