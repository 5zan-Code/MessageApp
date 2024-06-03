import {z} from 'zod'

export const usernameValidation = z.object({
    username: z
    .string()
    .min(6, 'Username must be no less than 6 chars')
    .max(20, 'Username must be no more that 20 chars')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special chars')
})


export const signupSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(6, {message: "Password should be at least 6 characters"}) 
})