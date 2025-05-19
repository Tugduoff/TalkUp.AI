import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

// logs all requests to the console after they are finished
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger("APP");

  use(req: Request, res: Response, next: NextFunction): void {
    const userAgent = req.get("user-agent") || "";

    res.on("finish", () => {
      const contentLength = res.get("content-length");

      this.logger.log(
        `${req.method} ${req.originalUrl} ${res.statusCode} ${contentLength} - ${userAgent} ${req.ip}`,
      );
    });

    next();
  }
}
