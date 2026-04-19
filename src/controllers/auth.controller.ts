import type { Response, Request } from "express"

export const auth = (req: Request, res: Response) => {
    return res.status(200);
}