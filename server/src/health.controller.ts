import { Controller, Get } from "@nestjs/common";

@Controller()
export class HealthController {
  @Get()
  getHealth() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }

  @Get("health")
  checkHealth() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }
}
