import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./auth.controller";

import { AuthService } from "./auth.service";
import { UsersModule } from "@src/users/users.module";
import { PostValidationPipe } from "@common/pipes/PostValidationPipe";

import * as dotenv from "dotenv";
dotenv.config(); // Load environment variables

import {
  user,
  user_email,
  user_password,
  user_phone_number,
} from "src/entities/user.entity";

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([
      user,
      user_email,
      user_password,
      user_phone_number,
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "7d" }, // Token expiration time
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PostValidationPipe],
  exports: [AuthService],
})
export class AuthModule {}
