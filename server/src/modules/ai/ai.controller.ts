import {
  Controller,
  Body,
  Post,
  Put,
  UseGuards,
  Get,
  Param,
  Query,
} from "@nestjs/common";

import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth,
  ApiExtraModels,
} from "@nestjs/swagger";

import { UsePipes } from "@nestjs/common/decorators/core/use-pipes.decorator";

import { PostValidationPipe } from "@common/pipes/PostValidationPipe";
import { AccessTokenGuard } from "@common/guards/accessToken.guard";
import { UserId } from "@common/decorators/userId.decorator";

import { AiService } from "./ai.service";

import { CreateAiInterviewDto } from "./dto/createAiInterview.dto";
import { PutAiInterviewDto } from "./dto/putAiInterview.dto";
import { GetInterviewsQueryDto } from "./dto/getInterviewsQuery.dto";
import { CreateAiTranscriptsDto } from "./dto/createAiTranscripts.dto";

@ApiTags("AI")
@Controller("ai")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @ApiCreatedResponse({
    description: "The AI interview has been successfully created.",
    type: CreateAiInterviewDto,
  })
  @ApiBadRequestResponse({
    description: "Badly formatted parameter.",
  })
  @ApiConflictResponse({
    description: "AI interview already asked.",
  })
  @ApiUnprocessableEntityResponse({
    description: "Missing parameter in request.",
  })
  @ApiBearerAuth("access-token")
  @UsePipes(new PostValidationPipe())
  @UseGuards(AccessTokenGuard)
  @Post("interviews")
  async createAiInterview(
    @Body() createAiInterviewDto: CreateAiInterviewDto,
    @UserId() userId: string,
  ) {
    return this.aiService.createInterview(createAiInterviewDto, userId);
  }

  @ApiOkResponse({
    description: "The AI interview has been successfully edited.",
    type: PutAiInterviewDto,
  })
  @ApiBadRequestResponse({
    description: "Badly formatted parameter.",
  })
  @ApiConflictResponse({
    description: "AI interview cannot be edited.",
  })
  @ApiUnprocessableEntityResponse({
    description: "Missing parameter in request.",
  })
  @ApiBearerAuth("access-token")
  @UsePipes(new PostValidationPipe())
  @UseGuards(AccessTokenGuard)
  @Put("interviews")
  async editAiInterview(
    @Body() editAiInterviewDto: PutAiInterviewDto,
    @UserId() userId: string,
  ) {
    return this.aiService.editAiInterview(editAiInterviewDto, userId);
  }

  @ApiExtraModels(GetInterviewsQueryDto)
  @ApiOkResponse({
    description: "List of AI interviews for the user.",
  })
  @ApiBadRequestResponse({
    description: "Badly formatted parameter.",
  })
  @ApiBearerAuth("access-token")
  @UseGuards(AccessTokenGuard)
  @Get("interviews")
  async getUserInterviews(
    @Query() query: GetInterviewsQueryDto,
    @UserId() userId: string,
  ) {
    return this.aiService.getUserInterviews(query, userId);
  }

  @ApiCreatedResponse({
    description: "Transcripts have been added to the interview.",
  })
  @ApiBadRequestResponse({
    description: "Badly formatted parameter.",
  })
  @ApiBearerAuth("access-token")
  @UsePipes(new PostValidationPipe())
  @UseGuards(AccessTokenGuard)
  @Post("interviews/:id/transcripts")
  async addTranscripts(
    @Param("id") interviewId: string,
    @Body() createTranscriptsDto: CreateAiTranscriptsDto,
    @UserId() userId: string,
  ) {
    return this.aiService.addTranscripts(
      interviewId,
      createTranscriptsDto,
      userId,
    );
  }

  @ApiOkResponse({
    description: "Retrieve a single AI interview by id.",
  })
  @ApiBadRequestResponse({
    description: "Badly formatted parameter.",
  })
  @ApiBearerAuth("access-token")
  @UseGuards(AccessTokenGuard)
  @Get("interviews/:id")
  async getOneInterview(@Param("id") id: string, @UserId() userId: string) {
    const interview = await this.aiService.getInterviewById(id, userId, true);

    if (!interview) return {};
    return interview;
  }
}
