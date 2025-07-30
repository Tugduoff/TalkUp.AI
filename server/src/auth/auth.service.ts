import { Repository } from "typeorm";

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  Logger,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { HttpService } from "@nestjs/axios";
import { AxiosResponse } from "axios";

import { CreateUserDto } from "./dto/createUser.dto";
import { UsersService } from "@src/users/users.service";

import {
  user,
  user_email,
  user_oauth,
  user_password,
  user_phone_number,
} from "@entities/user.entity";
import { organization } from "@entities/organization.entity";
import { UserOrganization } from "@entities/userOrganization.entity";

import { hashPassword } from "@common/utils/passwordHasher";
import { LinkedInProfile, LinkedInTokenDatas } from "@common/utils/types";
import { AuthProvider } from "@common/enums/AuthProvider";
import { SsoUser, SsoAuthResult } from "./interfaces/sso-user.interface";

@Injectable()
export class AuthService {
  private clientId = process.env.LINKEDIN_CLIENT_ID ?? "";
  private clientSecret = process.env.LINKEDIN_CLIENT_SECRET ?? "";
  private redirectUri = process.env.LINKEDIN_OAUTH_CALLBACK ?? "";

  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(user) private userRepository: Repository<user>,
    @InjectRepository(user_password)
    private userPasswordRepository: Repository<user_password>,
    @InjectRepository(user_phone_number)
    private userPhoneNumberRepository: Repository<user_phone_number>,
    @InjectRepository(user_email)
    private userEmailRepository: Repository<user_email>,
    @InjectRepository(user_oauth)
    private userOauthRepository: Repository<user_oauth>,
    @InjectRepository(organization)
    private organizationRepository: Repository<organization>,
    @InjectRepository(UserOrganization)
    private userOrganizationRepository: Repository<UserOrganization>,

    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Registers a new user and returns a JWT token.
   * @param createUserDto - The DTO containing user registration data.
   * @returns An object containing the access token.
   * @throws ConflictException if an account with the same phone number already exists.
   */
  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string }> {
    // Check if the user already exists
    const phoneNumberExists = await this.userPhoneNumberRepository.findOne({
      where: { phone_number: createUserDto.phoneNumber },
    });

    if (phoneNumberExists) {
      throw new ConflictException(
        "An account with this phone number already exists",
      );
    }

    // Create a new user, contains only the username
    const newUser = this.userRepository.create({
      username: createUserDto.username,
    });

    // Save the user to the database, contains every user information
    const savedUser = await this.userRepository.save(newUser);

    // create user_password
    const newUserPassword = this.userPasswordRepository.create({
      password: await hashPassword(createUserDto.password),
      user_id: savedUser.user_id,
    });

    // create user_phonenumber
    const newUserPhoneNumber = this.userPhoneNumberRepository.create({
      phone_number: createUserDto.phoneNumber,
      user_id: savedUser.user_id,
    });

    // Save the password, and phone number to the database
    await this.userPasswordRepository.save(newUserPassword);
    await this.userPhoneNumberRepository.save(newUserPhoneNumber);

    const payload = {
      userId: savedUser.user_id,
      username: savedUser.username,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async validateUser(phoneNumber: string, password: string): Promise<user> {
    const result =
      await this.usersService.findUserWithPasswordByPhoneNumber(phoneNumber);
    if (!result) {
      throw new UnauthorizedException("Phone number not found");
    }

    const match = await bcrypt.compare(password, result.passwordHash);
    if (!match) {
      throw new UnauthorizedException("Invalid password");
    }

    return result.user;
  }

  async changeUserPassword(
    phone_number: string,
    newUserPassword: string,
  ): Promise<boolean> {
    const phoneNumberEntity = await this.userPhoneNumberRepository.findOne({
      where: { phone_number },
    });

    if (!phoneNumberEntity) {
      throw new UnauthorizedException(
        "There is no user with that phone number",
      );
    }

    const hashedPassword = await hashPassword(newUserPassword);

    const passwordEntity = await this.userPasswordRepository.findOne({
      where: { user_id: phoneNumberEntity.user_id },
    });

    if (!passwordEntity) {
      const newUserPassword = this.userPasswordRepository.create({
        password: hashedPassword,
        user_id: phoneNumberEntity.user_id,
      });
      await this.userPasswordRepository.save(newUserPassword);
    } else {
      passwordEntity.password = hashedPassword;
      await this.userPasswordRepository.save(passwordEntity);
    }

    return true;
  }

  login(user: user) {
    const payload = { sub: user.user_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Fetches the access token data from LinkedIn using the authorization code.
   * @param code - The authorization code (query) received from LinkedIn OAuth.
   * @returns {Promise<LinkedInTokenDatas>} An object containing the access token, expiration time, and scope.
   * @throws InternalServerErrorException if the access token cannot be fetched.
   */
  async getAccessTokenDatasFromQueryCode(
    code: string,
  ): Promise<LinkedInTokenDatas> {
    const params = new URLSearchParams();

    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", this.redirectUri);
    params.append("client_id", this.clientId);
    params.append("client_secret", this.clientSecret);

    try {
      const res: AxiosResponse<{
        access_token: string;
        scope: string;
        expires_in: string;
      }> = await this.httpService.axiosRef.post(
        "https://www.linkedin.com/oauth/v2/accessToken",
        params,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        },
      );

      return res.data;
    } catch (error) {
      this.logger.error("getAccessTokenDatas ->", error);
      throw new InternalServerErrorException("Failed to fetch access token");
    }
  }

  /**
   * Fetches the LinkedIn profile using the access token.
   * @param {string} accessToken - The access token obtained from LinkedIn OAuth.
   * @returns {Promise<LinkedInProfile>} profile - The LinkedIn profile data.
   * @throws InternalServerErrorException if the profile cannot be fetched.
   */
  async getLinkedInProfileFromAccessToken(
    accessToken: string,
  ): Promise<LinkedInProfile> {
    try {
      const profile: AxiosResponse<LinkedInProfile> =
        await this.httpService.axiosRef.get(
          "https://api.linkedin.com/v2/userinfo",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );

      return profile.data;
    } catch (error) {
      this.logger.error("getLinkedInProfile ->", error);
      throw new InternalServerErrorException(
        "Failed to fetch LinkedIn profile",
      );
    }
  }

  /**
   * Saves the OAuth token data for a user.
   * @param {string} userId - The ID of the user.
   * @param {LinkedInTokenDatas} tokenData - The token data to save.
   * @return {Promise<void>} A promise that resolves when the token data is saved.
   * @throws InternalServerErrorException if there is an error saving the token data.
   */
  async saveTokenDataFromUser(
    userId: string,
    tokenData: LinkedInTokenDatas,
  ): Promise<void> {
    const oauthData = this.userOauthRepository.create({
      user_id: userId,
      provider: AuthProvider.LINKEDIN,
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in,
      refresh_token: tokenData.refresh_token,
      refresh_token_expires_in: tokenData.refresh_token_expires_in,
      scope: tokenData.scope,
    });

    await this.userOauthRepository.save(oauthData);
  }

  /**
   * Saves a LinkedIn user profile and returns a JWT token.
   * @param {LinkedInProfile} linkedInProfile - The LinkedIn profile data.
   * @param {LinkedInTokenDatas} tokenData - The OAuth token data.
   * @returns {Promise<{ accessToken: string;}>} token JWT.
   */
  async saveLinkedInUser(
    linkedInProfile: LinkedInProfile,
    tokenData: LinkedInTokenDatas,
  ): Promise<{ accessToken: string }> {
    // Check if the user already exists
    const existingUser = await this.userRepository.findOne({
      where: { username: linkedInProfile.name },
    });

    if (existingUser) {
      const payload = {
        userId: existingUser.user_id,
        username: existingUser.username,
      };
      return {
        accessToken: await this.jwtService.signAsync(payload),
      };
    }

    // Create a new user
    const newUser = this.userRepository.create({
      username: linkedInProfile.name,
      profile_picture: linkedInProfile.picture,
      provider: AuthProvider.LINKEDIN,
    });

    // Save the user to the database
    const savedUser = await this.userRepository.save(newUser);

    try {
      // Create OAuth data
      await this.saveTokenDataFromUser(savedUser.user_id, tokenData);
    } catch (error) {
      this.logger.error("Error saving OAuth data:", error);
      throw new InternalServerErrorException("Failed to save OAuth data");
    }

    // Create user_email entity
    const newUserEmail = this.userEmailRepository.create({
      email: linkedInProfile.email,
      is_verified: linkedInProfile.email_verified,
      user_id: newUser.user_id,
    });

    // Save the email to the database
    await this.userEmailRepository.save(newUserEmail);

    const payload = {
      userId: savedUser.user_id,
      username: savedUser.username,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  /**
   * Find organization by domain for SSO authentication
   * @param domain - Organization domain
   * @returns Organization entity
   */
  async findOrganizationByDomain(domain: string): Promise<organization> {
    const org = await this.organizationRepository.findOne({
      where: { domain: domain.toLowerCase() },
    });

    if (!org) {
      throw new NotFoundException(
        `Organization with domain ${domain} not found`,
      );
    }

    return org;
  }

  /**
   * Validate user for organization-scoped authentication
   * @param phoneNumber - User phone number
   * @param password - User password
   * @param orgId - Organization ID (optional)
   * @returns User entity
   */
  async validateUserWithOrganization(
    phoneNumber: string,
    password: string,
    orgId?: string,
  ): Promise<{ user: user; organization?: organization }> {
    const result =
      await this.usersService.findUserWithPasswordByPhoneNumber(phoneNumber);
    if (!result) {
      throw new UnauthorizedException("Phone number not found");
    }

    const match = await bcrypt.compare(password, result.passwordHash);
    if (!match) {
      throw new UnauthorizedException("Invalid password");
    }

    // If orgId is provided, verify user belongs to organization
    let organization: organization | undefined;
    if (orgId) {
      const userOrg = await this.userOrganizationRepository.findOne({
        where: { user_id: result.user.user_id, org_id: orgId },
        relations: ["organization"],
      });

      if (!userOrg) {
        throw new UnauthorizedException(
          "User not authorized for this organization",
        );
      }

      organization = userOrg.organization;
    }

    return { user: result.user, organization };
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

  /**
   * Register user with organization
   * @param createUserDto - User registration data
   * @param orgId - Organization ID
   * @param role - User role in organization (default: 'user')
   * @returns JWT token
   */
  async registerWithOrganization(
    createUserDto: CreateUserDto,
    orgId: string,
    role = "user",
  ): Promise<{ accessToken: string }> {
    // Verify organization exists
    const org = await this.organizationRepository.findOne({
      where: { org_id: orgId },
    });

    if (!org) {
      throw new NotFoundException(`Organization not found`);
    }

    await this.register(createUserDto);
    const phoneNumberEntity = await this.userPhoneNumberRepository.findOne({
      where: { phone_number: createUserDto.phoneNumber },
    });

    if (!phoneNumberEntity) {
      throw new InternalServerErrorException(
        "Failed to create user phone number",
      );
    }

    const user = await this.userRepository.findOne({
      where: { user_id: phoneNumberEntity.user_id },
    });

    if (!user) {
      throw new InternalServerErrorException("Failed to find created user");
    }

    const userOrg = this.userOrganizationRepository.create({
      user_id: user.user_id,
      org_id: org.org_id,
      role,
      user: user,
      organization: org,
    });
    await this.userOrganizationRepository.save(userOrg);

    const token = await this.generateOrganizationToken(user, org);
    return { accessToken: token.access_token };
  }

  /**
   * Validate user with flexible identifier (email or phone)
   * @param identifier - Email or phone number
   * @param password - User password
   * @param orgId - Organization ID (optional)
   * @returns User entity and organization
   */
  async validateUserWithFlexibleIdentifier(
    identifier: string,
    password: string,
    orgId?: string,
  ): Promise<{ user: user; organization?: organization }> {
    // Find user by email or phone
    const user = await this.findUserByAnyIdentifier(identifier);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    if (user.provider && user.provider !== "manual") {
      throw new UnauthorizedException(
        `This account uses ${user.provider.toUpperCase()} authentication. Please use Single Sign-On to login.`,
      );
    }

    // Validate password - get user's password from database
    const userPassword = await this.userPasswordRepository.findOne({
      where: { user_id: user.user_id },
    });

    if (!userPassword) {
      throw new UnauthorizedException("No password set for this user");
    }

    const match = await bcrypt.compare(password, userPassword.password);
    if (!match) {
      throw new UnauthorizedException("Invalid password");
    }

    // If orgId is provided, verify user belongs to organization
    let organization: organization | undefined;
    if (orgId) {
      const userOrg = await this.userOrganizationRepository.findOne({
        where: { user_id: user.user_id, org_id: orgId },
        relations: ["organization"],
      });

      if (!userOrg) {
        throw new UnauthorizedException(
          "User not authorized for this organization",
        );
      }

      organization = userOrg.organization;
    }

    return { user, organization };
  }

  /**
   * Login with organization context (supports email OR phone)
   * @param identifier - User email or phone number
   * @param password - User password
   * @param orgDomain - Organization domain
   * @returns JWT token with organization context
   */
  async loginWithOrganization(
    identifier: string,
    password: string,
    orgDomain: string,
  ): Promise<{ access_token: string }> {
    const org = await this.findOrganizationByDomain(orgDomain);
    const { user } = await this.validateUserWithFlexibleIdentifier(
      identifier,
      password,
      org.org_id,
    );

    return await this.generateOrganizationToken(user, org);
  }

  /**
   * Find user by any identifier (email or phone)
   * @param identifier - Email or phone number
   * @returns User entity if found
   */
  async findUserByAnyIdentifier(identifier: string): Promise<user | null> {
    const userByEmail = await this.userEmailRepository.findOne({
      where: { email: identifier },
    });

    if (userByEmail) {
      return await this.userRepository.findOne({
        where: { user_id: userByEmail.user_id },
      });
    }

    const userByPhone = await this.userPhoneNumberRepository.findOne({
      where: { phone_number: identifier },
    });

    if (userByPhone) {
      return await this.userRepository.findOne({
        where: { user_id: userByPhone.user_id },
      });
    }

    return null;
  }

  /**
   * Ensure user has email record (for users who only had phone number)
   * @param userId - User ID
   * @param email - Email to add
   */
  private async ensureUserHasEmail(
    userId: string,
    email: string,
  ): Promise<void> {
    // First check if user already has any email record
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

  /**
   * Authenticate user via SSO and link to organization
   * @param ssoUser - SSO user profile
   * @returns Authentication result with JWT token
   */
  async authenticateWithSSO(ssoUser: SsoUser): Promise<SsoAuthResult> {
    let organization: organization | undefined;
    let user: user;
    let isNewUser = false;

    // Find organization based on SSO provider identifier
    if (ssoUser.organizationIdentifier) {
      organization = await this.findOrganizationBySsoIdentifier(
        ssoUser.organizationIdentifier,
        ssoUser.provider,
      );
    }

    // Find existing user by email OR phone (unified lookup)
    const existingUser = await this.findUserByAnyIdentifier(ssoUser.email);

    if (existingUser) {
      user = existingUser;

      // Update OAuth information
      await this.updateOrCreateOAuthRecord(user.user_id, ssoUser);

      // Ensure user has email record for SSO (if they only had phone before)
      await this.ensureUserHasEmail(user.user_id, ssoUser.email);
    } else {
      // Create new user
      isNewUser = true;
      user = await this.createUserFromSSO(ssoUser);
    }

    // Link user to organization if found and not already linked
    if (organization) {
      await this.linkUserToOrganization(user.user_id, organization.org_id);
    }

    // Generate JWT token with organization context
    const tokenResult = await this.generateOrganizationToken(
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
   * Find organization by SSO identifier (domain, tenant ID, etc.)
   * @param identifier - SSO identifier
   * @param provider - SSO provider type
   * @returns Organization entity
   */
  private async findOrganizationBySsoIdentifier(
    identifier: string,
    provider: string,
  ): Promise<organization | undefined> {
    // This is a simplified approach. In reality, you might store SSO configuration
    // in the organization entity and query based on that.
    const org = await this.organizationRepository
      .createQueryBuilder("org")
      .where("org.sso_provider = :provider", { provider })
      .andWhere("org.sso_config->>'identifier' = :identifier", { identifier })
      .getOne();

    return org ?? undefined;
  }

  /**
   * Create a new user from SSO profile
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
   * Update or create OAuth record for user
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
      // Update existing record
      oauthRecord.access_token =
        ssoUser.accessToken ?? oauthRecord.access_token;
      oauthRecord.refresh_token =
        ssoUser.refreshToken ?? oauthRecord.refresh_token;
      await this.userOauthRepository.save(oauthRecord);
    } else {
      // Create new record
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
   * Link user to organization
   * @param userId - User ID
   * @param orgId - Organization ID
   * @param role - User role (default: 'user')
   */
  private async linkUserToOrganization(
    userId: string,
    orgId: string,
    role = "user",
  ): Promise<void> {
    // Check if relationship already exists
    const existingLink = await this.userOrganizationRepository.findOne({
      where: { user_id: userId, org_id: orgId },
    });

    if (!existingLink) {
      // Get user and organization entities for proper relationships
      const user = await this.userRepository.findOne({
        where: { user_id: userId },
      });
      const organization = await this.organizationRepository.findOne({
        where: { org_id: orgId },
      });

      if (!user || !organization) {
        throw new Error("User or organization not found");
      }

      const userOrg = this.userOrganizationRepository.create({
        user_id: userId,
        org_id: orgId,
        role,
        user: user,
        organization: organization,
      });
      await this.userOrganizationRepository.save(userOrg);
    }
  }

  /**
   * Map SSO provider to AuthProvider enum
   * @param ssoProvider - SSO provider string
   * @returns AuthProvider enum value
   */
  private mapSsoProviderToAuthProvider(ssoProvider: string): AuthProvider {
    switch (ssoProvider) {
      case "azure-ad":
        return AuthProvider.MICROSOFT; // Assuming you have this in your enum
      case "google-workspace":
        return AuthProvider.GOOGLE; // Assuming you have this in your enum
      case "saml":
        return AuthProvider.SAML; // You might need to add this to your enum
      default:
        return AuthProvider.LINKEDIN; // Fallback
    }
  }

  /**
   * Get all users with basic information
   * @returns List of users with basic information
   */
  async getAllUsers(): Promise<Record<string, unknown>[]> {
    const users = await this.userRepository.find({
      select: [
        "user_id",
        "username",
        "provider",
        "profile_picture",
        "created_at",
      ],
      order: { created_at: "DESC" },
    });

    // Get additional information for each user
    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        const [email, phone, organizations] = await Promise.all([
          this.userEmailRepository.findOne({
            where: { user_id: user.user_id },
            select: ["email", "is_verified"],
          }),
          this.userPhoneNumberRepository.findOne({
            where: { user_id: user.user_id },
            select: ["phone_number", "is_verified"],
          }),
          this.userOrganizationRepository.find({
            where: { user_id: user.user_id },
            relations: ["organization"],
            select: ["role"],
          }),
        ]);

        return {
          user_id: user.user_id,
          username: user.username,
          provider: user.provider,
          profile_picture: user.profile_picture,
          created_at: user.created_at,
          email: email
            ? { email: email.email, is_verified: email.is_verified }
            : null,
          phone: phone
            ? {
                phone_number: phone.phone_number,
                is_verified: phone.is_verified,
              }
            : null,
          organizations: organizations.map((org) => ({
            role: org.role,
            organization: {
              org_id: org.organization.org_id,
              name: org.organization.name,
              domain: org.organization.domain,
            },
          })),
        };
      }),
    );

    return usersWithDetails;
  }

  /**
   * Get user by ID with detailed information
   * @param userId - User ID
   * @returns User with detailed information
   */
  async getUserById(userId: string): Promise<Record<string, unknown>> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const [email, phone, password, oauthRecords, organizations] =
      await Promise.all([
        this.userEmailRepository.findOne({
          where: { user_id: userId },
        }),
        this.userPhoneNumberRepository.findOne({
          where: { user_id: userId },
        }),
        this.userPasswordRepository.findOne({
          where: { user_id: userId },
          select: ["password_id"],
        }),
        this.userOauthRepository.find({
          where: { user_id: userId },
          select: ["oauth_id", "provider"],
        }),
        this.userOrganizationRepository.find({
          where: { user_id: userId },
          relations: ["organization"],
        }),
      ]);

    return {
      user_id: user.user_id,
      username: user.username,
      provider: user.provider,
      profile_picture: user.profile_picture,
      created_at: user.created_at,
      updated_at: user.updated_at,
      email: email
        ? {
            email_id: email.email_id,
            email: email.email,
            is_verified: email.is_verified,
          }
        : null,
      phone: phone
        ? {
            phone_number_id: phone.phone_number_id,
            phone_number: phone.phone_number,
            is_verified: phone.is_verified,
          }
        : null,
      has_password: !!password,
      password_info: password
        ? {
            password_id: password.password_id,
          }
        : null,
      oauth_accounts: oauthRecords.map((oauth) => ({
        oauth_id: oauth.oauth_id,
        provider: oauth.provider,
      })),
      organizations: organizations.map((userOrg) => ({
        role: userOrg.role,
        organization: {
          org_id: userOrg.organization.org_id,
          name: userOrg.organization.name,
          domain: userOrg.organization.domain,
          sso_provider: userOrg.organization.sso_provider,
        },
      })),
    };
  }
}
