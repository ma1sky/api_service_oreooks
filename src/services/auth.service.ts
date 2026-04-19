import { ORIOKS_LINK } from "../config/env.config.js"
import { AuthResponseSchema } from "../config/schemas.js";

class AuthService {
    async getToken(login: string, password: string): Promise<string> {
        const authString = Buffer.from(`${login}:${password}`).toString("base64");

        try {
            const res = await fetch(`${ORIOKS_LINK}/api/v1/auth`, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Basic ${authString}`,
                    "User-Agent": "Oreooks-bot/v1 Windows 11"
                }
            });

            if (res.status === 401) {
                throw new Error("Неверный логин или пароль");
            }

            if (res.status === 403) {
                throw new Error("Невозможно получить больше 8 токенов");
            }

            if (res.status !== 200) {
                throw new Error(`Ошибка API: ${res.status}`);
            }

            const data = await res.json();

            const parsed = AuthResponseSchema.safeParse(data);

            if (!parsed.success) {
                throw new Error("API вернул невалидный JSON");
            }

            return parsed.data.token;

        } catch (error) {
            throw new Error("Ошибка сети при запросе токена");
        }
    }
}

export default new AuthService();