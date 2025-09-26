import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import pgConfig from "@config/postgres.config";

import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { LinkedInModule } from "./modules/linkedin/linkedin.module";

import { LoggerMiddleware } from "@common/middleware/logger";
import { PostValidationPipe } from "@common/pipes/PostValidationPipe";

// sockets
import { TestWebSocketGateway } from "./sockets/testSockets.gateway";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [pgConfig],
    }),
    AuthModule,
    UsersModule,
    LinkedInModule,
    TypeOrmModule.forRootAsync({
      useFactory: pgConfig,
    }),
  ],
  controllers: [],
  providers: [PostValidationPipe, TestWebSocketGateway],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*path");
  }
}
