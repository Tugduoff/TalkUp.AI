import { Length, IsPhoneNumber, IsStrongPassword } from "class-validator";

export class CreateUserDto {
  @Length(1, 50)
  username: string;

  @Length(1, 50)
  @IsPhoneNumber("FR") // temporary, to be removed when internationalization is implemented
  phonenumber: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @Length(8, 50)
  password: string;
}
