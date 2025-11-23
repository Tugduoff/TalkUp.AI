import { Body, Controller, Post, Patch, UseGuards } from "@nestjs/common";
import { UsePipes } from "@nestjs/common/decorators/core/use-pipes.decorator";

import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiUnprocessableEntityResponse,
  ApiTags,
  ApiOkResponse,
  ApiBearerAuth
} from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

import { CreateUserDto } from "./dto/createUser.dto";
import { LoginDto } from "./dto/login.dto";
import { EditUserDto } from "./dto/editUser.dto";

import { PostValidationPipe } from "@common/pipes/PostValidationPipe";
import { CurrentUser } from "@common/decorators/current-user.decorator";

import { AuthService } from "./auth.service";

@ApiBearerAuth()
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
    return await this.authService.register(createUserDto);
  }

  @ApiOkResponse({
    description: "User successfully logged in.",
    type: String,
  })
  @UsePipes(new PostValidationPipe())
  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    return await this.authService.login(user);
  }

@Patch("editUser")
@UseGuards(AuthGuard('jwt'))
@ApiOkResponse({ description: "User updated successfully." })
async editUser(
  @CurrentUser('id') userId: string,
  @Body() editUserDto: EditUserDto
  ) {
    return await this.authService.editUser(userId, editUserDto);
}
}
