import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { user, user_phone_number, user_password } from "@entities/user.entity";
import { hashPassword } from "@common/utils/passwordHasher";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(user_phone_number)
    private phoneNumberRepo: Repository<user_phone_number>,

    @InjectRepository(user_password)
    private passwordRepo: Repository<user_password>,

    @InjectRepository(user)
    private userRepo: Repository<user>,
  ) {}

  /**
   * Finds a user and their password hash by phone number.
   *
   * @param phone_number - The phone number to search for.
   * @returns An object containing the user entity and password hash if found, or `null` if not found.
   *
   * @remarks
   * This method first retrieves the phone number entity, then fetches the corresponding user and password entities.
   * If any entity is missing, it returns `null`.
   */
  async findUserWithPasswordByPhoneNumber(phone_number: string): Promise<{
    user: user;
    passwordHash: string;
  } | null> {
    const phoneNumberEntity = await this.phoneNumberRepo.findOne({
      where: { phone_number },
    });

    if (!phoneNumberEntity) return null;

    const passwordEntity = await this.passwordRepo.findOne({
      where: { user_id: phoneNumberEntity.user_id },
    });

    const userEntity = await this.userRepo.findOne({
      where: { user_id: phoneNumberEntity.user_id },
    });

    if (!passwordEntity || !userEntity) return null;

    return {
      user: userEntity,
      passwordHash: passwordEntity.password,
    };
  }

  /**
   * Changes the password for a user identified by their phone number.
   *
   * This method first verifies the existence of a user with the given phone number.
   * If the user exists, it hashes the new password and updates or creates the password entity
   * associated with the user's ID. If no user is found, it throws an UnauthorizedException.
   *
   * @param phone_number - The phone number of the user whose password is to be changed.
   * @param newUserPassword - The new password to set for the user.
   * @returns A promise that resolves to `true` if the password was successfully changed.
   * @throws {UnauthorizedException} If no user exists with the provided phone number.
   */
  async changeUserPassword(
    phone_number: string,
    newUserPassword: string,
  ): Promise<boolean> {
    const phoneNumberEntity = await this.phoneNumberRepo.findOne({
      where: { phone_number },
    });

    if (!phoneNumberEntity) {
      throw new UnauthorizedException(
        "There is no user with that phone number",
      );
    }

    const hashedPassword = await hashPassword(newUserPassword);

    const passwordEntity = await this.passwordRepo.findOne({
      where: { user_id: phoneNumberEntity.user_id },
    });

    if (!passwordEntity) {
      const newUserPasswordEntity = this.passwordRepo.create({
        password: hashedPassword,
        user_id: phoneNumberEntity.user_id,
      });
      await this.passwordRepo.save(newUserPasswordEntity);
    } else {
      passwordEntity.password = hashedPassword;
      await this.passwordRepo.save(passwordEntity);
    }

    return true;
  }
}
