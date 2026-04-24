import type { Request, Response } from 'express';
export declare const getTasksByUser: (req: Request<{
    tgId: string;
}>, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createTask: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getTaskById: (req: Request<{
    id: string;
}>, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateTask: (req: Request<{
    id: string;
}>, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteTask: (req: Request<{
    tgId: string;
    id: string;
}>, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=task.controller.d.ts.map