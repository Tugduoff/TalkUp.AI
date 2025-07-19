/**
 * Interface representing the structure of a LinkedIn profile.
 * This interface defines the properties that are expected in the LinkedIn profile
 * response after a successful LinkedIn OAuth 2.0 authentication flow.
 */
export interface LinkedInProfile {
  sub: string;
  email_verified: boolean;
  name: string;
  locale: { country: string; language: string };
  given_name: string;
  family_name: string;
  email: string;
  picture: string;
}

/**
 * Interface representing the structure of LinkedIn token data.
 * This interface defines the properties that are expected in the token response
 * from LinkedIn's OAuth 2.0 authentication flow.
 */
export interface LinkedInTokenDatas {
  access_token: string;
  expires_in: string;
  scope: string;
  refresh_token?: string;
  refresh_token_expires_in?: string;
  token_type?: string;
  id_token?: string;
}
