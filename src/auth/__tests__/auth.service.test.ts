import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import AuthService from "../auth.service";

// Mock environment variable
jest.mock("../../config/env.config", () => ({
  ORIOKS_LINK: "https://orioks.miet.ru",
}));

describe("AuthService", () => {
  let mockFetch: jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
    jest.clearAllMocks();
  });

  describe("getToken", () => {
    it("should return token on successful authentication", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({ token: "valid-token" }),
      } as any;
      mockFetch.mockResolvedValue(mockResponse);

      const token = await AuthService.getToken("login", "password");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://orioks.miet.ru/api/v1/auth",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization:
              "Basic " + Buffer.from("login:password").toString("base64"),
            "User-Agent": "Oreooks-bot/1.0 Windows 11",
          },
          redirect: "follow",
        },
      );
      expect(token).toBe("valid-token");
    });

    it("should throw error on 400 status", async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        json: async () => ({ error: { text: "Bad request" } }),
      } as any;
      mockFetch.mockResolvedValue(mockResponse);

      await expect(AuthService.getToken("login", "password")).rejects.toThrow(
        "Bad request",
      );
    });

    it("should throw error on 401 status", async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        json: async () => ({ error: "Invalid credentials" }),
      } as any;
      mockFetch.mockResolvedValue(mockResponse);

      await expect(AuthService.getToken("login", "password")).rejects.toThrow(
        "Invalid credentials",
      );
    });

    it("should throw error on 403 status", async () => {
      const mockResponse = {
        ok: false,
        status: 403,
        json: async () => ({ error: "Token limit exceeded" }),
      } as any;
      mockFetch.mockResolvedValue(mockResponse);

      await expect(AuthService.getToken("login", "password")).rejects.toThrow(
        "Token limit exceeded",
      );
    });

    it("should throw error on 404 status", async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        json: async () => null,
      } as any;
      mockFetch.mockResolvedValue(mockResponse);

      await expect(AuthService.getToken("login", "password")).rejects.toThrow(
        "Сервер авторизации не найден",
      );
    });

    it("should throw generic error on other non-ok status", async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        json: async () => ({ error: { text: "Internal server error" } }),
      } as any;
      mockFetch.mockResolvedValue(mockResponse);

      await expect(AuthService.getToken("login", "password")).rejects.toThrow(
        "Ошибка сервера авторизации (500): Internal server error",
      );
    });

    it("should throw error when response JSON is invalid", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => {
          throw new Error("JSON parse error");
        },
      } as any;
      mockFetch.mockResolvedValue(mockResponse);

      await expect(AuthService.getToken("login", "password")).rejects.toThrow(
        "Сервер авторизации вернул невалидный ответ",
      );
    });

    it("should throw error when response does not match schema", async () => {
      const mockResponse = {
        ok: true,
        status: 200,
        json: async () => ({ invalid: "data" }),
      } as any;
      mockFetch.mockResolvedValue(mockResponse);

      await expect(AuthService.getToken("login", "password")).rejects.toThrow(
        "Сервер авторизации вернул невалидный ответ",
      );
    });
  });
});
