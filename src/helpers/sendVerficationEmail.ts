import {resend} from '@/lib/resend'
import VerificationEmail from '../../emails/verificationEmail'  
import { ApiResponse } from '@/types/ApiResponse'


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try{
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Message App Verification Code',
            react: VerificationEmail({username, otp: verifyCode}),
          });
        return {success: true, message: "Verification email sent successfully"}
    }catch(emailError){
        console.error("Error sending verification email", emailError)
        return {success: false, message: "Fail to send verification email"}

    }
}



