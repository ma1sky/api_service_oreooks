import type { Response } from 'express';
export declare function badRequest(res: Response, message: string): Response<any, Record<string, any>>;
export declare function notFound(res: Response, message: string): Response<any, Record<string, any>>;
export declare function serverError(res: Response, error: unknown): Response<any, Record<string, any>>;
export declare function ok(res: Response, data: any): Response<any, Record<string, any>>;
export declare function created(res: Response, data: any): Response<any, Record<string, any>>;
export declare function parseId(value: string): number | null;
//# sourceMappingURL=controller.helpers.d.ts.map