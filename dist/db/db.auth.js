import prisma from "./prisma.js";
export async function getUser(id) {
    const user = await prisma.users.findUnique({
        where: {
            tg_id: id
        }
    });
    return JSON.stringify(user);
}
//# sourceMappingURL=db.auth.js.map