import { Controller, Get, Logger } from "@nestjs/common";

@Controller()
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  @Get()
  getHealth() {
    this.logger.log("Health check called");
    return { status: "ok", timestamp: new Date().toISOString() };
  }
}
