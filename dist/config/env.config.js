import dotenv from 'dotenv';
dotenv.config();
export const PORT = Number.parseInt(process.env.PORT) ?? 3000;
export const DATABASE_URL = process.env.DATABASE_URL;
export const WORKER_LINK = process.env.WORKER_LINK;
//# sourceMappingURL=env.config.js.map