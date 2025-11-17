import { getUserIdFromContext } from "./userId.decorator";

describe("UserId decorator", () => {
  it("extracts userId from request", () => {
    const ctx = {
      switchToHttp: () => ({
        getRequest: () => ({ userId: "u-123" }),
      }),
    };

    // call the helper directly
    const res = getUserIdFromContext(ctx as any);
    expect(res).toBe("u-123");
  });
});
