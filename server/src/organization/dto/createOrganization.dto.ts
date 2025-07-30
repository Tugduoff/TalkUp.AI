import { IsString, IsNotEmpty, IsOptional, IsObject } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateOrganizationDto {
  @ApiProperty({
    description: "Organization name",
    example: "Acme Corporation",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Organization domain",
    example: "acme.com",
  })
  @IsString()
  @IsNotEmpty()
  domain: string;

  @ApiPropertyOptional({
    description: "SSO provider name",
    example: "azure-ad",
  })
  @IsString()
  @IsOptional()
  sso_provider?: string;

  @ApiPropertyOptional({
    description: "SSO configuration as JSON object",
    example: { clientId: "abc123", tenantId: "def456" },
  })
  @IsObject()
  @IsOptional()
  sso_config?: Record<string, unknown>;
}
