import { resend } from "@/lib/resend";
import dotenv from "dotenv";
import { EmailTemplate } from "emails/EmailTemplate";

interface propData {
  email: string;
  name: string;
  otp: number;
}

dotenv.config();

export async function sendVerificationEmail({ email, name, otp }: propData) {
  try {
    const { data } = await resend.emails.send({
      from: 'OTP <roc8_ecommerce@noobx.in>',
      to: email,
      subject: 'ecommerce roc8 validation OTP',
      react: EmailTemplate({ name, email, otp }),
    });
    console.log(data);

    if (data) {
      return {
        success: true,
        message: "Verification email sent successfully.",
      };
    }
    return {
      success : false,
      message : "can't able to send email!"
    }
  } catch (error) {
    if(error instanceof Error) {
      return {
        success : false,
        message : error.message
      }
    } else {
      return {
        success: false,
        message: "Failed to send verification email by resend",
      };
    }
    
  }
}
