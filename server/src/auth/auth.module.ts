import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

import { HttpModule } from "@nestjs/axios";

import { AuthController } from "./auth.controller";

import { AuthService } from "./auth.service";
import { UsersModule } from "@src/users/users.module";
import { PostValidationPipe } from "@common/pipes/PostValidationPipe";

import * as dotenv from "dotenv";
dotenv.config(); // Load environment variables

import {
  user,
  user_email,
  user_oauth,
  user_password,
  user_phone_number,
} from "src/entities/user.entity";
import { organization } from "src/entities/organization.entity";
import { UserOrganization } from "src/entities/userOrganization.entity";
import { AzureAdStrategy } from "./strategies/azure-ad.strategy";
import { GoogleWorkspaceStrategy } from "./strategies/google-workspace.strategy";
import { SamlStrategy } from "./strategies/saml.strategy";
import { LinkedInOAuthService } from "./services/linkedin-oauth.service";
import { SSOAuthenticationService } from "./services/sso-authentication.service";
import { UserRepositoryService } from "./services/user-repository.service";
import { TokenService } from "./services/token.service";
import { OrganizationModule } from "../organization/organization.module";

@Module({
  imports: [
    UsersModule,
    OrganizationModule,
    TypeOrmModule.forFeature([
      user,
      user_email,
      user_password,
      user_phone_number,
      user_oauth,
      organization,
      UserOrganization,
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "7d" }, // Token expiration time
    }),

    // Configure HTTP module to make external requests
    HttpModule.register({
      timeout: 5000, // timeout for HTTP requests
      maxRedirects: 5, // maximum number of redirects
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PostValidationPipe,
    AzureAdStrategy,
    GoogleWorkspaceStrategy,
    SamlStrategy,
    LinkedInOAuthService,
    SSOAuthenticationService,
    UserRepositoryService,
    TokenService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
