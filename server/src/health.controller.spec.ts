import { HealthController } from "./health.controller";

describe("HealthController", () => {
  it("returns status ok with timestamp", () => {
    const c = new HealthController();
    const res = c.getHealth();
    expect(res.status).toBe("ok");
    expect(typeof res.timestamp).toBe("string");
  });
});
