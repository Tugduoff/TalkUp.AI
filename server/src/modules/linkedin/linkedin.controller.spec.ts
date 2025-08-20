import { Test, TestingModule } from "@nestjs/testing";
import { Response } from "express";
import { InternalServerErrorException } from "@nestjs/common";

import { LinkedInController } from "./linkedin.controller";
import { LinkedInService } from "./linkedin.service";

describe("LinkedInController", () => {
  let controller: LinkedInController;
  let mockLinkedInService: Partial<LinkedInService>;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    mockLinkedInService = {
      handleLinkedInCallback: jest.fn(),
    };

    mockResponse = {
      redirect: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinkedInController],
      providers: [
        {
          provide: LinkedInService,
          useValue: mockLinkedInService,
        },
      ],
    }).compile();

    controller = module.get<LinkedInController>(LinkedInController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("linkedInCallback", () => {
    const mockCode = "test-authorization-code";
    const mockAccessToken = "jwt-access-token-12345";

    beforeEach(() => {
      process.env.FRONTEND_URL = "http://localhost:3000";
    });

    afterEach(() => {
      delete process.env.FRONTEND_URL;
    });

    it("should handle LinkedIn callback successfully and redirect", async () => {
      mockLinkedInService.handleLinkedInCallback = jest.fn().mockResolvedValue({
        accessToken: mockAccessToken,
      });

      await controller.linkedInCallback(mockCode, mockResponse as Response);

      expect(mockLinkedInService.handleLinkedInCallback).toHaveBeenCalledWith(
        mockCode,
      );
      expect(mockLinkedInService.handleLinkedInCallback).toHaveBeenCalledTimes(
        1,
      );
      expect(mockResponse.redirect).toHaveBeenCalledWith(
        `http://localhost:3000/linkedin-oauth-test.html?token=${mockAccessToken}`,
      );
      expect(mockResponse.redirect).toHaveBeenCalledTimes(1);
    });

    it("should construct correct redirect URL with token", async () => {
      const customToken = "custom-jwt-token-abcdef";
      mockLinkedInService.handleLinkedInCallback = jest.fn().mockResolvedValue({
        accessToken: customToken,
      });

      await controller.linkedInCallback(
        "custom-code",
        mockResponse as Response,
      );

      expect(mockResponse.redirect).toHaveBeenCalledWith(
        `http://localhost:3000/linkedin-oauth-test.html?token=${customToken}`,
      );
    });

    it("should handle service errors and propagate them", async () => {
      const serviceError = new InternalServerErrorException(
        "Failed to fetch LinkedIn profile",
      );
      mockLinkedInService.handleLinkedInCallback = jest
        .fn()
        .mockRejectedValue(serviceError);

      await expect(
        controller.linkedInCallback(mockCode, mockResponse as Response),
      ).rejects.toThrow(serviceError);

      expect(mockLinkedInService.handleLinkedInCallback).toHaveBeenCalledWith(
        mockCode,
      );
      expect(mockResponse.redirect).not.toHaveBeenCalled();
    });

    it("should handle OAuth token fetch errors", async () => {
      const tokenError = new InternalServerErrorException(
        "Failed to fetch access token",
      );
      mockLinkedInService.handleLinkedInCallback = jest
        .fn()
        .mockRejectedValue(tokenError);

      await expect(
        controller.linkedInCallback(mockCode, mockResponse as Response),
      ).rejects.toThrow(tokenError);

      expect(mockLinkedInService.handleLinkedInCallback).toHaveBeenCalledWith(
        mockCode,
      );
      expect(mockResponse.redirect).not.toHaveBeenCalled();
    });

    it("should handle OAuth data save errors", async () => {
      const saveError = new InternalServerErrorException(
        "Failed to save OAuth data",
      );
      mockLinkedInService.handleLinkedInCallback = jest
        .fn()
        .mockRejectedValue(saveError);

      await expect(
        controller.linkedInCallback(mockCode, mockResponse as Response),
      ).rejects.toThrow(saveError);

      expect(mockLinkedInService.handleLinkedInCallback).toHaveBeenCalledWith(
        mockCode,
      );
    });

    it("should work with different frontend URLs", async () => {
      process.env.FRONTEND_URL = "https://myapp.com";
      mockLinkedInService.handleLinkedInCallback = jest.fn().mockResolvedValue({
        accessToken: mockAccessToken,
      });

      await controller.linkedInCallback(mockCode, mockResponse as Response);

      expect(mockResponse.redirect).toHaveBeenCalledWith(
        `https://myapp.com/linkedin-oauth-test.html?token=${mockAccessToken}`,
      );
    });

    it("should handle empty/null authorization codes gracefully", async () => {
      const emptyCode = "";
      mockLinkedInService.handleLinkedInCallback = jest.fn().mockResolvedValue({
        accessToken: mockAccessToken,
      });

      await controller.linkedInCallback(emptyCode, mockResponse as Response);

      expect(mockLinkedInService.handleLinkedInCallback).toHaveBeenCalledWith(
        emptyCode,
      );
    });

    it("should pass through network errors from LinkedIn API", async () => {
      const networkError = new Error("Network timeout");
      mockLinkedInService.handleLinkedInCallback = jest
        .fn()
        .mockRejectedValue(networkError);

      await expect(
        controller.linkedInCallback(mockCode, mockResponse as Response),
      ).rejects.toThrow(networkError);
    });

    it("should verify service method is called with exact parameters", async () => {
      const specificCode = "very-specific-oauth-code-123";
      mockLinkedInService.handleLinkedInCallback = jest.fn().mockResolvedValue({
        accessToken: "specific-token",
      });

      await controller.linkedInCallback(specificCode, mockResponse as Response);

      expect(mockLinkedInService.handleLinkedInCallback).toHaveBeenCalledWith(
        specificCode,
      );
      expect(mockLinkedInService.handleLinkedInCallback).toHaveBeenCalledWith(
        expect.not.stringMatching(/different-code/),
      );
    });
  });
});
