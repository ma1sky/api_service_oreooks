import type { Response, Request } from "express";
import userService from "../db/user.repository.js";
import authService from "../services/auth.service.js";

export const auth = async (req: Request, res: Response) => {
    try {
        const { login, password, id } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Неверный ID пользователя"
            });
        }

        const existingUser = await userService.getUser(id);

        if (!existingUser) {
            const token = await authService.getToken(login, password);

            await userService.createUser(token, id);

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
            message: error
        });
    }
};