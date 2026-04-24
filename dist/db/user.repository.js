import prisma from "./prisma.js";
import { Prisma } from "@prisma/client";
class UserRepository {
    async getUser(id) {
        try {
            return await prisma.user.findUnique({
                where: { tg_id: id }
            });
        }
        catch (error) {
            console.error("Ошибка получения пользоваля: ", error);
            throw new Error("Ошибка базы данных");
        }
    }
    async createUser(token, tg_id) {
        try {
            return await prisma.user.create({ data: { tg_id, token } });
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    throw new Error("Пользователь уже существует");
                }
            }
            console.error("Ошибка создания пользователя:", error);
            throw new Error("Ошибка базы данных");
        }
    }
}
export default new UserRepository();
//# sourceMappingURL=user.repository.js.map