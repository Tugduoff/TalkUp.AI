import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { LoggerMiddleware } from "./common/utils/logger";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
