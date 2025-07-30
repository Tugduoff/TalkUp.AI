import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class OrgLoginDto {
  @ApiProperty({
    description:
      "The user's identifier - can be either email address or phone number",
    examples: {
      email: {
        summary: "Email identifier",
        value: "john.doe@company.com",
      },
      phone: {
        summary: "Phone identifier",
        value: "+33769293743",
      },
    },
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({
    description:
      "The user's password (must be strong: 8+ chars with uppercase, lowercase, number, and special character)",
    example: "SecurePass123@",
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: "The organization domain",
    example: "company.com",
  })
  @IsString()
  @IsNotEmpty()
  orgDomain: string;
}
