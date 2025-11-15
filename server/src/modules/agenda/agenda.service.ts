import { Injectable, InternalServerErrorException, NotFoundException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Between } from "typeorm";

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
    try {
        const entity = this.repo.create({ ...payload, user_id });

        return this.repo.save(entity);
    } catch (error) {
        this.logger.error(`Error creating agenda event for user ${user_id}: ${error.message}`, error.stack);
        throw new InternalServerErrorException("Internal server error while creating agenda event.");
    }
  }

  async findOne(user_id: string, event_id: string) {
    try {
        return this.repo.findOne({ where: { user_id, event_id } });
    } catch (error) {
        this.logger.error(`Error retrieving agenda event ${event_id} for user ${user_id}: ${error.message}`, error.stack);
        throw new InternalServerErrorException("Internal server error while retrieving agenda event.");
    }
  }

  async update(user_id: string, event_id: string, payload: UpdateEventDto) {
    const agenda = await this.findOne(user_id, event_id);

    if (!agenda)
        throw new NotFoundException("Event not found.");
    Object.assign(agenda, payload);
    return this.repo.save(agenda);
  }

  async remove(user_id: string, event_id: string) {
    const agenda = await this.findOne(user_id, event_id);

    if (!agenda)
        throw new NotFoundException("Event not found.");
    await this.repo.remove(Array.isArray(agenda) ? agenda[0] : agenda);
    return true;
  }

  async listForRange(user_id: string, from: Date, to: Date) {
    try {
        return this.repo.find({
            where: { user_id, start_at: Between(from, to) },
            order: { start_at: "ASC" },
        });
    } catch (error) {
        this.logger.error(`Error listing agenda events for user ${user_id} from ${from} to ${to}: ${error.message}`, error.stack);
        throw new InternalServerErrorException("Internal server error while listing agenda events.");
    }
  }
}
