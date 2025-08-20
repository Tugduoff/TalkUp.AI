import { IsString, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class LinkedInTokenDto {
  @ApiProperty({
    description: "LinkedIn OAuth access token",
    example: "AQXd...",
  })
  @IsString()
  access_token: string;

  @ApiProperty({
    description: "Token expiration time in seconds",
    example: "5184000",
  })
  @IsString()
  expires_in: string;

  @ApiProperty({
    description: "OAuth scope granted",
    example: "r_liteprofile r_emailaddress",
  })
  @IsString()
  scope: string;

  @ApiPropertyOptional({
    description: "OAuth refresh token",
    example: "AQXd...",
  })
  @IsOptional()
  @IsString()
  refresh_token?: string;

  @ApiPropertyOptional({
    description: "Refresh token expiration time",
    example: "31536000",
  })
  @IsOptional()
  @IsString()
  refresh_token_expires_in?: string;
}
