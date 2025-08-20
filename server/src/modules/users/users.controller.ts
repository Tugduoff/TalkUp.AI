import { Body, Controller, Put } from "@nestjs/common";
import { UsePipes } from "@nestjs/common/decorators/core/use-pipes.decorator";

import { ApiTags, ApiOkResponse } from "@nestjs/swagger";

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
  @UsePipes(new PostValidationPipe())
  @Put("password")
  async updatePassword(@Body() body: UpdatePasswordDto) {
    return this.usersService.changeUserPassword(
      body.phoneNumber,
      body.newPassword,
    );
  }
}
