import { Param, ParseUUIDPipe } from "@nestjs/common";

/**
 * ParamId decorator factory
 * Usage: get id via @ParamId() id: string
 * This composes Nest's built-in @Param decorator with ParseUUIDPipe so that:
 * - Swagger/OpenAPI metadata is preserved (because @Param is used)
 * - The parameter is validated as a UUID at runtime
 */
export const ParamId = (name = "id") => Param(name, new ParseUUIDPipe());
