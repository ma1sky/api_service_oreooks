import prisma from "./prisma";
import type { User } from "../config/types";
import { Prisma } from "@prisma/client";

class UserRepository {
    async getUser(id: number): Promise<User | null> {
        try {
            return await prisma.user.findFirst({
            });
        } catch (error) {
            console.error("Ошибка получения пользоваля: ", error);
            throw new Error("Ошибка базы данных");
        }
    }

    async createUser(token: string, tg_id: number): Promise<User> {
        try {
            return await prisma.user.create({ data: { tg_id, token } });

        } catch (error) {

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