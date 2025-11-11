import { ApiPropertyOptional, ApiSchema } from "@nestjs/swagger";
import {
  IsInt,
  IsOptional,
  Min,
  Max,
  IsIn,
  IsNumber,
} from "class-validator";

@ApiSchema({
  name: "GetInterviewsQueryDto",
  description:
    "Query parameters for fetching AI interviews with pagination and filtering options.",
})
export class GetInterviewsQueryDto {
  @ApiPropertyOptional({ description: "Page number, starts at 1" })
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: "Items per page" })
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    description: "Field to sort by",
    example: "created_at",
  })
  @IsOptional()
  @IsIn(["created_at", "updated_at", "score"])
  sort?: string = "created_at";

  @ApiPropertyOptional({ description: "Sort order", example: "DESC" })
  @IsOptional()
  @IsIn(["ASC", "DESC"])
  order?: "ASC" | "DESC" = "DESC";
}
