import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThanOrEqual, MoreThanOrEqual } from "typeorm";

import { CreateEventDto } from "./dto/createEvent.dto";
import { UpdateEventDto } from "./dto/updateEvent.dto";

import { agenda_event } from "@entities/agenda.entity";

@Injectable()
export class AgendaService {
  private readonly logger: Logger;

  constructor(
    @InjectRepository(agenda_event)
    private repo: Repository<agenda_event>,
  ) {
    this.logger = new Logger(AgendaService.name);
  }

  async create(user_id: string, payload: CreateEventDto) {
    if (payload.end_at && payload.end_at <= payload.start_at) {
      throw new BadRequestException(
        "End time cannot be before start time.",
      );
    }

    try {
      const entity = this.repo.create({ ...payload, user_id });

      return await this.repo.save(entity);
    } catch (error) {
      this.logger.error(
        `Error creating agenda event for user ${user_id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        "Internal server error while creating agenda event.",
      );
    }
  }

  async findOne(user_id: string, event_id: string) {
    try {
      return await this.repo.findOne({ where: { user_id, event_id } });
    } catch (error) {
      this.logger.error(
        `Error retrieving agenda event ${event_id} for user ${user_id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        "Internal server error while retrieving agenda event.",
      );
    }
  }

  async update(user_id: string, event_id: string, payload: UpdateEventDto) {
    const agenda = await this.findOne(user_id, event_id);

    if (!agenda) throw new NotFoundException("Event not found.");
    if (
      payload.end_at &&
      payload.start_at &&
      payload.end_at <= payload.start_at
    ) {
      throw new BadRequestException(
        "End time cannot be before start time.",
      );
    }
    Object.assign(agenda, payload);

    try {
      return await this.repo.save(agenda);
    } catch (error) {
      this.logger.error(
        `Error updating agenda event ${event_id} for user ${user_id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        "Internal server error while updating agenda event.",
      );
    }
  }

  async remove(user_id: string, event_id: string) {
    try {
      const agenda = await this.findOne(user_id, event_id);

      if (!agenda) throw new NotFoundException("Event not found.");
      await this.repo.remove(agenda);
      return true;
    } catch (error) {

      // Re-throw known exceptions from findOne method, to avoid relogging them
      if (error instanceof NotFoundException || error instanceof InternalServerErrorException) {
        throw error;
      }
      this.logger.error(
        `Error removing agenda event ${event_id} for user ${user_id}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        "Internal server error while removing agenda event.",
      );
    }
  }

  async listForRange(user_id: string, from: Date, to: Date) {
    try {
      return await this.repo.find({
        where: { user_id, start_at: LessThanOrEqual(to), end_at: MoreThanOrEqual(from) },
        order: { start_at: "ASC" },
      });
    } catch (error) {
      this.logger.error(
        `Error listing agenda events for user ${user_id} from ${from} to ${to}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        "Internal server error while listing agenda events.",
      );
    }
  }
}
