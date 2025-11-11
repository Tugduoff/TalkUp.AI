import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { IsArray, ValidateNested, IsString, Length, IsEnum } from "class-validator";
import { Type } from "class-transformer";

import { AiTranscriptStated } from "@common/enums/AiTranscriptStated";

@ApiSchema({
  name: "TranscriptItemDto",
  description: "Data transfer object for creating one AI interview transcripts.",
})
class TranscriptItemDto {
  @ApiProperty({ description: "Transcript text" })
  @IsString()
  @Length(1, 20000)
  content: string;

  @ApiProperty({ description: "Who stated the transcript", enum: AiTranscriptStated })
  @IsEnum(AiTranscriptStated)
  who_stated: AiTranscriptStated;
}

@ApiSchema({
  name: "CreateAiTranscriptsDto",
  description: "Data transfer object for creating multiple AI interview transcripts (an array of TranscriptItemDto).",
})
export class CreateAiTranscriptsDto {
  @ApiProperty({ description: "Array of transcript items", type: [TranscriptItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranscriptItemDto)
  transcripts: TranscriptItemDto[];
}
