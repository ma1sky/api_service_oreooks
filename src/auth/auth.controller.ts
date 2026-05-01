import type { Response, Request } from "express";
import { AuthRequestSchema } from "../config/schemas";
import userService from "./auth.repository";
import authService from "./auth.service";

class AuthController {

}

export const auth = async (req: Request, res: Response) => {
    try {
        const { login, password, tg_id } = req.body;

        const existingUser = await userService.getUser(tg_id);

        if (!existingUser) {
            const token = await authService.getToken(login, password);

            await userService.createUser(token, tg_id);

            return res.status(201).json({
                success: true,
                token
            });
        }

        return res.status(200).json({
            success: true,
            message: "Пользователь уже существует"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Ошибка"
        });
    }
};