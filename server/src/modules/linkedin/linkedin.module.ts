import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { HttpModule } from "@nestjs/axios";

import { LinkedInController } from "./linkedin.controller";
import { LinkedInService } from "./linkedin.service";

import { user, user_email, user_oauth } from "@entities/user.entity";

import * as dotenv from "dotenv";
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([user, user_email, user_oauth]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "7d" },
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [LinkedInController],
  providers: [LinkedInService],
  exports: [LinkedInService],
})
export class LinkedInModule {}
