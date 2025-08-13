import { hashPassword } from "./passwordHasher";
import * as bcrypt from "bcrypt";

jest.mock("bcrypt");
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe("passwordHasher", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("hashPassword", () => {
    it("should successfully hash a valid password", async () => {
      const password = "testPassword123";
      const expectedHash = "$2b$10$abcdef1234567890";

      mockedBcrypt.hash.mockResolvedValue(expectedHash as never);

      const result = await hashPassword(password);

      expect(result).toBe(expectedHash);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(mockedBcrypt.hash).toHaveBeenCalledTimes(1);
    });

    it("should use salt rounds of 10", async () => {
      const password = "mySecurePassword";
      const expectedHash = "$2b$10$hashedPassword";

      mockedBcrypt.hash.mockResolvedValue(expectedHash as never);

      await hashPassword(password);

      expect(mockedBcrypt.hash).toHaveBeenCalledWith(password, 10);
    });

    it("should handle different password strings", async () => {
      const testPasswords = [
        "simple",
        "Complex123!@#",
        "verylongpasswordwithmanyclassicharachters12345",
        "password with spaces",
        "пароль",
        "123456789",
        "!@#$%^&*()",
      ];

      for (const password of testPasswords) {
        const expectedHash = `$2b$10$hash_for_${password.length}`;
        mockedBcrypt.hash.mockResolvedValue(expectedHash as never);

        const result = await hashPassword(password);

        expect(result).toBe(expectedHash);
        expect(mockedBcrypt.hash).toHaveBeenCalledWith(password, 10);

        jest.clearAllMocks();
      }
    });

    describe("Error Handling", () => {
      it("should throw error when password is empty string", async () => {
        await expect(hashPassword("")).rejects.toThrow("Password is required");
        expect(mockedBcrypt.hash).not.toHaveBeenCalled();
      });

      it("should throw error when password is undefined", async () => {
        await expect(
          hashPassword(undefined as unknown as string),
        ).rejects.toThrow("Password is required");
        expect(mockedBcrypt.hash).not.toHaveBeenCalled();
      });

      it("should throw error when password is null", async () => {
        await expect(hashPassword(null as unknown as string)).rejects.toThrow(
          "Password is required",
        );
        expect(mockedBcrypt.hash).not.toHaveBeenCalled();
      });

      it("should handle bcrypt errors gracefully with Error instance", async () => {
        const password = "testPassword";
        const bcryptError = new Error("Bcrypt internal error");

        mockedBcrypt.hash.mockRejectedValue(bcryptError as never);

        await expect(hashPassword(password)).rejects.toThrow(
          "Failed to hash password: Bcrypt internal error",
        );

        expect(mockedBcrypt.hash).toHaveBeenCalledWith(password, 10);
      });

      it("should handle bcrypt errors gracefully with non-Error instance", async () => {
        const password = "testPassword";
        const bcryptError = "String error from bcrypt";

        mockedBcrypt.hash.mockRejectedValue(bcryptError as never);

        await expect(hashPassword(password)).rejects.toThrow(
          "Failed to hash password: String error from bcrypt",
        );

        expect(mockedBcrypt.hash).toHaveBeenCalledWith(password, 10);
      });

      it("should handle bcrypt errors with null/undefined", async () => {
        const password = "testPassword";

        mockedBcrypt.hash.mockRejectedValue(null as never);
        await expect(hashPassword(password)).rejects.toThrow(
          "Failed to hash password: null",
        );

        mockedBcrypt.hash.mockRejectedValue(undefined as never);
        await expect(hashPassword(password)).rejects.toThrow(
          "Failed to hash password: undefined",
        );
      });

      it("should handle bcrypt errors with object", async () => {
        const password = "testPassword";
        const errorObj = { code: "ERR001", message: "Some bcrypt error" };

        mockedBcrypt.hash.mockRejectedValue(errorObj as never);

        await expect(hashPassword(password)).rejects.toThrow(
          "Failed to hash password: [object Object]",
        );
      });

      it("should handle bcrypt timeout or resource errors", async () => {
        const password = "testPassword";
        const timeoutError = new Error("Operation timed out");

        mockedBcrypt.hash.mockRejectedValue(timeoutError as never);

        await expect(hashPassword(password)).rejects.toThrow(
          "Failed to hash password: Operation timed out",
        );
      });
    });

    describe("Edge Cases", () => {
      it("should handle very long passwords", async () => {
        const longPassword = "a".repeat(1000);
        const expectedHash = "$2b$10$hashForLongPassword";

        mockedBcrypt.hash.mockResolvedValue(expectedHash as never);

        const result = await hashPassword(longPassword);

        expect(result).toBe(expectedHash);
        expect(mockedBcrypt.hash).toHaveBeenCalledWith(longPassword, 10);
      });

      it("should handle single character password", async () => {
        const singleChar = "a";
        const expectedHash = "$2b$10$hashForSingleChar";

        mockedBcrypt.hash.mockResolvedValue(expectedHash as never);

        const result = await hashPassword(singleChar);

        expect(result).toBe(expectedHash);
        expect(mockedBcrypt.hash).toHaveBeenCalledWith(singleChar, 10);
      });

      it("should handle passwords with only whitespace", async () => {
        const whitespacePassword = "   ";
        const expectedHash = "$2b$10$hashForWhitespace";

        mockedBcrypt.hash.mockResolvedValue(expectedHash as never);

        const result = await hashPassword(whitespacePassword);

        expect(result).toBe(expectedHash);
        expect(mockedBcrypt.hash).toHaveBeenCalledWith(whitespacePassword, 10);
      });

      it("should handle passwords with newlines and tabs", async () => {
        const specialCharsPassword = "password\\nwith\\ttabs";
        const expectedHash = "$2b$10$hashForSpecialChars";

        mockedBcrypt.hash.mockResolvedValue(expectedHash as never);

        const result = await hashPassword(specialCharsPassword);

        expect(result).toBe(expectedHash);
        expect(mockedBcrypt.hash).toHaveBeenCalledWith(
          specialCharsPassword,
          10,
        );
      });
    });

    describe("Return Value Validation", () => {
      it("should return exact hash from bcrypt", async () => {
        const password = "testPassword";
        const bcryptHashes = [
          "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
          "$2b$10$KCk9Gzg29vIkQbGwQmO.h.ZpCYDmtFb4cJnGEv.VPHiuiCTw8r2Nu",
          "$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLM",
        ];

        for (const hash of bcryptHashes) {
          mockedBcrypt.hash.mockResolvedValue(hash as never);

          const result = await hashPassword(password);

          expect(result).toBe(hash);
          expect(typeof result).toBe("string");

          jest.clearAllMocks();
        }
      });

      it("should handle empty string return from bcrypt (edge case)", async () => {
        const password = "testPassword";
        mockedBcrypt.hash.mockResolvedValue("" as never);

        const result = await hashPassword(password);

        expect(result).toBe("");
        expect(typeof result).toBe("string");
      });
    });

    describe("Concurrent Calls", () => {
      it("should handle multiple concurrent hash operations", async () => {
        const passwords = ["password1", "password2", "password3"];
        const expectedHashes = ["$2b$10$hash1", "$2b$10$hash2", "$2b$10$hash3"];

        mockedBcrypt.hash
          .mockResolvedValueOnce(expectedHashes[0] as never)
          .mockResolvedValueOnce(expectedHashes[1] as never)
          .mockResolvedValueOnce(expectedHashes[2] as never);

        const promises = passwords.map((password) => hashPassword(password));
        const results = await Promise.all(promises);

        expect(results).toEqual(expectedHashes);
        expect(mockedBcrypt.hash).toHaveBeenCalledTimes(3);
      });

      it("should handle mixed success and failure in concurrent calls", async () => {
        const passwords = ["password1", "password2", "password3"];

        mockedBcrypt.hash
          .mockResolvedValueOnce("$2b$10$hash1" as never)
          .mockRejectedValueOnce(new Error("Bcrypt error") as never)
          .mockResolvedValueOnce("$2b$10$hash3" as never);

        const promises = passwords.map((password) => hashPassword(password));

        const results = await Promise.allSettled(promises);

        expect(results[0].status).toBe("fulfilled");
        expect(results[1].status).toBe("rejected");
        expect(results[2].status).toBe("fulfilled");

        expect((results[0] as PromiseFulfilledResult<string>).value).toBe(
          "$2b$10$hash1",
        );
        expect((results[2] as PromiseFulfilledResult<string>).value).toBe(
          "$2b$10$hash3",
        );
      });
    });
  });
});
