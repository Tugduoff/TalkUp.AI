import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Res,
  Param,
} from "@nestjs/common";
import { Response } from "express";
import { UsePipes } from "@nestjs/common/decorators/core/use-pipes.decorator";

import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
  ApiTags,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from "@nestjs/swagger";

import { CreateUserDto } from "./dto/createUser.dto";
import { LoginDto } from "./dto/login.dto";
import { UpdatePasswordDto } from "./dto/updatePassword.dto";
import { OrgLoginDto } from "./dto/orgLogin.dto";
import { OrgRegisterDto } from "./dto/orgRegister.dto";

import { PostValidationPipe } from "@common/pipes/PostValidationPipe";

import { AuthService } from "./auth.service";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({
    description: "The user has been successfully created.",
    type: CreateUserDto,
  })
  @ApiBadRequestResponse({
    description: "Badly formatted parameter.",
  })
  @ApiConflictResponse({
    description: "User already exists.",
  })
  @ApiUnprocessableEntityResponse({
    description: "Missing parameter in request.",
  })
  @ApiOperation({
    summary: "Register new user",
    description:
      "Create a new user account with username, phone number, and password. Phone number must be unique.",
  })
  @UsePipes(new PostValidationPipe())
  @Post("register")
  async register(@Body() createUserDto: CreateUserDto) {
    // Call the authService to handle the registration logic
    return await this.authService.register(createUserDto);
  }

  @ApiOkResponse({
    description: "User successfully logged in.",
    type: String,
  })
  @ApiOperation({
    summary: "User login",
    description:
      "Authenticate user with phone number and password. Returns JWT token on successful authentication.",
  })
  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.phoneNumber,
      loginDto.password,
    );
    return this.authService.login(user);
  }

  @ApiOkResponse({
    description: "The password has successfully changed",
    type: String,
  })
  @ApiOperation({
    summary: "Update user password",
    description:
      "Change user's password by providing phone number and new password. Creates password if user doesn't have one.",
  })
  @Put("updatePassword")
  async updatePassword(@Body() body: UpdatePasswordDto) {
    return this.authService.changeUserPassword(
      body.phoneNumber,
      body.newPassword,
    );
  }

  @ApiOkResponse({
    description: "Redirects to LinkedIn for OAuth authentication.",
    type: String,
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error (problem fetching code).",
  })
  @ApiOperation({
    summary: "LinkedIn OAuth callback",
    description:
      "Handle LinkedIn OAuth callback, process access token, create/login user, and redirect to frontend with JWT token.",
  })
  @Get("linkedin/callback")
  async linkedInCallback(@Query("code") code: string, @Res() res: Response) {
    const tokenData: {
      access_token: string;
      expires_in: string;
      scope: string;
    } = await this.authService.getAccessTokenDatasFromQueryCode(code);

    const profile = await this.authService.getLinkedInProfileFromAccessToken(
      tokenData.access_token,
    );

    const data: { accessToken: string } =
      await this.authService.saveLinkedInUser(profile, tokenData);

    res.redirect(
      `${process.env.FRONTEND_URL}/linkedin-oauth-test.html?token=${data.accessToken}`,
    );
  }

  @ApiOkResponse({
    description:
      "User successfully authenticated with organization context. Returns JWT token with organization information.",
    schema: {
      type: "object",
      properties: {
        access_token: {
          type: "string",
          description: "JWT token containing user and organization information",
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description:
      "Authentication failed - invalid credentials, user not found, or user not authorized for this organization",
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          examples: [
            "User not found",
            "Invalid password",
            "This account uses SAML authentication. Please use Single Sign-On to login.",
            "User not authorized for this organization",
          ],
        },
        error: { type: "string", example: "Unauthorized" },
        statusCode: { type: "number", example: 401 },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Organization domain not found",
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "Organization with domain company.com not found",
        },
        error: { type: "string", example: "Not Found" },
        statusCode: { type: "number", example: 404 },
      },
    },
  })
  @ApiOperation({
    summary: "Organization-scoped user login",
    description:
      "Authenticate a user within a specific organization context. Supports both email and phone number identifiers. Returns a JWT token with organization context.",
  })
  @Post("org/login")
  async loginWithOrganization(@Body() orgLoginDto: OrgLoginDto) {
    return this.authService.loginWithOrganization(
      orgLoginDto.identifier,
      orgLoginDto.password,
      orgLoginDto.orgDomain,
    );
  }

  @ApiCreatedResponse({
    description:
      "User successfully registered and linked to organization. Returns JWT token with organization context.",
    schema: {
      type: "object",
      properties: {
        accessToken: {
          type: "string",
          description: "JWT token containing user and organization information",
          example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        },
      },
    },
  })
  @ApiConflictResponse({
    description: "Registration failed - phone number already exists",
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example: "An account with this phone number already exists",
        },
        error: { type: "string", example: "Conflict" },
        statusCode: { type: "number", example: 409 },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Organization not found",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Organization not found" },
        error: { type: "string", example: "Not Found" },
        statusCode: { type: "number", example: 404 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: "Invalid input data - validation failed",
    schema: {
      type: "object",
      properties: {
        message: {
          type: "array",
          items: { type: "string" },
          example: [
            "phoneNumber must be a valid phone number",
            "password is not strong enough",
          ],
        },
        error: { type: "string", example: "Bad Request" },
        statusCode: { type: "number", example: 400 },
      },
    },
  })
  @ApiOperation({
    summary: "Register user with organization",
    description:
      "Create a new user account and associate it with a specific organization. The user will be automatically linked to the organization with the specified role.",
  })
  @Post("org/register")
  async registerWithOrganization(@Body() orgRegisterDto: OrgRegisterDto) {
    return this.authService.registerWithOrganization(
      orgRegisterDto,
      orgRegisterDto.orgId,
      orgRegisterDto.role,
    );
  }

  @ApiOkResponse({
    description: "Successfully redirects to SSO provider for authentication",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Redirecting to SSO provider..." },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "Organization not found or SSO not configured",
    schema: {
      type: "object",
      properties: {
        error: {
          type: "string",
          example: "Organization not found or SSO not configured",
        },
      },
    },
  })
  @ApiOperation({
    summary: "Initiate SSO authentication",
    description:
      "Initiates Single Sign-On authentication for a specific organization. Redirects to the appropriate SSO provider (SAML, Azure AD, or Google Workspace) based on organization configuration.",
  })
  @Get("sso/:orgDomain/initiate")
  async initiateSsoAuth(
    @Param("orgDomain") orgDomain: string,
    @Query("provider") _provider: string,
    @Res() res: Response,
  ) {
    const org = await this.authService.findOrganizationByDomain(orgDomain);

    if (!org?.sso_provider) {
      return res.status(404).json({
        error: "Organization not found or SSO not configured",
      });
    }
    switch (org.sso_provider) {
      case "saml":
        return res.redirect(`/v1/api/auth/saml/login?orgDomain=${orgDomain}`);
      case "azure-ad":
        return res.redirect(
          `/v1/api/auth/azure-ad/login?orgDomain=${orgDomain}`,
        );
      case "google-workspace":
        return res.redirect(`/v1/api/auth/google/login?orgDomain=${orgDomain}`);
      default:
        return res.status(400).json({
          error: "Unsupported SSO provider",
        });
    }
  }

  @ApiOkResponse({
    description: "Handles SSO callback for organization.",
    type: String,
  })
  @ApiOperation({
    summary: "Handle SSO callback",
    description:
      "Process SSO authentication callback from identity provider and redirect user to organization dashboard.",
  })
  @Get("sso/:orgDomain/callback")
  handleSsoCallback(
    @Param("orgDomain") orgDomain: string,
    @Query() _query: Record<string, unknown>,
    @Res() res: Response,
  ) {
    const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:8080";
    return res.redirect(`${frontendUrl}/org/${orgDomain}/dashboard`);
  }

  @ApiOkResponse({
    description: "Returns SSO metadata for organization.",
    type: String,
  })
  @ApiOperation({
    summary: "Get SSO metadata",
    description:
      "Retrieve SSO configuration metadata for an organization, including provider type and configuration details.",
  })
  @Post("sso/:orgDomain/metadata")
  async getSsoMetadata(
    @Param("orgDomain") orgDomain: string,
    @Body() _metadata: Record<string, unknown>,
  ) {
    const org = await this.authService.findOrganizationByDomain(orgDomain);

    if (!org) {
      throw new Error("Organization not found");
    }

    return {
      orgDomain,
      ssoProvider: org.sso_provider,
      ssoConfig: org.sso_config,
    };
  }

  // SAML Strategy Routes
  @Get("saml/login")
  @ApiOperation({ summary: "Initiate SAML authentication" })
  @ApiOkResponse({ description: "SAML authentication initiated successfully" })
  async samlLogin(@Query("orgDomain") orgDomain: string, @Res() res: Response) {
    if (!orgDomain) {
      return res.status(400).json({ error: "Organization domain is required" });
    }

    try {
      // Find organization to validate SAML is configured
      const org = await this.authService.findOrganizationByDomain(orgDomain);

      if (!org || org.sso_provider !== "saml") {
        return res.status(400).json({
          error: "SAML authentication not configured for this organization",
        });
      }

      return res.json({
        message: `SAML authentication would be initiated for ${orgDomain}`,
        redirectUrl: `https://sso.${orgDomain}/saml/sso`,
        callbackUrl: `${process.env.FRONTEND_URL ?? "http://localhost:3000"}/v1/api/auth/saml/callback`,
        note: "SAML IdP integration not yet implemented",
      });
    } catch (error) {
      return res.status(404).json({ error: (error as Error).message });
    }
  }

  @Post("saml/callback")
  @ApiOperation({ summary: "Handle SAML authentication callback" })
  @ApiOkResponse({ description: "SAML callback processed successfully" })
  samlCallback(
    @Body() _samlAssertion: Record<string, unknown>,
    @Res() res: Response,
  ) {
    return res.json({
      message: "SAML callback received",
      note: "SAML assertion processing not yet implemented",
    });
  }

  @Get("azure-ad/login")
  @ApiOperation({ summary: "Initiate Azure AD authentication" })
  @ApiOkResponse({
    description: "Azure AD authentication initiated successfully",
  })
  azureAdLogin(@Query("orgDomain") orgDomain: string, @Res() res: Response) {
    return res.json({
      message: `Azure AD authentication would be initiated for ${orgDomain}`,
      note: "Azure AD strategy not fully implemented yet",
    });
  }

  @Get("google/login")
  @ApiOperation({ summary: "Initiate Google Workspace authentication" })
  @ApiOkResponse({
    description: "Google Workspace authentication initiated successfully",
  })
  googleLogin(@Query("orgDomain") orgDomain: string, @Res() res: Response) {
    return res.json({
      message: `Google Workspace authentication would be initiated for ${orgDomain}`,
      note: "Google Workspace strategy not fully implemented yet",
    });
  }

  @ApiOkResponse({
    description: "Successfully retrieved all users",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          user_id: {
            type: "string",
            example: "550e8400-e29b-41d4-a716-446655440000",
          },
          username: { type: "string", example: "John Doe" },
          provider: {
            type: "string",
            example: "manual",
            enum: ["manual", "linkedin", "saml", "google", "microsoft"],
          },
          profile_picture: {
            type: "string",
            nullable: true,
            example: "https://example.com/avatar.jpg",
          },
          created_at: {
            type: "string",
            format: "date-time",
            example: "2024-01-15T10:30:00.000Z",
          },
          email: {
            type: "object",
            nullable: true,
            properties: {
              email: { type: "string", example: "john.doe@company.com" },
              is_verified: { type: "boolean", example: true },
            },
          },
          phone: {
            type: "object",
            nullable: true,
            properties: {
              phone_number: { type: "string", example: "+33769293743" },
              is_verified: { type: "boolean", example: false },
            },
          },
          organizations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                role: { type: "string", example: "user" },
                organization: {
                  type: "object",
                  properties: {
                    org_id: { type: "string", example: "org-uuid" },
                    name: { type: "string", example: "Test Company" },
                    domain: { type: "string", example: "company.com" },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiOperation({
    summary: "Get all users",
    description:
      "Retrieve a list of all users in the system with their basic information, including email, phone, and organization associations.",
  })
  @Get("users")
  async getAllUsers() {
    return await this.authService.getAllUsers();
  }

  @ApiOkResponse({
    description: "Successfully retrieved user details",
    schema: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
          example: "550e8400-e29b-41d4-a716-446655440000",
        },
        username: { type: "string", example: "John Doe" },
        provider: { type: "string", example: "manual" },
        profile_picture: {
          type: "string",
          nullable: true,
          example: "https://example.com/avatar.jpg",
        },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
        email: {
          type: "object",
          nullable: true,
          properties: {
            email_id: { type: "number", example: 1 },
            email: { type: "string", example: "john.doe@company.com" },
            is_verified: { type: "boolean", example: true },
          },
        },
        phone: {
          type: "object",
          nullable: true,
          properties: {
            phone_number_id: { type: "number", example: 1 },
            phone_number: { type: "string", example: "+33769293743" },
            is_verified: { type: "boolean", example: false },
          },
        },
        has_password: { type: "boolean", example: true },
        password_info: {
          type: "object",
          nullable: true,
          properties: {
            password_id: { type: "number", example: 1 },
          },
        },
        oauth_accounts: {
          type: "array",
          items: {
            type: "object",
            properties: {
              oauth_id: { type: "number", example: 1 },
              provider: { type: "string", example: "linkedin" },
            },
          },
        },
        organizations: {
          type: "array",
          items: {
            type: "object",
            properties: {
              role: { type: "string", example: "user" },
              organization: {
                type: "object",
                properties: {
                  org_id: { type: "string", example: "org-uuid" },
                  name: { type: "string", example: "Test Company" },
                  domain: { type: "string", example: "company.com" },
                  sso_provider: {
                    type: "string",
                    nullable: true,
                    example: "saml",
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: "User not found",
    schema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          example:
            "User with ID 550e8400-e29b-41d4-a716-446655440000 not found",
        },
        error: { type: "string", example: "Not Found" },
        statusCode: { type: "number", example: 404 },
      },
    },
  })
  @ApiOperation({
    summary: "Get user by ID",
    description:
      "Retrieve detailed information about a specific user, including all associated data like email, phone, password status, OAuth accounts, and organization memberships.",
  })
  @Get(":userId")
  async getUserById(@Param("userId") userId: string) {
    return await this.authService.getUserById(userId);
  }
}
