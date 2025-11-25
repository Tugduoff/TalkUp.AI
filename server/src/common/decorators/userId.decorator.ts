import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const UserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => getUserIdFromContext(ctx),
);

// exported for testability
export function getUserIdFromContext(ctx: ExecutionContext) {
  const req = ctx.switchToHttp().getRequest();
  return req.userId as string | undefined;
}
