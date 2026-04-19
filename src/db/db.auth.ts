import prisma from "./prisma.js";

export async function getUser(id: number): Promise<string> {
    const user = await prisma.users.findUnique({
        where: {
            tg_id: id
        }
    })

    return JSON.stringify(user);
}