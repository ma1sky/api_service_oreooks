import type { Response, Request } from "express"

export const authToken = (req: Request, res: Response) => {
    return res.status(200);
}