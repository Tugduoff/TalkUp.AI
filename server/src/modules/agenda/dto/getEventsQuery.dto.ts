import { ApiPropertyOptional, ApiSchema } from "@nestjs/swagger";
import { IsOptional, IsString, IsISO8601 } from "class-validator";

@ApiSchema({
  name: "GetEventsQueryDto",
  description: "Query parameters for fetching agenda events with from start and end date filters",
})
export class GetEventsQueryDto {
  @ApiPropertyOptional({
    description: "Start date filter in ISO 8601 format",
  })
  @IsOptional()
  @IsString()
  @IsISO8601()
  start_at?: string;

  @ApiPropertyOptional({
    description: "End date filter in ISO 8601 format",
  })
  @IsOptional()
  @IsString()
  @IsISO8601()
  end_at?: string;
}
