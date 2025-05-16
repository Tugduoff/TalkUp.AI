import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from "@nestjs/swagger";

import { INestApplication } from "@nestjs/common";

// used for swagger
import { version } from "../../package.json";

export default function initSwagger(app: INestApplication) {
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle("TalkUp API")
    .setDescription("This is the API documentation of Talkup's backend")
    .setVersion(version || "1.0.0")
    .addGlobalResponse({
      status: 500,
      description: "Internal server error",
    })
    .addGlobalResponse({
      status: 401,
      description: "Unauthorized",
    })
    .addGlobalResponse({
      status: 403,
      description: "Forbidden",
    })
    .build();

  const options: SwaggerCustomOptions = {
    useGlobalPrefix: true, // tells the UI path to use the global prefix.
  };

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, documentFactory, options); // the UI will be loacted in /v1/api/docs
}
