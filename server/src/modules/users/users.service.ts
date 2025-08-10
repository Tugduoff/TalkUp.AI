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
