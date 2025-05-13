import { NestFactory } from "@nestjs/core";

import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from "@nestjs/swagger";

import { AppModule } from "./app.module";

// used for swagger
import { version } from "../package.json";

// dotenv
import * as dotenv from "dotenv";
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  const port = process.env.SERVER_PORT || 3000;

  app.setGlobalPrefix("v1/api");
  app.enableCors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: process.env.CORS_METHODS || "GET,PUT,PATCH,POST,DELETE",
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS || "Content-Type, Accept",
    exposedHeaders: process.env.CORS_EXPOSED_HEADERS || "Content-Type, Accept",
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle("TalkUp API")
    .setDescription("This is the API documentation of Talkup's backend")
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    .setVersion(version || "1.0.0")
    .build();

  const options: SwaggerCustomOptions = {
    useGlobalPrefix: true, // tells the UI path to use the global prefix.
  };

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, documentFactory, options); // the UI will be loacted in /v1/api/docs

  await app.listen(port);
  process.stdout.write(`Server is running on ${await app.getUrl()}\n`); // if '::1', it means localhost (IPv6 equivalent of 127.0.0.1)

  process.on("SIGINT", () => {
    process.stdout.write("\b\bServer is shutting down...\n"); // '\b\b' is used to remove the last two characters from the line (the Ctrl+C characters)

    (async () => {
      try {
        await app.close();
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        process.stdout.write(`Error shutting down server: ${error.message}\n`);
      } finally {
        process.exit(0);
      }
    })();
  });

  process.on("SIGUSR2", () => {
    process.stdout.write("\b\bServer is restarting...\n");

    (async () => {
      try {
        await app.close();
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        process.stdout.write(`Error restarting server: ${error.message}\n`);
      } finally {
        process.exit(0);
      }
    })();
  });
}
bootstrap();
