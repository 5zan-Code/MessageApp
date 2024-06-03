import {z} from 'zod'

export const verifySchema = z.object({
    code: z.string().length(6, {message:'Length should 6 characters'})
    
})