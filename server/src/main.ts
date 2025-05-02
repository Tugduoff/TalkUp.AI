import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.SERVER_PORT || 3000;

  app.setGlobalPrefix("v1/api");
  await app.listen(port);
  process.stdout.write(`Server is running on http://localhost:${port}\n`);
}
bootstrap();
