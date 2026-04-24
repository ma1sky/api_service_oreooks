import { z } from "zod";

export const AuthResponseSchema = z.object({
    token: z.string()
})

export const AuthRequestSchema = z.object({
    login: z.string(),
    password: z.string(),
    tg_id: z.number()
})

export const CreateTaskSchema = z.object({
    title: z.string(),
    description: z.string(),
    date: z.date()
})