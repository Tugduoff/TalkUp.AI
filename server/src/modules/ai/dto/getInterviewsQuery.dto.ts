import { ApiPropertyOptional, ApiSchema } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Min, Max, IsIn } from "class-validator";

@ApiSchema({
  name: "GetInterviewsQueryDto",
  description:
    "Query parameters for fetching AI interviews with pagination and filtering options.",
})
export class GetInterviewsQueryDto {
  @ApiPropertyOptional({ description: "Page number, starts at 1" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: "Items per page" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    description: "Field to sort by",
    example: "created_at",
    enum: ["created_at", "updated_at", "score"],
  })
  @IsOptional()
  @IsIn(["created_at", "updated_at", "score"])
  sort?: string = "created_at";

  @ApiPropertyOptional({
    description: "Sort order",
    example: "DESC",
    enum: ["ASC", "DESC"],
  })
  @IsOptional()
  @IsIn(["ASC", "DESC"])
  order?: "ASC" | "DESC" = "DESC";
}
