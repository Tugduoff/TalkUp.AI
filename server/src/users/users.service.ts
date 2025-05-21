import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { user } from "../entities/user.entity";
import { user_email } from "../entities/user.entity";
import { user_password } from "../entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(user_email)
    private emailRepo: Repository<user_email>,

    @InjectRepository(user_password)
    private passwordRepo: Repository<user_password>,

    @InjectRepository(user)
    private userRepo: Repository<user>,
  ) {}

  async findUserWithPasswordByEmail(email: string): Promise<{
    user: user;
    passwordHash: string;
  } | null> {
    const emailEntity = await this.emailRepo.findOne({
      where: { email },
    });

    if (!emailEntity) return null;

    const passwordEntity = await this.passwordRepo.findOne({
      where: { user_id: emailEntity.user_id },
    });

    const userEntity = await this.userRepo.findOne({
      where: { user_id: emailEntity.user_id },
    });

    if (!passwordEntity || !userEntity) return null;

    return {
      user: userEntity,
      passwordHash: passwordEntity.password,
    };
  }
}
