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

  @HttpCode(200)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  
  @Post("register")
  async register(@Body() createUserDto: CreateUserDto) {
    // Call the authService to handle the registration logic
    return await this.authService.register(createUserDto);
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    return this.authService.login(user);
  }
}
