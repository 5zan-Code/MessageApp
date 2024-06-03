import { User } from './../../../model/User';
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendVerficationEmail";
import exp from "constants";

export async function POST(request: Request){
    await dbConnect()

    try {

        const {username,email, password} = await request.json()

        const existingVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified:true
        })

        if(existingVerifiedByUsername){
            return Response.json({
                success: true,
                message: "Username is already taken"
            }, {status: 400})
        }

        const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(100000 + Math.random() * 90000).toString()
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "User already exists with this email"
                }, {status: 400})
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

                await existingUserByEmail.save()
            }
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                    username,
                    email,
                    hashedPassword,
                    isVerified: false,
                    verifyCode,
                    verifyCodeExpiry: expiryDate,
                    isAcceptingMessage: true,
                    message: []
            })

            await newUser.save()
        }

       // Send Verification email
       
       const emailResponse = await sendVerificationEmail(email,username, verifyCode)

       if(!emailResponse.success){
        Response.json({
            success: false,
            message: emailResponse.message
        }, {status: 500})
       }
       return Response.json({
        success: true,
        message: "User registered successfully, please verify your email"
    }, {status: 201})

    } catch (error) {
        console.error('Error registering user:', error)
        return Response.json({
            success: false,
            message: "Error registering user"
        },
        {
            status: 500
        }
    )     
    }
}