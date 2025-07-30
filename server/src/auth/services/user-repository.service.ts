import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import {
  user,
  user_email,
  user_phone_number,
  user_oauth,
  user_password,
} from "@entities/user.entity";
import { UserOrganization } from "@entities/userOrganization.entity";

@Injectable()
export class UserRepositoryService {
  constructor(
    @InjectRepository(user) private userRepository: Repository<user>,
    @InjectRepository(user_email)
    private userEmailRepository: Repository<user_email>,
    @InjectRepository(user_phone_number)
    private userPhoneNumberRepository: Repository<user_phone_number>,
    @InjectRepository(user_oauth)
    private userOauthRepository: Repository<user_oauth>,
    @InjectRepository(user_password)
    private userPasswordRepository: Repository<user_password>,
    @InjectRepository(UserOrganization)
    private userOrganizationRepository: Repository<UserOrganization>,
  ) {}

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
