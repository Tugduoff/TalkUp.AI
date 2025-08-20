import { Controller, Get, Query, Res } from "@nestjs/common";
import { Response } from "express";

import {
  ApiTags,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from "@nestjs/swagger";

import { LinkedInService } from "./linkedin.service";

@ApiTags("LinkedIn")
@Controller("linkedin")
export class LinkedInController {
  constructor(private readonly linkedInService: LinkedInService) {}

  @ApiOkResponse({
    description:
      "Redirects to frontend with JWT token after LinkedIn OAuth authentication.",
    type: String,
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server error during LinkedIn OAuth process.",
  })
  @Get("callback")
  async linkedInCallback(@Query("code") code: string, @Res() res: Response) {
    const data: { accessToken: string } =
      await this.linkedInService.handleLinkedInCallback(code);

    res.redirect(
      `${process.env.FRONTEND_URL}/linkedin-oauth-test.html?token=${data.accessToken}`,
    );
  }
}
