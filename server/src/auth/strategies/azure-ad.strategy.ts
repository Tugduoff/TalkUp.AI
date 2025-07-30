import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { BearerStrategy } from "passport-azure-ad";
import { AuthService } from "../auth.service";
import { SsoUser, SsoAuthResult } from "../interfaces/sso-user.interface";

export interface AzureAdProfile {
  oid: string; // Object ID in Azure AD
  sub: string; // Subject
  email?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  unique_name?: string;
  upn?: string; // User Principal Name
  tid: string; // Tenant ID
  iss: string; // Issuer
  [key: string]: string | number | boolean | undefined;
}

@Injectable()
export class AzureAdStrategy extends PassportStrategy(
  BearerStrategy,
  "azure-ad",
) {
  constructor(private authService: AuthService) {
    super({
      identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID ?? "common"}/v2.0/.well-known/openid_configuration`,
      clientID: process.env.AZURE_AD_CLIENT_ID ?? "",
      audience: process.env.AZURE_AD_CLIENT_ID ?? "", // Same as client ID for most cases
      validateIssuer: true,
      passReqToCallback: false,
      loggingLevel: "info",
      scope: ["openid", "profile", "email"],
    });
  }

  async validate(profile: AzureAdProfile): Promise<SsoAuthResult> {
    // Extract user information from Azure AD profile
    const email = profile.email ?? profile.unique_name ?? profile.upn;
    const firstName = profile.given_name ?? "";
    const lastName = profile.family_name ?? "";
    const displayName =
      profile.name ??
      `${firstName} ${lastName}`.trim() ??
      email ??
      "Unknown User";

    if (!email) {
      throw new Error("Email is required for authentication");
    }

    const ssoUser: SsoUser = {
      email,
      firstName,
      lastName,
      displayName,
      provider: "azure-ad",
      externalId: profile.oid,
      organizationIdentifier: profile.tid, // Use tenant ID to identify organization
    };

    // Authenticate user via SSO and get organization context
    const authResult = await this.authService.authenticateWithSSO(ssoUser);

    return authResult;
  }
}
