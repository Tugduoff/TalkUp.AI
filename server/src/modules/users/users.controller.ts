import { Body, Controller, Put } from "@nestjs/common";
import { UsePipes } from "@nestjs/common/decorators/core/use-pipes.decorator";

import {
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from "@nestjs/swagger";

import { UpdatePasswordDto } from "./dto/updatePassword.dto";
import { PostValidationPipe } from "@common/pipes/PostValidationPipe";
import { UsersService } from "./users.service";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({
    description: "The password has successfully changed",
    type: String,
  })
  @ApiBadRequestResponse({
    description: "Invalid request data in body (UpdatePasswordDto)",
  })
  @ApiNotFoundResponse({
    description: "User with the provided email was not found",
  })
  @UsePipes(new PostValidationPipe())
  @Put("password")
  async updatePassword(@Body() body: UpdatePasswordDto) {
    return this.usersService.changeUserPassword(body.email, body.newPassword);
  }
}
