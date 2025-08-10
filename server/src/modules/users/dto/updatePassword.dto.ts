import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsStrongPassword, Length } from "class-validator";

export class UpdatePasswordDto {
  @IsPhoneNumber(undefined)
  @ApiProperty({
    description: "The user's phone number.",
    example: "+33640404040",
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
    description: "The user's new password.",
    minLength: 8,
    example: "Hello@2012",
  })
  newPassword: string;
}
