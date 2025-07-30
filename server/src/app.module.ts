import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import pgConfig from "@config/postgres.config";

import { AuthModule } from "./auth/auth.module";
import { OrganizationModule } from "./organization/organization.module";

import { LoggerMiddleware } from "@common/middleware/logger";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [pgConfig],
    }),
    AuthModule,
    OrganizationModule,
    TypeOrmModule.forRootAsync({
      useFactory: pgConfig,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*path");
  }
}
