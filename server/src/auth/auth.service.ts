/* eslint-disable no-unused-vars */

import { Repository } from "typeorm";

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { CreateUserDto } from "./dto/createUser.dto";
import { UsersService } from "@src/users/users.service";
import { LoginDto } from "./dto/login.dto";

import { user, user_password, user_phonenumber } from "@entities/user.entity";

import { hashPassword } from "@common/utils/passwordHasher";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(user) private userRepository: Repository<user>,
    @InjectRepository(user_password)
    private userPasswordRepository: Repository<user_password>,
    @InjectRepository(user_phonenumber)
    private userPhoneNumberRepository: Repository<user_phonenumber>,

    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Registers a new user and returns a JWT token.
   * @param createUserDto - The DTO containing user registration data.
   * @returns An object containing the access token.
   * @throws ConflictException if an account with the same phone number already exists.
   */
  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string }> {
    // Check if the user already exists
    const phoneNumberExists = await this.userPhoneNumberRepository.findOne({
      where: { phone_number: createUserDto.phoneNumber },
    });

    if (phoneNumberExists) {
      throw new ConflictException(
        "An account with this phone number already exists",
      );
    }

    // Create a new user, contains only the username
    const newUser = this.userRepository.create({
      username: createUserDto.username,
    });

    // Save the user to the database, contains every user information
    const savedUser = await this.userRepository.save(newUser);

    // create user_password
    const newUserPassword = this.userPasswordRepository.create({
      password: await hashPassword(createUserDto.password),
      user_id: savedUser.user_id,
    });

    // create user_phonenumber
    const newUserPhoneNumber = this.userPhoneNumberRepository.create({
      phone_number: createUserDto.phoneNumber,
      user_id: savedUser.user_id,
    });

    // Save the password, and phone number to the database
    await this.userPasswordRepository.save(newUserPassword);
    await this.userPhoneNumberRepository.save(newUserPhoneNumber);

    const payload = {
      userId: savedUser.user_id,
      username: savedUser.username,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const result = await this.usersService.findUserWithPasswordByEmail(email);

    if (!result) throw new UnauthorizedException("Email non trouvé");

    const match = await bcrypt.compare(password, result.passwordHash);
    if (!match) throw new UnauthorizedException("Mot de passe incorrect");

    const { passwordHash, ...user } = result;
    return user;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
