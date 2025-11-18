import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { user, user_password, user_email } from "@entities/user.entity";
import { hashPassword } from "@common/utils/passwordHasher";

@Injectable()
export class UsersService {
  private readonly logger: Logger;

  constructor(
    @InjectRepository(user_email)
    private emailRepo: Repository<user_email>,

    @InjectRepository(user_password)
    private passwordRepo: Repository<user_password>,
  ) {
    this.logger = new Logger(UsersService.name);
  }

  /**
   * Changes the password for a user identified by their email address.
   *
   * This method first verifies the existence of a user with the given email address.
   * If the user exists, it hashes the new password and updates or creates the password entity
   * associated with the user's ID. If no user is found, it throws an UnauthorizedException.
   *
   * @param email - The email address of the user whose password is to be changed.
   * @param newUserPassword - The new password to set for the user.
   * @returns A promise that resolves to `true` if the password was successfully changed.
   * @throws {NotFoundException} If no user exists with the provided email address.
   */
  async changeUserPassword(
    email: string,
    newUserPassword: string,
  ): Promise<boolean> {
    try {
      const emailEntity = await this.emailRepo.findOne({
        where: { email },
      });

      if (!emailEntity) {
        throw new NotFoundException("There is no user with that email");
      }

      const hashedPassword = await hashPassword(newUserPassword);

      const passwordEntity = await this.passwordRepo.findOne({
        where: { user_id: emailEntity.user_id },
      });

      if (!passwordEntity) {
        const newUserPasswordEntity = this.passwordRepo.create({
          password: hashedPassword,
          user_id: emailEntity.user_id,
        });
        await this.passwordRepo.save(newUserPasswordEntity);
      } else {
        passwordEntity.password = hashedPassword;
        await this.passwordRepo.save(passwordEntity);
      }
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to change password for email ${email}: ${error.message}`,
      );
      throw new InternalServerErrorException(
        "Internal server error while changing password.",
      );
    }
  }
}
