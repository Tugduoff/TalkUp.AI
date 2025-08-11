import { LoggerMiddleware } from "./logger";
import { Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

jest.mock("@nestjs/common", () => ({
  ...jest.requireActual("@nestjs/common"),
  Logger: jest.fn().mockImplementation(() => ({
    log: jest.fn(),
  })),
}));

describe("LoggerMiddleware", () => {
  let loggerMiddleware: LoggerMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockLoggerInstance: { log: jest.Mock };

  beforeEach(() => {
    mockLoggerInstance = {
      log: jest.fn(),
    };

    (Logger as unknown as jest.Mock).mockImplementation(
      () => mockLoggerInstance,
    );

    loggerMiddleware = new LoggerMiddleware();

    mockRequest = {
      method: "GET",
      originalUrl: "/api/test",
      ip: "192.168.1.1",
      get: jest.fn(),
    };

    mockResponse = {
      on: jest
        .fn()
        .mockImplementation(
          (_event: string, _listener: (...args: unknown[]) => void) => {
            return mockResponse as Response;
          },
        ),
      get: jest.fn(),
    };

    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(loggerMiddleware).toBeDefined();
  });

  describe("use method", () => {
    it("should call next() immediately", () => {
      mockRequest.get = jest.fn().mockReturnValue("Mozilla/5.0");

      loggerMiddleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockNext).toHaveBeenCalledTimes(1);
    });

    it("should register a finish event listener on response", () => {
      mockRequest.get = jest.fn().mockReturnValue("Mozilla/5.0");

      loggerMiddleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockResponse.on).toHaveBeenCalledWith("finish", expect.anything());
    });

    it("should get user-agent from request headers", () => {
      mockRequest.get = jest.fn().mockReturnValue("Mozilla/5.0 Chrome");

      loggerMiddleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockRequest.get).toHaveBeenCalledWith("user-agent");
    });

    it("should handle missing user-agent gracefully", () => {
      mockRequest.get = jest.fn().mockReturnValue(undefined);

      loggerMiddleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockRequest.get).toHaveBeenCalledWith("user-agent");
    });

    it("should log request details when response finishes", () => {
      let finishCallback: () => void;
      mockRequest.get = jest.fn().mockReturnValue("Mozilla/5.0 Chrome");
      mockResponse.on = jest
        .fn()
        .mockImplementation(
          (event: string, listener: (...args: unknown[]) => void) => {
            if (event === "finish") {
              finishCallback = listener as () => void;
            }
            return mockResponse as Response;
          },
        );
      mockResponse.get = jest.fn().mockReturnValue("1024");

      loggerMiddleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      mockResponse.statusCode = 200;
      finishCallback!();

      expect(mockLoggerInstance.log).toHaveBeenCalledWith(
        "GET /api/test 200 1024 - Mozilla/5.0 Chrome 192.168.1.1",
      );
    });

    it("should handle different HTTP methods", () => {
      const testCases = ["GET", "POST", "PUT", "DELETE", "PATCH"];

      testCases.forEach((method) => {
        let finishCallback: () => void;
        mockRequest.method = method;
        mockRequest.get = jest.fn().mockReturnValue("TestAgent");
        mockResponse.on = jest
          .fn()
          .mockImplementation(
            (event: string, listener: (...args: unknown[]) => void) => {
              if (event === "finish") {
                finishCallback = listener as () => void;
              }
              return mockResponse as Response;
            },
          );
        mockResponse.get = jest.fn().mockReturnValue("500");

        loggerMiddleware.use(
          mockRequest as Request,
          mockResponse as Response,
          mockNext,
        );

        mockResponse.statusCode = 201;
        finishCallback!();

        expect(mockLoggerInstance.log).toHaveBeenCalledWith(
          `${method} /api/test 201 500 - TestAgent 192.168.1.1`,
        );

        jest.clearAllMocks();
      });
    });

    it("should handle different status codes", () => {
      const testCases = [200, 201, 400, 401, 404, 500];

      testCases.forEach((statusCode) => {
        let finishCallback: () => void;
        mockRequest.get = jest.fn().mockReturnValue("TestAgent");
        mockResponse.on = jest
          .fn()
          .mockImplementation(
            (event: string, listener: (...args: unknown[]) => void) => {
              if (event === "finish") {
                finishCallback = listener as () => void;
              }
              return mockResponse as Response;
            },
          );
        mockResponse.get = jest.fn().mockReturnValue("200");

        loggerMiddleware.use(
          mockRequest as Request,
          mockResponse as Response,
          mockNext,
        );

        mockResponse.statusCode = statusCode;
        finishCallback!();

        expect(mockLoggerInstance.log).toHaveBeenCalledWith(
          `GET /api/test ${statusCode} 200 - TestAgent 192.168.1.1`,
        );

        jest.clearAllMocks();
      });
    });

    it("should handle different URLs", () => {
      const testUrls = [
        "/api/users",
        "/auth/login",
        "/linkedin/callback",
        "/health",
        "/api/v1/complex/nested/route?param=value",
      ];

      testUrls.forEach((url) => {
        let finishCallback: () => void;
        mockRequest.originalUrl = url;
        mockRequest.get = jest.fn().mockReturnValue("TestAgent");
        mockResponse.on = jest
          .fn()
          .mockImplementation(
            (event: string, listener: (...args: unknown[]) => void) => {
              if (event === "finish") {
                finishCallback = listener as () => void;
              }
              return mockResponse as Response;
            },
          );
        mockResponse.get = jest.fn().mockReturnValue("100");

        loggerMiddleware.use(
          mockRequest as Request,
          mockResponse as Response,
          mockNext,
        );

        mockResponse.statusCode = 200;
        finishCallback!();

        expect(mockLoggerInstance.log).toHaveBeenCalledWith(
          `GET ${url} 200 100 - TestAgent 192.168.1.1`,
        );

        jest.clearAllMocks();
      });
    });

    it("should handle missing content-length header", () => {
      let finishCallback: () => void;
      mockRequest.get = jest.fn().mockReturnValue("TestAgent");
      mockResponse.on = jest
        .fn()
        .mockImplementation(
          (event: string, listener: (...args: unknown[]) => void) => {
            if (event === "finish") {
              finishCallback = listener as () => void;
            }
            return mockResponse as Response;
          },
        );
      mockResponse.get = jest.fn().mockReturnValue(undefined);

      loggerMiddleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      mockResponse.statusCode = 204;
      finishCallback!();

      expect(mockLoggerInstance.log).toHaveBeenCalledWith(
        "GET /api/test 204 undefined - TestAgent 192.168.1.1",
      );
    });

    it("should handle empty user-agent", () => {
      let finishCallback: () => void;
      mockRequest.get = jest.fn().mockReturnValue(null);
      mockResponse.on = jest
        .fn()
        .mockImplementation(
          (event: string, listener: (...args: unknown[]) => void) => {
            if (event === "finish") {
              finishCallback = listener as () => void;
            }
            return mockResponse as Response;
          },
        );
      mockResponse.get = jest.fn().mockReturnValue("1000");

      loggerMiddleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      mockResponse.statusCode = 200;
      finishCallback!();

      expect(mockLoggerInstance.log).toHaveBeenCalledWith(
        "GET /api/test 200 1000 -  192.168.1.1",
      );
    });

    it("should handle different IP addresses", () => {
      const testIPs = [
        "127.0.0.1",
        "192.168.1.100",
        "10.0.0.1",
        "172.16.0.1",
        "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
      ];

      testIPs.forEach((ip) => {
        let finishCallback: () => void;
        const requestMock: Request = {
          ...mockRequest,
          ip,
        } as Request;
        requestMock.get = jest.fn().mockReturnValue("TestAgent");
        mockResponse.on = jest
          .fn()
          .mockImplementation(
            (event: string, listener: (...args: unknown[]) => void) => {
              if (event === "finish") {
                finishCallback = listener as () => void;
              }
              return mockResponse as Response;
            },
          );
        mockResponse.get = jest.fn().mockReturnValue("500");

        loggerMiddleware.use(requestMock, mockResponse as Response, mockNext);

        mockResponse.statusCode = 200;
        finishCallback!();

        expect(mockLoggerInstance.log).toHaveBeenCalledWith(
          `GET /api/test 200 500 - TestAgent ${ip}`,
        );

        jest.clearAllMocks();
      });
    });

    it("should handle complex user-agent strings", () => {
      const complexUserAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "PostmanRuntime/7.28.4",
        "curl/7.68.0",
        "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)",
        "",
      ];

      complexUserAgents.forEach((userAgent) => {
        let finishCallback: () => void;
        mockRequest.get = jest.fn().mockReturnValue(userAgent);
        mockResponse.on = jest
          .fn()
          .mockImplementation(
            (event: string, listener: (...args: unknown[]) => void) => {
              if (event === "finish") {
                finishCallback = listener as () => void;
              }
              return mockResponse as Response;
            },
          );
        mockResponse.get = jest.fn().mockReturnValue("250");

        loggerMiddleware.use(
          mockRequest as Request,
          mockResponse as Response,
          mockNext,
        );

        mockResponse.statusCode = 200;
        finishCallback!();

        const expectedUserAgent = userAgent || "";
        expect(mockLoggerInstance.log).toHaveBeenCalledWith(
          `GET /api/test 200 250 - ${expectedUserAgent} 192.168.1.1`,
        );

        jest.clearAllMocks();
      });
    });

    it("should not affect the request/response flow", () => {
      mockRequest.get = jest.fn().mockReturnValue("TestAgent");

      const originalRequest = { ...mockRequest };
      const _originalResponse = { ...mockResponse };

      loggerMiddleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockRequest.method).toBe(originalRequest.method);
      expect(mockRequest.originalUrl).toBe(originalRequest.originalUrl);
      expect(mockRequest.ip).toBe(originalRequest.ip);
    });

    it("should create logger with correct context", () => {
      expect(Logger).toHaveBeenCalledWith("APP");
    });

    it("should only log after response finishes, not during request", () => {
      mockRequest.get = jest.fn().mockReturnValue("TestAgent");
      mockResponse.on = jest.fn();

      loggerMiddleware.use(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      );

      expect(mockLoggerInstance.log).not.toHaveBeenCalled();
    });

    it("should handle edge case with undefined request properties", () => {
      let finishCallback: () => void;

      const minimalRequest: Request = {
        method: undefined,
        originalUrl: undefined,
        ip: undefined,
        get: jest.fn().mockReturnValue(undefined),
      } as unknown as Request;

      mockResponse.on = jest
        .fn()
        .mockImplementation(
          (event: string, listener: (...args: unknown[]) => void) => {
            if (event === "finish") {
              finishCallback = listener as () => void;
            }
            return mockResponse as Response;
          },
        );
      mockResponse.get = jest.fn().mockReturnValue(undefined);

      loggerMiddleware.use(minimalRequest, mockResponse as Response, mockNext);

      mockResponse.statusCode = undefined;
      finishCallback!();

      expect(mockLoggerInstance.log).toHaveBeenCalledWith(
        "undefined undefined undefined undefined -  undefined",
      );
    });
  });
});
