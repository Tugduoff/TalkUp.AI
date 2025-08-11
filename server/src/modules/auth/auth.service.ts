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

import { user, user_password, user_phone_number } from "@entities/user.entity";

import { hashPassword } from "@common/utils/passwordHasher";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(user) private userRepository: Repository<user>,
    @InjectRepository(user_password)
    private userPasswordRepository: Repository<user_password>,
    @InjectRepository(user_phone_number)
    private userPhoneNumberRepository: Repository<user_phone_number>,

    private jwtService: JwtService,
  ) {}

  /**
   * Registers a new user with the provided credentials.
   *
   * This method performs the following steps:
   * 1. Checks if the phone number already exists in the system.
   * 2. Throws a `ConflictException` if the phone number is already registered.
   * 3. Creates a new user with the given username.
   * 4. Hashes and stores the user's password.
   * 5. Stores the user's phone number.
   * 6. Generates and returns a JWT access token for the newly registered user.
   *
   * @param createUserDto - Data transfer object containing the user's registration details (username, password, phone number).
   * @returns An object containing the generated JWT access token.
   * @throws {ConflictException} If an account with the provided phone number already exists.
   */
  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string }> {
    const phoneNumberExists = await this.userPhoneNumberRepository.findOne({
      where: { phone_number: createUserDto.phoneNumber },
    });

    if (phoneNumberExists) {
      throw new ConflictException(
        "An account with this phone number already exists",
      );
    }

    const newUser = this.userRepository.create({
      username: createUserDto.username,
    });

    const savedUser = await this.userRepository.save(newUser);

    const newUserPassword = this.userPasswordRepository.create({
      password: await hashPassword(createUserDto.password),
      user_id: savedUser.user_id,
    });

    const newUserPhoneNumber = this.userPhoneNumberRepository.create({
      phone_number: createUserDto.phoneNumber,
      user_id: savedUser.user_id,
    });

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

  /**
   * Validates a user's credentials using their phone number and password.
   *
   * This method performs the following steps:
   * 1. Finds the user entity associated with the provided phone number.
   * 2. Retrieves the password entity for the found user.
   * 3. Retrieves the user entity details.
   * 4. Throws an `UnauthorizedException` if the phone number or password is not found, or if the password does not match.
   * 5. Returns the user entity if validation is successful.
   *
   * @param phoneNumber - The user's phone number to identify the account.
   * @param password - The user's plaintext password to validate.
   * @returns A promise that resolves to the user entity if validation succeeds.
   * @throws {UnauthorizedException} If the phone number is not found or the password is invalid.
   */
  async validateUser(phoneNumber: string, password: string): Promise<user> {
    const phoneNumberEntity = await this.userPhoneNumberRepository.findOne({
      where: { phone_number: phoneNumber },
    });

    if (!phoneNumberEntity) {
      throw new UnauthorizedException("Phone number not found");
    }

    const passwordEntity = await this.userPasswordRepository.findOne({
      where: { user_id: phoneNumberEntity.user_id },
    });

    const userEntity = await this.userRepository.findOne({
      where: { user_id: phoneNumberEntity.user_id },
    });

    if (!passwordEntity || !userEntity) {
      throw new UnauthorizedException("Phone number not found");
    }

    const match = await bcrypt.compare(password, passwordEntity.password);
    if (!match) {
      throw new UnauthorizedException("Invalid password");
    }

    return userEntity;
  }

  /**
   * Authenticates a user and generates a JWT access token.
   *
   * @param user - The user object containing authentication details.
   * @returns An object containing the generated access token.
   */
  login(user: user) {
    const payload = { sub: user.user_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
