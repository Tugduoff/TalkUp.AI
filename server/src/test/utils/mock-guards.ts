import { TestingModuleBuilder } from "@nestjs/testing";
import { AccessTokenGuard } from "@common/guards/accessToken.guard";

/**
 * Helper to override the AccessTokenGuard in unit tests so they don't need JwtService or DB repos.
 * Usage:
 *   const module = await applyMockAccessTokenGuard(Test.createTestingModule({...})).compile();
 */
export function applyMockAccessTokenGuard(
  moduleBuilder: TestingModuleBuilder | any,
) {
  return moduleBuilder.overrideGuard(AccessTokenGuard).useValue({
    canActivate: jest.fn(() => true),
  });
}

export default applyMockAccessTokenGuard;
