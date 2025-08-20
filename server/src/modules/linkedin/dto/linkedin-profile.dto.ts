import { IsString, IsEmail, IsBoolean, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class LinkedInProfileDto {
  @ApiProperty({
    description: "LinkedIn user's full name",
    example: "John Doe",
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "LinkedIn user's email address",
    example: "john.doe@example.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Whether the email is verified",
    example: true,
  })
  @IsBoolean()
  email_verified: boolean;

  @ApiPropertyOptional({
    description: "LinkedIn user's profile picture URL",
    example: "https://media.licdn.com/dms/image/...",
  })
  @IsOptional()
  @IsString()
  picture?: string;

  @ApiPropertyOptional({
    description: "LinkedIn user's unique identifier",
    example: "12345678",
  })
  @IsOptional()
  @IsString()
  sub?: string;
}
