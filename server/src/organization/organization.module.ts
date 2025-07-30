import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrganizationService } from "./organization.service";
import { OrganizationController } from "./organization.controller";
import { organization } from "@src/entities/organization.entity";
import { UserOrganization } from "@entities/userOrganization.entity";
import { user } from "@src/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([organization, UserOrganization, user])],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
