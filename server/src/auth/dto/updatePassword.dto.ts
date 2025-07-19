import { PickType } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { CreateUserDto } from "./createUser.dto";

export class UpdatePasswordDto extends PickType(CreateUserDto, [
  "phoneNumber",
] as const) {
  @IsString()
  @ApiProperty({
    description: "The user's new password.",
    minLength: 8,
    example: "NewPassword",
  })
  newPassword: string;
}
