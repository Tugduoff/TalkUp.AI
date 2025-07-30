import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { organization } from "@src/entities/organization.entity";
import { UserOrganization } from "@entities/userOrganization.entity";
import { user } from "@src/entities/user.entity";
import { CreateOrganizationDto } from "./dto/createOrganization.dto";
import { UpdateOrganizationDto } from "./dto/updateOrganization.dto";

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(organization)
    private organizationRepository: Repository<organization>,
    @InjectRepository(UserOrganization)
    private userOrganizationRepository: Repository<UserOrganization>,
    @InjectRepository(user)
    private userRepository: Repository<user>,
  ) {}

  async create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<organization> {
    // Check if domain already exists
    const existingOrg = await this.organizationRepository.findOne({
      where: { domain: createOrganizationDto.domain },
    });

    if (existingOrg) {
      throw new ConflictException(
        "Organization with this domain already exists",
      );
    }

    const newOrganization = this.organizationRepository.create(
      createOrganizationDto,
    );
    return await this.organizationRepository.save(newOrganization);
  }

  async findAll(): Promise<organization[]> {
    return await this.organizationRepository.find();
  }

  async findOne(org_id: string): Promise<organization> {
    const org = await this.organizationRepository.findOne({
      where: { org_id },
    });

    if (!org) {
      throw new NotFoundException("Organization not found");
    }

    return org;
  }

  async findByDomain(domain: string): Promise<organization> {
    const org = await this.organizationRepository.findOne({
      where: { domain },
    });

    if (!org) {
      throw new NotFoundException("Organization not found");
    }

    return org;
  }

  async update(
    org_id: string,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<organization> {
    const org = await this.findOne(org_id);

    // Check if domain is being updated and if it conflicts
    if (
      updateOrganizationDto.domain &&
      updateOrganizationDto.domain !== org.domain
    ) {
      const existingOrg = await this.organizationRepository.findOne({
        where: { domain: updateOrganizationDto.domain },
      });

      if (existingOrg) {
        throw new ConflictException(
          "Organization with this domain already exists",
        );
      }
    }

    Object.assign(org, updateOrganizationDto);
    return await this.organizationRepository.save(org);
  }

  async remove(org_id: string): Promise<void> {
    const org = await this.findOne(org_id);
    await this.organizationRepository.remove(org);
  }

  async addUserToOrganization(
    org_id: string,
    user_id: string,
    role = "user",
  ): Promise<UserOrganization> {
    // Verify organization exists
    await this.findOne(org_id);

    // Verify user exists
    const userExists = await this.userRepository.findOne({
      where: { user_id },
    });

    if (!userExists) {
      throw new NotFoundException("User not found");
    }

    // Check if relationship already exists
    const existingRelation = await this.userOrganizationRepository.findOne({
      where: { org_id, user_id },
    });

    if (existingRelation) {
      throw new ConflictException(
        "User is already a member of this organization",
      );
    }

    const userOrganization = this.userOrganizationRepository.create({
      org_id,
      user_id,
      role,
    });

    return await this.userOrganizationRepository.save(userOrganization);
  }

  async removeUserFromOrganization(
    org_id: string,
    user_id: string,
  ): Promise<void> {
    const relation = await this.userOrganizationRepository.findOne({
      where: { org_id, user_id },
    });

    if (!relation) {
      throw new NotFoundException("User is not a member of this organization");
    }

    await this.userOrganizationRepository.remove(relation);
  }

  async updateUserRole(
    org_id: string,
    user_id: string,
    role: string,
  ): Promise<UserOrganization> {
    const relation = await this.userOrganizationRepository.findOne({
      where: { org_id, user_id },
    });

    if (!relation) {
      throw new NotFoundException("User is not a member of this organization");
    }

    relation.role = role;
    return await this.userOrganizationRepository.save(relation);
  }

  async getOrganizationUsers(org_id: string): Promise<UserOrganization[]> {
    return await this.userOrganizationRepository.find({
      where: { org_id },
      relations: ["user"],
    });
  }
}
