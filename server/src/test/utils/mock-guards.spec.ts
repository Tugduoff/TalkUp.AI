import applyMockAccessTokenGuard from "./mock-guards";

describe("applyMockAccessTokenGuard helper", () => {
  it("calls overrideGuard and returns builder", () => {
    const called = { override: false, use: false, invoked: false };
    const fakeBuilder = {
      overrideGuard: () => {
        called.override = true;
        return {
          useValue: (val: { canActivate: () => boolean }) => {
            called.use = true;
            // call the provided canActivate so the jest.fn produced is executed
            if (val && typeof val.canActivate === "function") {
              const r = val.canActivate();
              called.invoked = r === true;
            }
            return fakeBuilder;
          },
        };
      },
    };

    const res = applyMockAccessTokenGuard(fakeBuilder);
    expect(called.override).toBe(true);
    expect(called.use).toBe(true);
    expect(called.invoked).toBe(true);
    expect(res).toBe(fakeBuilder);
  });
});
