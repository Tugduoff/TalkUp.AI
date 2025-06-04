import { Body, Controller, Post, Put } from "@nestjs/common";
import { UsePipes } from "@nestjs/common/decorators/core/use-pipes.decorator";

import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
  ApiTags,
  ApiOkResponse,
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
    description: "The password has successfully changed",
    type: String,
  })
  @Put("updatePassword")
  async updatePassword(
    @Body() body: { phoneNumber: string; newPassword: string },
  ) {
    return this.authService.changeUserPassword(
      body.phoneNumber,
      body.newPassword,
    );
  }
}
