import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { AuthService } from "../auth.service";
import { SsoUser } from "../interfaces/sso-user.interface";

export interface GoogleProfile {
  id: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  emails: {
    value: string;
    verified: boolean;
  }[];
  photos: {
    value: string;
  }[];
  provider: string;
  _json: {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    locale?: string;
    hd?: string; // Hosted domain (for Google Workspace)
  };
}

@Injectable()
export class GoogleWorkspaceStrategy extends PassportStrategy(
  Strategy,
  "google-workspace",
) {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ??
        "http://localhost:3000/auth/google/callback",
      scope: ["email", "profile"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ): Promise<void> {
    const { id, displayName, emails, photos, _json } = profile;

    const email = emails?.[0]?.value || _json.email;
    const firstName = _json.given_name || "";
    const lastName = _json.family_name || "";
    const _picture = photos?.[0]?.value || _json.picture;
    const hostedDomain = _json.hd; // Google Workspace domain

    // Validate hosted domain if required
    if (
      process.env.GOOGLE_WORKSPACE_DOMAIN &&
      hostedDomain !== process.env.GOOGLE_WORKSPACE_DOMAIN
    ) {
      return done(
        new Error("User is not from the required Google Workspace domain"),
        false,
      );
    }

    const ssoUser: SsoUser = {
      email,
      firstName,
      lastName,
      displayName,
      provider: "google-workspace",
      externalId: id,
      organizationIdentifier: hostedDomain, // Use hosted domain to identify organization
      accessToken,
      refreshToken,
    };

    try {
      // Authenticate user via SSO and get organization context
      const authResult = await this.authService.authenticateWithSSO(ssoUser);
      done(null, authResult);
    } catch (error) {
      done(error, false);
    }
  }
}
