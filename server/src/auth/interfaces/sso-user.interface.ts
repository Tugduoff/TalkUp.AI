import { user } from "../../entities/user.entity";
import { organization } from "../../entities/organization.entity";

export interface SsoUser {
  email: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
  provider: "saml" | "azure-ad" | "google-workspace";
  externalId: string; // Provider-specific user ID
  organizationIdentifier?: string; // Domain, tenant ID, etc.
  accessToken?: string;
  refreshToken?: string;
}

export interface SsoAuthResult {
  user: user; // Your user entity
  organization?: organization; // Your organization entity
  isNewUser: boolean;
  accessToken: string;
}
