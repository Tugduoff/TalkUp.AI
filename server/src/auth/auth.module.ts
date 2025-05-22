import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

import { AuthController } from "./auth.controller";

import { AuthService } from "./auth.service";
import { PostValidationPipe } from "@common/pipes/PostValidationPipe";

import * as dotenv from "dotenv";
dotenv.config(); // Load environment variables

import {
  user,
  user_email,
  user_password,
  user_phonenumber,
} from "src/entities/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      user,
      user_email,
      user_password,
      user_phonenumber,
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "7d" }, // Token expiration time
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PostValidationPipe],
})
export class AuthModule {}
