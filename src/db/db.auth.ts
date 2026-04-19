import prisma from "./prisma.js";

export function getUser(id: number) {
    const user = prisma.users.findUnique({
        where: {
            tg_id: id
        }
    })
}