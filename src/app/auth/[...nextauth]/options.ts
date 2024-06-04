import { NextAuthOptions } from "next-auth";    
import Credentials, { CredentialsProvider } from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";



export const authOption : NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any): Promise<any>{
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: credentials.identifier.email},{username: credentials.identifier.username}
                        ]
                    })
                    if(!user){
                        throw new Error("No user found!")
                    }
                    if(!user.isVerified){
                        throw new Error("Please verify your account before login!")
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password )
                    if(isPasswordCorrect){
                        return user
                    }else{
                        throw new Error("Password is incorrect!")
                    }
                } catch (err: any) {
                    throw new Error(err)
                }
            }
        })
    ],
    pages: {
        signIn: '/sign-in',
        signOut: '/sign-out'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks:{
        async session({session, token }) {
            if(token){
                session.user._id = token._id,
                session.user.isVerified = token.isVerified,
                session.user.isAcceptingMessage = token.isAcceptingMessage,
                session.user.username = token.username
            }
            return session
        },
        async jwt({token, user}){
            
            if(user){
                token._id = user._id?.toString()
                token.isVerified = user.isVerified,
                token.isAcceptingMessage = user.isAcceptingMessage,
                token.username = user.username
            }

            return token
        }
    }

    }