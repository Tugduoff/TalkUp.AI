import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { user, user_phone_number, user_password } from "@entities/user.entity";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";

@Module({
  imports: [TypeOrmModule.forFeature([user, user_phone_number, user_password])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
