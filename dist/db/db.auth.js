import prisma from "./prisma.js";
export function getUser(id) {
    const user = prisma.users.findUnique({
        where: {
            tg_id: id
        }
    });
}
//# sourceMappingURL=db.auth.js.map