import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";

import { AccessTokenGuard } from "@common/guards/accessToken.guard";

import { ai_interview } from "@entities/aiInterview.entity";
import { user } from "@entities/user.entity";
import { ai_transcript } from "@entities/aiTranscript.entity";

import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ai_interview, ai_transcript, user]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "7d" },
    }),
    HttpModule.register({
      timeout: 5000,
    }),
  ],
  providers: [AiService, AccessTokenGuard],
  controllers: [AiController],
})
export class AiModule {}
