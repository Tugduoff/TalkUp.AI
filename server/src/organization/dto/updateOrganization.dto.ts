import { PartialType } from "@nestjs/swagger";
import { CreateOrganizationDto } from "./createOrganization.dto";

export class UpdateOrganizationDto extends PartialType(CreateOrganizationDto) {}
