/**
 * Interface representing the JWT payload structure.
 * This interface defines the expected properties of the JWT payload
 * used in the authentication process.
 */
export interface JwtPayload {
  sub: string; // user_id
  email?: string;
  username?: string;
  org_id?: string;
  org_domain?: string;
  org_role?: string;
  iat?: number;
  exp?: number;
}
