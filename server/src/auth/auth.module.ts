import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthController } from "./auth.controller";

import { AuthService } from "./auth.service";

import { user } from "src/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([user])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
