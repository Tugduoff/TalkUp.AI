import {
  UnauthorizedException,
  InternalServerErrorException,
} from "@nestjs/common";

import { AccessTokenGuard } from "./accessToken.guard";

describe("AccessTokenGuard (unit)", () => {
  let guard: any;
  let mockJwt: any;
  let mockRepo: any;

  const makeContext = (headers: any, reqObj = {}) => ({
    switchToHttp: () => ({
      getRequest: () => ({ headers, ...reqObj }),
    }),
  });

  beforeEach(() => {
    mockJwt = { verifyAsync: jest.fn() };
    mockRepo = { findOne: jest.fn() };

    // construct with mocks
    // @ts-ignore
    guard = new AccessTokenGuard(mockJwt, mockRepo);
  });

  it("throws when header missing", async () => {
    await expect(guard.canActivate(makeContext({}))).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it("throws when header malformed", async () => {
    await expect(
      guard.canActivate(makeContext({ authorization: "Bad token" })),
    ).rejects.toThrow(UnauthorizedException);
  });

  it("throws when jwt verify fails", async () => {
    mockJwt.verifyAsync.mockRejectedValueOnce(new Error("nope"));
    await expect(
      guard.canActivate(makeContext({ authorization: "Bearer token" })),
    ).rejects.toThrow(UnauthorizedException);
  });

  it("throws when payload missing userId", async () => {
    mockJwt.verifyAsync.mockResolvedValueOnce({});
    await expect(
      guard.canActivate(makeContext({ authorization: "Bearer token" })),
    ).rejects.toThrow(UnauthorizedException);
  });

  it("throws InternalServerError when repo throws", async () => {
    mockJwt.verifyAsync.mockResolvedValueOnce({ userId: "u1" });
    mockRepo.findOne.mockRejectedValueOnce(new Error("repo error"));

    await expect(
      guard.canActivate(makeContext({ authorization: "Bearer token" })),
    ).rejects.toThrow(InternalServerErrorException);
  });

  it("throws when user not found", async () => {
    mockJwt.verifyAsync.mockResolvedValueOnce({ userId: "u1" });
    mockRepo.findOne.mockResolvedValueOnce(null);

    await expect(
      guard.canActivate(makeContext({ authorization: "Bearer token" })),
    ).rejects.toThrow(UnauthorizedException);
  });

  it("returns true and sets req.userId when ok", async () => {
    mockJwt.verifyAsync.mockResolvedValueOnce({ userId: "u1" });
    const reqObj = { headers: { authorization: "Bearer token" }, userId: null };
    mockRepo.findOne.mockResolvedValueOnce({ user_id: "u1" });

    const ctx = {
      switchToHttp: () => ({ getRequest: () => reqObj }),
    };

    const res = await guard.canActivate(ctx);
    expect(res).toBe(true);
    expect(reqObj.userId).toBe("u1");
  });
});
