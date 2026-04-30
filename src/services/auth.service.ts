import { ORIOKS_LINK } from "../config/env.config";
import { AuthResponseSchema } from "../config/schemas";

class AuthService {
    async getToken(login: string, password: string): Promise<string> {
        const authString = Buffer.from(`${login}:${password}`).toString("base64");

        const res = await fetch(`${ORIOKS_LINK}/api/v1/auth`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Basic ${authString}`,
                "User-Agent": "Oreooks-bot/1.0 Windows 11"
            }
        });

        const data = await res.json().catch(() => null);

        if (res.status === 401) {
            throw new Error(data?.error ?? "Неверный логин или пароль");
        }

        if (res.status === 403) {
            throw new Error(data?.error ?? "Лимит токенов исчерпан");
        }

        if (!res.ok) {
            throw new Error(`API error ${res.status}: ${JSON.stringify(data)}`);
        }

        const parsed = AuthResponseSchema.safeParse(data);

        if (!parsed.success) {
            throw new Error("API вернул невалидный JSON");
        }

        return parsed.data.token;
    }
}

export default new AuthService();