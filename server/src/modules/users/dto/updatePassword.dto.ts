import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsPhoneNumber } from "class-validator";

export class UpdatePasswordDto {
  @IsPhoneNumber(undefined)
  @ApiProperty({
    description: "The user's phone number.",
    example: "+33640404040",
  })
  phoneNumber: string;

  @IsString()
  @ApiProperty({
    description: "The user's new password.",
    minLength: 8,
    example: "NewPassword",
  })
  newPassword: string;
}
