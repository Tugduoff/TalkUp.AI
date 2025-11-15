import { ApiProperty, ApiPropertyOptional, ApiSchema } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsISO8601, IsHexColor } from "class-validator";

@ApiSchema({
    name: "CreateEventDto",
    description: "Data Transfer Object for creating a new agenda event",
})
export class CreateEventDto {

  @ApiProperty({
    description: "Title of the event",
    example: "Team Meeting",
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: "Description of the event",
    example: "Monthly team sync-up meeting to discuss project updates.",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "Start date and time of the event in ISO 8601 format",
    example: new Date().toISOString(),
  })
  @IsNotEmpty()
  @IsISO8601()
  start_at: string;

  @ApiPropertyOptional({
    description: "End date and time of the event in ISO 8601 format",
    example: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(), // 1 hour later
  })
  @IsOptional()
  @IsISO8601()
  end_at?: string;

  @ApiPropertyOptional({
    description: "Location of the event",
    example: "Home",
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    description: "Indicates if the event lasts all day",
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  all_day?: boolean;

  @ApiPropertyOptional({
    description: "Color associated with the event",
    example: "#FF5733",
  })
  @IsOptional()
  @IsString()
  @IsHexColor()
  color?: string;
  @ApiPropertyOptional({
    description: "IANA timezone identifier for the event (e.g. 'Europe/Paris')",
    example: "Europe/Paris",
  })
  @IsOptional()
  @IsString()
  timezone?: string;
}
