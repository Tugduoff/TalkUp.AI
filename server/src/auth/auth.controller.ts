import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common/pipes/validation.pipe";
import { UsePipes } from "@nestjs/common/decorators/core/use-pipes.decorator";

import { CreateUserDto } from "./dto/createUser.dto";
import { LoginDto } from './dto/login.dto';

import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @Post("login")
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Body() createUserDto: CreateUserDto) {
    // Call the authService to handle the registration logic
    return await this.authService.register(createUserDto);
  }
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
