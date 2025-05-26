import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { user, user_phonenumber, user_password } from "../entities/user.entity";
import { UsersService } from "./users.service";

@Module({
  imports: [TypeOrmModule.forFeature([user, user_phonenumber, user_password])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
