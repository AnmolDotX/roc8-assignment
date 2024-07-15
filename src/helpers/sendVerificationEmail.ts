import { EmailTemplate } from "emails/EmailTemplate";
import dotenv from "dotenv";
import { resend } from "@/lib/resend";

interface propData {
  email: string;
  name: string;
  otp: number;
}

dotenv.config();

export async function sendVerificationEmail({ email, name, otp }: propData) {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "OTP Verification for roc8-ecommerce app",
      react: EmailTemplate({ name, email, otp }) as React.ReactElement,
    });
    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return {
      success: false,
      message: "Failed to send verification email by resend",
    };
  }
}
