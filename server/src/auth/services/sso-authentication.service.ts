import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { user, user_email, user_oauth } from "@entities/user.entity";
import { organization } from "@entities/organization.entity";
import { SsoUser, SsoAuthResult } from "../interfaces/sso-user.interface";
import { AuthProvider } from "@common/enums/AuthProvider";
import { OrganizationService } from "../../organization/organization.service";
import { UserRepositoryService } from "./user-repository.service";
import { TokenService } from "./token.service";

/**
 * Service for handling SSO authentication and user management
 */
@Injectable()
export class SSOAuthenticationService {
  constructor(
    @InjectRepository(user) private userRepository: Repository<user>,
    @InjectRepository(user_email)
    private userEmailRepository: Repository<user_email>,
    @InjectRepository(user_oauth)
    private userOauthRepository: Repository<user_oauth>,
    private organizationService: OrganizationService,
    private userRepositoryService: UserRepositoryService,
    private tokenService: TokenService,
  ) {}

  /**
   * Authenticate user via SSO and link to organization
   * @param ssoUser - SSO user profile
   * @returns Authentication result with JWT token
   */
  async authenticateWithSSO(ssoUser: SsoUser): Promise<SsoAuthResult> {
    let organization: organization | undefined;
    let user: user;
    let isNewUser = false;

    if (ssoUser.organizationIdentifier) {
      organization =
        await this.organizationService.findOrganizationBySsoIdentifier(
          ssoUser.organizationIdentifier,
          ssoUser.provider,
        );
    }

    const existingUser =
      await this.userRepositoryService.findUserByAnyIdentifier(ssoUser.email);

    if (existingUser) {
      user = existingUser;

      await this.updateOrCreateOAuthRecord(user.user_id, ssoUser);
      await this.ensureUserHasEmail(user.user_id, ssoUser.email);
    } else {
      isNewUser = true;
      user = await this.createUserFromSSO(ssoUser);
    }

    if (organization) {
      await this.organizationService.linkUserToOrganization(
        user.user_id,
        organization.org_id,
      );
    }

    const tokenResult = await this.tokenService.generateOrganizationToken(
      user,
      organization,
    );

    return {
      user,
      organization,
      isNewUser,
      accessToken: tokenResult.access_token,
    };
  }

  /**
   * Create a new user from SSO data
   * @param ssoUser - SSO user profile
   * @returns Created user entity
   */
  private async createUserFromSSO(ssoUser: SsoUser): Promise<user> {
    const newUser = this.userRepository.create({
      username: ssoUser.displayName,
      provider: this.mapSsoProviderToAuthProvider(ssoUser.provider),
    });

    const savedUser = await this.userRepository.save(newUser);

    if (!savedUser.user_id) {
      throw new InternalServerErrorException(
        "Failed to save user - no user_id generated",
      );
    }

    const userEmail = this.userEmailRepository.create({
      email: ssoUser.email,
      user_id: savedUser.user_id,
      is_verified: true,
    });

    await this.userEmailRepository.save(userEmail);
    await this.updateOrCreateOAuthRecord(savedUser.user_id, ssoUser);

    return savedUser;
  }

  /**
   * Update or create OAuth record for the user
   * @param userId - User ID
   * @param ssoUser - SSO user profile
   */
  private async updateOrCreateOAuthRecord(
    userId: string,
    ssoUser: SsoUser,
  ): Promise<void> {
    const provider = this.mapSsoProviderToAuthProvider(ssoUser.provider);

    let oauthRecord = await this.userOauthRepository.findOne({
      where: { user_id: userId, provider },
    });

    if (oauthRecord) {
      oauthRecord.access_token =
        ssoUser.accessToken ?? oauthRecord.access_token;
      oauthRecord.refresh_token =
        ssoUser.refreshToken ?? oauthRecord.refresh_token;
      await this.userOauthRepository.save(oauthRecord);
    } else {
      oauthRecord = this.userOauthRepository.create({
        user_id: userId,
        provider,
        access_token: ssoUser.accessToken ?? "",
        refresh_token: ssoUser.refreshToken ?? "",
      });
      await this.userOauthRepository.save(oauthRecord);
    }
  }

  /**
   * Map SSO provider to AuthProvider enum
   * @param ssoProvider - SSO provider string
   * @returns Corresponding AuthProvider enum value
   */
  private mapSsoProviderToAuthProvider(ssoProvider: string): AuthProvider {
    switch (ssoProvider) {
      case "azure-ad":
        return AuthProvider.MICROSOFT;
      case "google-workspace":
        return AuthProvider.GOOGLE;
      case "saml":
        return AuthProvider.SAML;
      default:
        return AuthProvider.LINKEDIN;
    }
  }

  /**
   * Ensure user has an email record, creating it if necessary
   * @param userId - User ID
   * @param email - User email
   */
  private async ensureUserHasEmail(
    userId: string,
    email: string,
  ): Promise<void> {
    const userEmailRecord = await this.userEmailRepository.findOne({
      where: { user_id: userId },
    });

    if (userEmailRecord) {
      return;
    }

    const orphanedEmailRecord = await this.userEmailRepository.findOne({
      where: { email: email },
    });

    if (
      orphanedEmailRecord &&
      (!orphanedEmailRecord.user_id ||
        orphanedEmailRecord.user_id === "undefined")
    ) {
      orphanedEmailRecord.user_id = userId;
      orphanedEmailRecord.is_verified = true;
      await this.userEmailRepository.save(orphanedEmailRecord);
      return;
    }

    if (orphanedEmailRecord && orphanedEmailRecord.user_id !== userId) {
      throw new ConflictException(
        `Email ${email} is already associated with another user`,
      );
    }

    const userEmail = this.userEmailRepository.create({
      email: email,
      user_id: userId,
      is_verified: true,
    });
    await this.userEmailRepository.save(userEmail);
  }
}
