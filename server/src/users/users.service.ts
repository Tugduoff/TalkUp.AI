import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { user } from "../entities/user.entity";
import { user_phone_number } from "../entities/user.entity";
import { user_password } from "../entities/user.entity";

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
}
