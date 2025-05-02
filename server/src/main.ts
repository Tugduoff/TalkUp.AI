import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.SERVER_PORT || 3000;

  app.setGlobalPrefix("v1/api");
  await app.listen(port);
  process.stdout.write(`Server is running on ${await app.getUrl()}\n`); // if '::1', it means localhost (IPv6 equivalent of 127.0.0.1)

  process.on("SIGINT", () => {
    process.stdout.write("\b\bServer is shutting down...\n"); // '\b\b' is used to remove the last two characters from the line (the Ctrl+C characters)
    app.close();
    process.exit(0);
  });

  process.on("SIGUSR2", () => {
    process.stdout.write("\b\bServer is restarting...\n");
    app.close();
    process.exit(0);
  });
}
bootstrap();
