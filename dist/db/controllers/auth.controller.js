import { AuthRequestSchema } from "../../config/schemas.js";
import userService from "../repository/user.repository.js";
import authService from "../../services/auth.service.js";
export const auth = async (req, res) => {
    try {
        const parsed = AuthRequestSchema.safeParse(req.body);
        if (!parsed.success) {
            const errors = parsed.error.flatten().fieldErrors;
            if (errors.login || errors.password) {
                return res.status(404).json({
                    success: false,
                    message: "Пустой логин или пароль"
                });
            }
            return res.status(400).json({
                success: false,
                message: "Неправильное тело запроса",
                errors
            });
        }
        const { login, password, tg_id } = parsed.data;
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Ошибка"
        });
    }
};
//# sourceMappingURL=auth.controller.js.map