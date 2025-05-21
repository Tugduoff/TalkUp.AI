import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { user, user_email, user_password } from "../entities/user.entity";
import { UsersService } from "./users.service";

@Module({
  imports: [TypeOrmModule.forFeature([user, user_email, user_password])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
