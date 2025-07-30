import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { user, user_email } from "@entities/user.entity";
import { organization } from "@entities/organization.entity";
import { UserOrganization } from "@entities/userOrganization.entity";

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(user_email)
    private userEmailRepository: Repository<user_email>,
    @InjectRepository(UserOrganization)
    private userOrganizationRepository: Repository<UserOrganization>,
  ) {}

  /**
   * Generate basic JWT token for user login
   * @param user - User entity
   * @returns JWT token object
   */
  login(user: user) {
    const payload = { sub: user.user_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Generate JWT token with organization context
   * @param user - User entity
   * @param organization - Organization entity (optional)
   * @returns JWT token object
   */
  async generateOrganizationToken(user: user, organization?: organization) {
    const payload: Record<string, unknown> = {
      sub: user.user_id,
      username: user.username,
    };

    // Get user email
    const userEmail = await this.userEmailRepository.findOne({
      where: { user_id: user.user_id },
    });
    if (userEmail) {
      payload.email = userEmail.email;
    }

    if (organization) {
      payload.org_id = organization.org_id;
      payload.org_domain = organization.domain;

      // Get user role in organization
      const userOrg = await this.userOrganizationRepository.findOne({
        where: { user_id: user.user_id, org_id: organization.org_id },
      });
      if (userOrg) {
        payload.org_role = userOrg.role;
      }
    }

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
