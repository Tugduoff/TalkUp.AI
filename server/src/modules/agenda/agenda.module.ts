import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

import { agenda_event } from "@entities/agenda.entity";
import { AccessTokenGuard } from "@common/guards/accessToken.guard";
import { user } from "@entities/user.entity";

import { AgendaService } from "./agenda.service";
import { AgendaController } from "./agenda.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([agenda_event, user]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "7d" },
    }),
  ],
  controllers: [AgendaController],
  providers: [AgendaService, AccessTokenGuard],
  exports: [AgendaService],
})
export class AgendaModule {}
