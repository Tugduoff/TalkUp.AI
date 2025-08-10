import { isDateExpired } from "./intervalChecker";

describe("intervalChecker", () => {
  describe("isDateExpired", () => {
    beforeEach(() => {
      jest.useRealTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    describe("Valid Input Scenarios", () => {
      it("should return false for a date that has not expired", () => {
        const futureDate = new Date();
        const expiresInSeconds = "3600";

        const result = isDateExpired(futureDate, expiresInSeconds);

        expect(result).toBe(false);
      });

      it("should return true for a date that has expired", () => {
        const pastDate = new Date(Date.now() - 7200000);
        const expiresInSeconds = "3600";

        const result = isDateExpired(pastDate, expiresInSeconds);

        expect(result).toBe(true);
      });

      it("should handle expiration exactly at the boundary", () => {
        const mockCurrentTime = new Date("2023-01-01T12:00:00.000Z");
        jest.useFakeTimers();
        jest.setSystemTime(mockCurrentTime);
        const exactExpiryDate = new Date("2023-01-01T11:00:00.000Z");
        const expiresInSeconds = "3600";

        const result = isDateExpired(exactExpiryDate, expiresInSeconds);

        expect(result).toBe(false);
      });

      it("should handle date just before expiration", () => {
        const mockCurrentTime = new Date("2023-01-01T12:00:00.000Z");
        jest.useFakeTimers();
        jest.setSystemTime(mockCurrentTime);
        const justBeforeExpiryDate = new Date("2023-01-01T11:00:01.000Z");
        const expiresInSeconds = "3600";

        const result = isDateExpired(justBeforeExpiryDate, expiresInSeconds);

        expect(result).toBe(false);
      });
    });

    describe("Different Expiration Durations", () => {
      beforeEach(() => {
        const mockCurrentTime = new Date("2023-01-01T12:00:00.000Z");
        jest.useFakeTimers();
        jest.setSystemTime(mockCurrentTime);
      });

      it("should handle short expiration (seconds)", () => {
        const testDate = new Date("2023-01-01T11:59:50.000Z");

        expect(isDateExpired(testDate, "5")).toBe(true);
        expect(isDateExpired(testDate, "15")).toBe(false);
      });

      it("should handle medium expiration (minutes)", () => {
        const testDate = new Date("2023-01-01T11:55:00.000Z");

        expect(isDateExpired(testDate, "240")).toBe(true);
        expect(isDateExpired(testDate, "360")).toBe(false);
      });

      it("should handle long expiration (hours)", () => {
        const testDate = new Date("2023-01-01T10:00:00.000Z");

        expect(isDateExpired(testDate, "3600")).toBe(true);
        expect(isDateExpired(testDate, "10800")).toBe(false);
      });

      it("should handle very long expiration (days)", () => {
        const testDate = new Date("2022-12-31T12:00:00.000Z");

        expect(isDateExpired(testDate, "43200")).toBe(true);
        expect(isDateExpired(testDate, "172800")).toBe(false);
      });

      it("should handle zero expiration", () => {
        const testDate = new Date("2023-01-01T12:00:00.000Z");

        expect(isDateExpired(testDate, "0")).toBe(false);
      });

      it("should handle very small expiration", () => {
        const testDate = new Date("2023-01-01T11:59:59.000Z");

        expect(isDateExpired(testDate, "1")).toBe(false);
      });
    });

    describe("Error Handling", () => {
      it("should throw error when dateToCheck is null", () => {
        expect(() => {
          isDateExpired(null as unknown as Date, "3600");
        }).toThrow("Both dateToCheck and expiresIn are required");
      });

      it("should throw error when dateToCheck is undefined", () => {
        expect(() => {
          isDateExpired(undefined as unknown as Date, "3600");
        }).toThrow("Both dateToCheck and expiresIn are required");
      });

      it("should throw error when expiresIn is null", () => {
        const testDate = new Date();
        expect(() => {
          isDateExpired(testDate, null as unknown as string);
        }).toThrow("Both dateToCheck and expiresIn are required");
      });

      it("should throw error when expiresIn is undefined", () => {
        const testDate = new Date();
        expect(() => {
          isDateExpired(testDate, undefined as unknown as string);
        }).toThrow("Both dateToCheck and expiresIn are required");
      });

      it("should throw error when expiresIn is empty string", () => {
        const testDate = new Date();
        expect(() => {
          isDateExpired(testDate, "");
        }).toThrow("Both dateToCheck and expiresIn are required");
      });

      it("should throw error when both parameters are null", () => {
        expect(() => {
          isDateExpired(null as unknown as Date, null as unknown as string);
        }).toThrow("Both dateToCheck and expiresIn are required");
      });
    });

    describe("Edge Cases and Input Validation", () => {
      it("should handle invalid date objects", () => {
        const invalidDate = new Date("invalid-date-string");
        const expiresInSeconds = "3600";

        const result = isDateExpired(invalidDate, expiresInSeconds);

        expect(typeof result).toBe("boolean");
      });

      it("should handle non-numeric expiresIn strings", () => {
        const testDate = new Date();

        const result1 = isDateExpired(testDate, "abc");
        const result2 = isDateExpired(testDate, "123abc");
        const result3 = isDateExpired(testDate, "abc123");

        expect(typeof result1).toBe("boolean");
        expect(typeof result2).toBe("boolean");
        expect(typeof result3).toBe("boolean");
      });

      it("should handle negative expiresIn values", () => {
        const mockCurrentTime = new Date("2023-01-01T12:00:00.000Z");
        jest.useFakeTimers();
        jest.setSystemTime(mockCurrentTime);

        const testDate = new Date("2023-01-01T11:00:00.000Z");

        const result = isDateExpired(testDate, "-3600");

        expect(result).toBe(true);
      });

      it("should handle decimal values in expiresIn", () => {
        const mockCurrentTime = new Date("2023-01-01T12:00:00.000Z");
        jest.useFakeTimers();
        jest.setSystemTime(mockCurrentTime);
        const testDate = new Date("2023-01-01T11:59:00.000Z");

        const result = isDateExpired(testDate, "90.5");

        expect(result).toBe(false);
      });

      it("should handle very large expiresIn values", () => {
        const testDate = new Date();
        const veryLargeExpiration = "999999999";

        const result = isDateExpired(testDate, veryLargeExpiration);

        expect(result).toBe(false);
      });

      it("should handle dates far in the future", () => {
        const futureDate = new Date("2030-01-01T00:00:00.000Z");
        const expiresInSeconds = "3600";

        const result = isDateExpired(futureDate, expiresInSeconds);

        expect(result).toBe(false);
      });

      it("should handle dates far in the past", () => {
        const pastDate = new Date("1990-01-01T00:00:00.000Z");
        const expiresInSeconds = "3600";

        const result = isDateExpired(pastDate, expiresInSeconds);

        expect(result).toBe(true);
      });
    });

    describe("Precision and Timing", () => {
      it("should handle millisecond precision correctly", () => {
        const mockCurrentTime = new Date("2023-01-01T12:00:00.000Z");
        jest.useFakeTimers();
        jest.setSystemTime(mockCurrentTime);
        const testDate = new Date("2023-01-01T11:59:59.999Z");

        const result = isDateExpired(testDate, "1");

        expect(result).toBe(false);
      });

      it("should handle timezone differences in Date objects", () => {
        const mockCurrentTime = new Date("2023-01-01T12:00:00.000Z");
        jest.useFakeTimers();
        jest.setSystemTime(mockCurrentTime);
        const utcDate = new Date("2023-01-01T11:00:00.000Z");
        const localDate = new Date("2023-01-01T11:00:00");

        const result1 = isDateExpired(utcDate, "3600");
        const result2 = isDateExpired(localDate, "3600");

        expect(typeof result1).toBe("boolean");
        expect(typeof result2).toBe("boolean");
      });
    });

    describe("Real-world Usage Scenarios", () => {
      it("should handle JWT token expiration scenario", () => {
        const mockCurrentTime = new Date("2023-01-01T12:00:00.000Z");
        jest.useFakeTimers();
        jest.setSystemTime(mockCurrentTime);
        const tokenIssuedAt = new Date("2023-01-01T11:00:00.000Z");
        const jwtExpiresIn = "3600";

        const isExpired = isDateExpired(tokenIssuedAt, jwtExpiresIn);

        expect(isExpired).toBe(false);
      });

      it("should handle OAuth refresh token expiration", () => {
        const mockCurrentTime = new Date("2023-01-01T12:00:00.000Z");
        jest.useFakeTimers();
        jest.setSystemTime(mockCurrentTime);
        const refreshTokenIssuedAt = new Date("2023-01-01T00:00:00.000Z");
        const refreshExpiresIn = "86400";

        const isExpired = isDateExpired(refreshTokenIssuedAt, refreshExpiresIn);

        expect(isExpired).toBe(false);
      });

      it("should handle cache expiration checking", () => {
        const mockCurrentTime = new Date("2023-01-01T12:00:00.000Z");
        jest.useFakeTimers();
        jest.setSystemTime(mockCurrentTime);
        const cacheCreatedAt = new Date("2023-01-01T11:55:00.000Z");
        const cacheExpiresIn = "600";

        const isCacheExpired = isDateExpired(cacheCreatedAt, cacheExpiresIn);

        expect(isCacheExpired).toBe(false);
      });

      it("should handle session timeout validation", () => {
        const mockCurrentTime = new Date("2023-01-01T12:00:00.000Z");
        jest.useFakeTimers();
        jest.setSystemTime(mockCurrentTime);

        const sessionStarted = new Date("2023-01-01T10:00:00.000Z");
        const sessionTimeoutSeconds = "7200";
        const isSessionExpired = isDateExpired(
          sessionStarted,
          sessionTimeoutSeconds,
        );
        expect(isSessionExpired).toBe(false);
      });
    });
  });
});
