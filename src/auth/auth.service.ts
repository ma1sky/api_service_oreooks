import { ORIOKS_LINK } from "../config/env.config";
import { AuthResponseSchema } from "../config/schemas";

class AuthService {
    async getToken(login: string, password: string): Promise<string> {
        const authString = Buffer.from(`${login}:${password}`).toString("base64");
        
        // Ensure we use HTTPS and handle potential redirects
        const apiUrl = `${ORIOKS_LINK.replace('http://', 'https://')}/api/v1/auth`;
        
        const res = await fetch(apiUrl, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Basic ${authString}`,
                "User-Agent": "Oreooks-bot/1.0 Windows 11"
            },
            redirect: "follow" // Ensure redirects are followed
        });

        const data = await res.json().catch(() => null);

        switch (res.status) {
            case 400:
                throw new Error(data?.error?.text ?? "Некорректный запрос к серверу авторизации");
            case 401:
                throw new Error(data?.error ?? "Неверный логин или пароль");
            case 403:
                throw new Error(data?.error ?? "Лимит токенов исчерпан");
            case 404:
                throw new Error("Сервер авторизации не найден");
        }

        if (!res.ok) {
            const errorText = data?.error?.text || data?.error || data?.message || "Неизвестная ошибка";
            throw new Error(`Ошибка сервера авторизации (${res.status}): ${errorText}`);
        }

        const parsed = AuthResponseSchema.safeParse(data);

        if (!parsed.success) throw new Error("Сервер авторизации вернул невалидный ответ");

        return parsed.data.token;
    }
}

export default new AuthService();