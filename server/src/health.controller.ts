import { Controller, Get, Logger } from "@nestjs/common";

@Controller()
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  @Get()
  getHealth() {
    this.logger.log("Health check called on root endpoint");
    return { status: "ok", timestamp: new Date().toISOString() };
  }

  @Get("health")
  checkHealth() {
    this.logger.log("Health check called on /health endpoint");
    return { status: "ok", timestamp: new Date().toISOString() };
  }
}
