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
import { SsoUser, SsoAuthResult } from "./interfaces/sso-user.interface";
import { LinkedInOAuthService } from "./services/linkedin-oauth.service";
import { OrganizationService } from "../organization/organization.service";
import { SSOAuthenticationService } from "./services/sso-authentication.service";
import { UserRepositoryService } from "./services/user-repository.service";
import { TokenService } from "./services/token.service";

@Injectable()
export class AuthService {
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
    private linkedInOAuthService: LinkedInOAuthService,
    private organizationService: OrganizationService,
    private ssoAuthenticationService: SSOAuthenticationService,
    private userRepositoryService: UserRepositoryService,
    private tokenService: TokenService,
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
    return this.tokenService.login(user);
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
    return this.linkedInOAuthService.getAccessTokenDatasFromQueryCode(code);
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
    return this.linkedInOAuthService.getLinkedInProfileFromAccessToken(
      accessToken,
    );
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
    return this.linkedInOAuthService.saveTokenDataFromUser(userId, tokenData);
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
    return this.linkedInOAuthService.saveLinkedInUser(
      linkedInProfile,
      tokenData,
    );
  }

  /**
   * Find organization by domain for SSO authentication
   * @param domain - Organization domain
   * @returns Organization entity
   */
  async findOrganizationByDomain(domain: string): Promise<organization> {
    return this.organizationService.findOrganizationByDomain(domain);
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
      const userOrg =
        await this.organizationService.getUserOrganizationRelation(
          result.user.user_id,
          orgId,
        );

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
    return this.tokenService.generateOrganizationToken(user, organization);
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
    const org = await this.organizationService.findOrganizationById(orgId);

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
    const user =
      await this.userRepositoryService.findUserByAnyIdentifier(identifier);
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
      const userOrg =
        await this.organizationService.getUserOrganizationRelation(
          user.user_id,
          orgId,
        );

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

    return await this.tokenService.generateOrganizationToken(user, org);
  }

  /**
   * Authenticate user via SSO and link to organization
   * @param ssoUser - SSO user profile
   * @returns Authentication result with JWT token
   */
  async authenticateWithSSO(ssoUser: SsoUser): Promise<SsoAuthResult> {
    return this.ssoAuthenticationService.authenticateWithSSO(
      ssoUser,
      (identifier) =>
        this.userRepositoryService.findUserByAnyIdentifier(identifier),
      (user, organization) =>
        this.generateOrganizationToken(user, organization),
    );
  }

  /**
   * Get all users with basic information
   * @returns List of users with basic information
   */
  async getAllUsers(): Promise<Record<string, unknown>[]> {
    return this.userRepositoryService.getAllUsers();
  }

  /**
   * Get user by ID with detailed information
   * @param userId - User ID
   * @returns User with detailed information
   */
  async getUserById(userId: string): Promise<Record<string, unknown>> {
    return this.userRepositoryService.getUserById(userId);
  }
}
