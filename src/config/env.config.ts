import dotenv from 'dotenv';
dotenv.config()

export const PORT: number = Number.parseInt(process.env.PORT as string) ?? 3000;
export const DATABASE_URL: string = process.env.DATABASE_URL as string;
export const WORKER_LINK: string = process.env.WORKER_LINK as string;