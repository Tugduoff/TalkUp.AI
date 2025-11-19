import { PartialType } from "@nestjs/swagger";
import { CreateEventDto } from "./createEvent.dto";

export class UpdateEventDto extends PartialType(CreateEventDto) {}
