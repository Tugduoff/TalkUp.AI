import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
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
} from "@nestjs/swagger";

import { CreateUserDto } from "./dto/createUser.dto";
import { LoginDto } from "./dto/login.dto";

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
  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.phoneNumber,
      loginDto.password,
    );
    return this.authService.login(user);
  }

  @ApiOkResponse({
    description: "Redirects to LinkedIn for OAuth authentication.",
    type: String,
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error (problem fetching code).",
  })
  @Get("linkedin/callback")
  async linkedInCallback(@Query("code") code: string, @Res() res: Response) {
    const tokenData: {
      access_token: string;
      expires_in: string;
      scope: string;
    } = await this.authService.getAccessTokenDatas(code);

    const profile = await this.authService.getLinkedInProfile(
      tokenData.access_token,
    );

    const data: { accessToken: string } =
      await this.authService.saveLinkedInUser(profile, tokenData);

    res.redirect(
      `${process.env.FRONTEND_URL}/linkedin-oauth-test.html?token=${data.accessToken}`,
    );
  }
}
