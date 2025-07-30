import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { OrganizationService } from "./organization.service";
import { CreateOrganizationDto } from "./dto/createOrganization.dto";
import { UpdateOrganizationDto } from "./dto/updateOrganization.dto";

@ApiTags("Organization")
@Controller("organization")
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @ApiOperation({ summary: "Create a new organization" })
  @ApiResponse({
    status: 201,
    description: "Organization created successfully",
  })
  @ApiResponse({
    status: 409,
    description: "Organization with this domain already exists",
  })
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationService.create(createOrganizationDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all organizations" })
  @ApiResponse({ status: 200, description: "List of all organizations" })
  findAll() {
    return this.organizationService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get organization by ID" })
  @ApiParam({ name: "id", description: "Organization ID" })
  @ApiResponse({ status: 200, description: "Organization found" })
  @ApiResponse({ status: 404, description: "Organization not found" })
  findOne(@Param("id") id: string) {
    return this.organizationService.findOne(id);
  }

  @Get("domain/:domain")
  @ApiOperation({ summary: "Get organization by domain" })
  @ApiParam({ name: "domain", description: "Organization domain" })
  @ApiResponse({ status: 200, description: "Organization found" })
  @ApiResponse({ status: 404, description: "Organization not found" })
  findByDomain(@Param("domain") domain: string) {
    return this.organizationService.findByDomain(domain);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update organization" })
  @ApiParam({ name: "id", description: "Organization ID" })
  @ApiResponse({
    status: 200,
    description: "Organization updated successfully",
  })
  @ApiResponse({ status: 404, description: "Organization not found" })
  @ApiResponse({ status: 409, description: "Domain conflict" })
  update(
    @Param("id") id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(id, updateOrganizationDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete organization" })
  @ApiParam({ name: "id", description: "Organization ID" })
  @ApiResponse({
    status: 204,
    description: "Organization deleted successfully",
  })
  @ApiResponse({ status: 404, description: "Organization not found" })
  remove(@Param("id") id: string) {
    return this.organizationService.remove(id);
  }

  @Post(":id/users/:userId")
  @ApiOperation({ summary: "Add user to organization" })
  @ApiParam({ name: "id", description: "Organization ID" })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiResponse({ status: 201, description: "User added to organization" })
  @ApiResponse({ status: 404, description: "Organization or user not found" })
  @ApiResponse({
    status: 409,
    description: "User already member of organization",
  })
  addUser(
    @Param("id") id: string,
    @Param("userId") userId: string,
    @Body("role") role = "user",
  ) {
    return this.organizationService.addUserToOrganization(id, userId, role);
  }

  @Delete(":id/users/:userId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remove user from organization" })
  @ApiParam({ name: "id", description: "Organization ID" })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiResponse({ status: 204, description: "User removed from organization" })
  @ApiResponse({ status: 404, description: "User not member of organization" })
  removeUser(@Param("id") id: string, @Param("userId") userId: string) {
    return this.organizationService.removeUserFromOrganization(id, userId);
  }

  @Patch(":id/users/:userId/role")
  @ApiOperation({ summary: "Update user role in organization" })
  @ApiParam({ name: "id", description: "Organization ID" })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiResponse({ status: 200, description: "User role updated" })
  @ApiResponse({ status: 404, description: "User not member of organization" })
  updateUserRole(
    @Param("id") id: string,
    @Param("userId") userId: string,
    @Body("role") role: string,
  ) {
    return this.organizationService.updateUserRole(id, userId, role);
  }

  @Get(":id/users")
  @ApiOperation({ summary: "Get all users in organization" })
  @ApiParam({ name: "id", description: "Organization ID" })
  @ApiResponse({ status: 200, description: "List of organization users" })
  getUsers(@Param("id") id: string) {
    return this.organizationService.getOrganizationUsers(id);
  }
}
