import {z} from 'zod'

export const messageSchema = z.object({
    content: z
    .string()
    .min(8, {message:'Content must be at least 8 characters'})
    .max(300,{message:'Content must no longer than 300 characters'})
})