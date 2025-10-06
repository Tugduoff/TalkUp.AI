import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";

import { AppModule } from "./app.module";

import initSwagger from "@config/swagger.config";

// dotenv
import * as dotenv from "dotenv";
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  const port = process.env.PORT ?? process.env.SERVER_PORT ?? 3000;

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix("v1/api");

  const corsOrigin = process.env.CORS_ORIGIN;
  const allowedOrigins =
    corsOrigin === "*" ? null : (corsOrigin?.split(",") ?? []);

  app.enableCors({
    origin: (
      origin: string,
      callback: (arg0: Error | null, arg1: boolean | undefined) => void,
    ) => {
      console.log("Request origin:", origin);
      if (!origin) return callback(null, true);

      if (corsOrigin === "*") return callback(null, true);

      if (allowedOrigins?.includes(origin)) return callback(null, true);

      if (origin.includes("talk-up-ai") && origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      if (origin.includes("localhost")) return callback(null, true);

      callback(new Error("Not allowed by CORS"), false);
    },
    methods: process.env.CORS_METHODS ?? "GET,PUT,PATCH,POST,DELETE",
    allowedHeaders:
      process.env.CORS_ALLOWED_HEADERS ?? "Content-Type,Accept,Authorization",
    exposedHeaders:
      process.env.CORS_EXPOSED_HEADERS ?? "Content-Type,Accept,Authorization",
    credentials: true,
  });

  initSwagger(app);

  // Listen on 0.0.0.0 to accept external connections (Railway requirement)
  await app.listen(port, '0.0.0.0');
  process.stdout.write(`Server is running on http://0.0.0.0:${port}\n`);

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
