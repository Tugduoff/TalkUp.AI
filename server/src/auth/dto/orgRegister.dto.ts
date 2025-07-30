import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { CreateUserDto } from "./createUser.dto";

export class OrgRegisterDto extends CreateUserDto {
  @ApiProperty({
    description:
      "The organization ID (UUID) that the user will be associated with",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsString()
  @IsNotEmpty()
  orgId: string;

  @ApiPropertyOptional({
    description: "The user's role within the organization",
    example: "user",
    enum: ["admin", "user", "manager"],
    default: "user",
  })
  @IsString()
  @IsOptional()
  role?: string = "user";
}
