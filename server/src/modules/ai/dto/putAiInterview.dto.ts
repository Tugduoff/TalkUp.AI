import {
  ApiProperty,
  ApiPropertyOptional,
  ApiSchema,
  PartialType,
} from "@nestjs/swagger";
import { IsOptional, Length, IsEnum, IsUrl, IsInt } from "class-validator";

import { CreateAiInterviewDto } from "./createAiInterview.dto";
import { AiInterviewStatus } from "@common/enums/AiInterviewStatus";

@ApiSchema({
  name: "PutAiInterviewDto",
  description:
    "Data transfer object for editing an existing AI interview request.",
})
export class PutAiInterviewDto extends PartialType(CreateAiInterviewDto) {
  @ApiPropertyOptional({
    description: "The current status of the AI interview request.",
    example: AiInterviewStatus.ASKED,
  })
  @IsOptional()
  @IsEnum(AiInterviewStatus, {
    message: `Status must be one of the following values: ${Object.values(
      AiInterviewStatus,
    ).join(", ")}`,
  })
  status: AiInterviewStatus;

  @ApiPropertyOptional({
    description: "The score achieved in the AI interview, if applicable.",
    example: 85,
    required: false,
  })
  @IsOptional()
  @IsInt()
  score: number;

  @ApiPropertyOptional({
    description: "Feedback provided for the AI interview, if any.",
    example:
      "Great performance with room for improvement in technical questions.",
    required: false,
  })
  @IsOptional()
  @Length(0, 500, {
    message: "Feedback must be at most 500 characters long.",
  })
  feedback: string;

  @ApiPropertyOptional({
    description:
      "Link to the video recording of the AI interview, if available.",
    example: "https://example.com/interview/video/12345",
    required: false,
  })
  @IsOptional()
  @IsUrl()
  videoLink: string;
}
