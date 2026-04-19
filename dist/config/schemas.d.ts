import { z } from "zod";
export declare const AuthResponseSchema: z.ZodObject<{
    token: z.ZodString;
}, z.core.$strip>;
export declare const AuthRequestSchema: z.ZodObject<{
    login: z.ZodString;
    password: z.ZodString;
    tg_id: z.ZodNumber;
}, z.core.$strip>;
//# sourceMappingURL=schemas.d.ts.map