import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-saml";
import { AuthService } from "../auth.service";
import { SsoUser, SsoAuthResult } from "../interfaces/sso-user.interface";

export interface SamlProfile {
  issuer: string;
  nameID: string;
  nameIDFormat: string;
  nameQualifier?: string;
  spNameQualifier?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  [key: string]: string | number | boolean | undefined;
}

@Injectable()
export class SamlStrategy extends PassportStrategy(Strategy, "saml") {
  constructor(private authService: AuthService) {
    super({
      callbackUrl:
        process.env.SAML_CALLBACK_URL ??
        "http://localhost:3000/auth/saml/callback",
      entryPoint:
        process.env.SAML_ENTRY_POINT ?? "https://sso.company.com/saml/sso",
      issuer: process.env.SAML_ISSUER ?? "talkup-ai",
      cert: process.env.SAML_CERT ?? "",
      identifierFormat:
        "urn:oasis:names:tc:SAML:2.0:nameid-format:emailAddress",
    });
  }

  async validate(profile: SamlProfile): Promise<SsoAuthResult> {
    // Extract user information from SAML profile
    const email = profile.email ?? profile.nameID;
    const firstName = profile.firstName ?? "";
    const lastName = profile.lastName ?? "";
    const displayName =
      profile.displayName ?? `${firstName} ${lastName}`.trim() ?? email;

    const ssoUser: SsoUser = {
      email,
      firstName,
      lastName,
      displayName,
      provider: "saml",
      externalId: profile.nameID,
      organizationIdentifier: profile.issuer, // Use SAML issuer to identify organization
    };

    // Authenticate user via SSO and get organization context
    const authResult = await this.authService.authenticateWithSSO(ssoUser);

    return authResult;
  }
}
