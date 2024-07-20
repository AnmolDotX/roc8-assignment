import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { isError } from "@/lib/errors";
import { db } from "@/server/db";
import type { TempUser, User } from "@prisma/client";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface emailResponseType {
  success : boolean;
  message : string;
}

interface SignupRequestBody {
  name : string,
  email : string,
  password : string
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } : SignupRequestBody = await req.json() as SignupRequestBody;

    const newOTP = Math.floor(100000 + Math.random() * 900000);

    const existingUserByEmail : User | null = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exists",
        },
        {
          status: 400,
        }
      );
    }

    const {success, message} : emailResponseType = await sendVerificationEmail({
      email,
      name,
      otp: newOTP,
    });

    if (!success) {
      return NextResponse.json(
        {
          success,
          message: `Error sending email for OTP: ${message}`,
        },
        {
          status: 500,
        }
      );
    }

    const tempUserStored : TempUser = await db.tempUser.create({
      data: {
        email,
        username: name,
        password,
        otp: newOTP,
      },
    });

    if (!tempUserStored) {
      return NextResponse.json(
        {
          success: false,
          message: "Error creating temporary user!",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent successfully!",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (isError(error)) {
      console.log(error);
      
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
