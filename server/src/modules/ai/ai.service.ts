import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsOrder, Repository } from "typeorm";

import { HttpService } from "@nestjs/axios";
import { AxiosResponse } from "axios";

import { ai_interview } from "@entities/aiInterview.entity";
import { ai_transcript } from "@entities/aiTranscript.entity";

import { AiInterviewStatus } from "@common/enums/AiInterviewStatus";

import { CreateAiInterviewDto } from "./dto/createAiInterview.dto";
import { PutAiInterviewDto } from "./dto/putAiInterview.dto";
import { GetInterviewsQueryDto } from "./dto/getInterviewsQuery.dto";
import { CreateAiTranscriptsDto } from "./dto/createAiTranscripts.dto";

@Injectable()
export class AiService {
  private AI_SERVER_URL = process.env.AI_SERVER_URL ?? "";
  private readonly logger: Logger;

  constructor(
    @InjectRepository(ai_interview)
    private aiInterviewRepository: Repository<ai_interview>,
    @InjectRepository(ai_transcript)
    private aiTranscriptRepository: Repository<ai_transcript>,
    private readonly httpService: HttpService,
  ) {
    this.logger = new Logger(AiService.name);
  }

  async createInterview(dto: CreateAiInterviewDto, userId: string) {
    let AIresponse: AxiosResponse<{
      key: string;
      type: string;
      format: string;
      data: string;
    }>;
    let alreadyExists;

    // Check if an interview is already asked and not completed
    try {
      alreadyExists = await this.aiInterviewRepository.findOne({
        where: { user_id: userId, status: AiInterviewStatus.ASKED },
      });
    } catch (error) {
      this.logger.error(
        `Failed to check existing interview for user ${userId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        "Internal server error while checking existing interview.",
      );
    }

    if (alreadyExists) {
      this.logger.warn(
        `AI interview already asked for user ${userId}, creating duplicate request blocked.`,
      );
      throw new ConflictException("AI interview already asked.");
    }

    // Call AI server to init interview
    try {
      AIresponse = await this.httpService.axiosRef.post(
        `${this.AI_SERVER_URL}/process/initialization`,
        {
          key: "c7yPY8u644OE", // Temporary key for testing purposes
          type: "initialization",
          format: "text",
          data: "",
        },
      );
    } catch (error) {
      this.logger.error(
        `Failed to call AI server for user ${userId}: ${JSON.stringify(error)}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        "Internal server error while contacting AI server.",
      );
    }

    if (AIresponse.status !== 200) {
      this.logger.error(
        `AI server responded with status ${AIresponse.status} for user ${userId}: ${JSON.stringify(AIresponse.data)}`,
      );
      throw new InternalServerErrorException("AI server error.");
    }

    // Create and save new interview record
    const newInterview = this.aiInterviewRepository.create({
      user_id: userId,
      ...dto,
    });

    try {
      await this.aiInterviewRepository.save(newInterview);
    } catch (error) {
      this.logger.error(
        `Failed to create AI interview for user ${userId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        "Internal server error while creating AI interview.",
      );
    }

    return {
      interviewID: newInterview.interview_id,
      entrypoint: AIresponse.data.data,
    };
  }

  async editAiInterview(dto: PutAiInterviewDto, userId: string) {
    let alreadyExists = await this.getInterviewById(dto.interviewId, userId);

    if (!alreadyExists) {
      this.logger.warn(
        `AI interview with id ${dto.interviewId} not found for user ${userId}.`,
      );
      throw new UnauthorizedException("AI interview not found.");
    }

    // if interview is completed, set ended_at date
    if (
      dto.status &&
      alreadyExists.status !== AiInterviewStatus.COMPLETED &&
      dto.status === AiInterviewStatus.COMPLETED
    )
      alreadyExists.ended_at = new Date();

    // Update the interview record with the new data
    Object.assign(alreadyExists, {
      ...dto,
    });

    try {
      await this.aiInterviewRepository.save(alreadyExists);
    } catch (error) {
      this.logger.error(
        `Failed to edit AI interview for user ${userId} and id ${dto.interviewId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        "Internal server error while editing AI interview.",
      );
    }

    return true;
  }

  async getUserInterviews(query: GetInterviewsQueryDto, userId: string) {
    // build order object to sort depending on query
    const order: FindOptionsOrder<any> = {};
    order[query.sort ?? "created_at"] = query.order ?? "DESC";

    // no pagination parameters provided, return all items
    if (!query.page && !query.limit) {
      try {
        const items = await this.aiInterviewRepository.find({
          where: { user_id: userId },
          order,
        });

        return {
          data: items,
          meta: { total: items.length },
        };
      } catch (error) {
        this.logger.error(
          `Failed to retrieve AI interviews for user ${userId}: ${error.message}`,
          error.stack,
        );
        throw new InternalServerErrorException(
          "Internal server error while retrieving AI interviews.",
        );
      }
    }

    // Set default pagination values because otherwise typescript complains
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    try {
      const [items, total] = await this.aiInterviewRepository.findAndCount({
        where: { user_id: userId },
        order,
        take: limit,
        skip,
      });

      return {
        data: items,
        meta: { total, page, limit },
      };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve AI interviews for user ${userId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        "Internal server error while retrieving AI interviews.",
      );
    }
  }

  async addTranscripts(
    interviewId: string,
    dto: CreateAiTranscriptsDto,
    userId: string,
  ) {
    const interview = await this.getInterviewById(interviewId, userId);

    if (!interview) {
      this.logger.warn(
        `AI interview with id ${interviewId} not found for user ${userId}.`,
      );
      throw new UnauthorizedException("AI interview not found.");
    }

    const records = dto.transcripts.map((t) =>
      this.aiTranscriptRepository.create({
        interview_id: interviewId,
        content: t.content,
        who_stated: t.who_stated,
      }),
    );

    try {
      const saved = await this.aiTranscriptRepository.save(records);
      return { inserted: saved.length, data: saved };
    } catch (error) {
      this.logger.error(
        `Failed to save transcripts for interview ${interviewId} (user ${userId}): ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        "Internal server error while saving transcripts.",
      );
    }
  }

  /*----------- UTILITY FUNCTIONS -----------*/

  /**
   * UTILS function
   * Check if an interview exists for a given user and interview ID (if no ID provided, returns null)
   * @param interviewId id of the interview to check
   * @param userId id of the user owning the interview
   * @returns The interview entity if found, null otherwise
   */
  async getInterviewById(
    interviewId: string,
    userId: string,
    getTranscripts: boolean = false,
  ) {
    // No interview to check
    if (!interviewId) return null;

    try {
      const interview = await this.aiInterviewRepository.findOne({
        where: { user_id: userId, interview_id: interviewId },
      });

      if (!interview) return null;

      const transcripts = getTranscripts
        ? await this.aiTranscriptRepository.find({
            where: { interview_id: interviewId },
            order: { inserted_at: "ASC" },
          })
        : [];
      return { ...interview, transcripts };
    } catch (error) {
      this.logger.error(
        `Failed to check existing interview for user ${userId} and id ${interviewId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        "Internal server error while getting the interview.",
      );
    }
  }
}
