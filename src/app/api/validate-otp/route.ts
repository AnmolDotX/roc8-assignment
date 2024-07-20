import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/server/db";
import bcrypt from "bcrypt";
import { isError } from "@/lib/errors";
import type { TempUser, UserCategory } from "@prisma/client";

interface NewUser {
  id : number | string,
  email : string,
  name : string, 
  emailVerified : boolean,
  checkedCategories : UserCategory[],
  createdAt : Date,
  updatedAt : Date
}

interface RequestBody {
  email : string;
  otp : number
}

export async function POST(req: NextRequest) {
  const { email, otp } : RequestBody = await req.json() as RequestBody;
  try {
    const tempUser : TempUser | null = await db.tempUser.findUnique({
      where: { email },
    });

    if (tempUser && tempUser.otp === otp) {
      const hashedPassword = await bcrypt.hash(tempUser.password, 10);

      let newUser : NewUser | null = null;
      if (hashedPassword) {
        newUser = await db.user.create({
          data: {
            email: tempUser.email,
            name: tempUser.username,
            password: hashedPassword,
            emailVerified : true
          },
          select : {
            password : false,
            name : true,
            id : true,
            email : true,
            emailVerified : true,
            checkedCategories : true,
            createdAt : true,
            updatedAt : true
          }
        });
      }

      await db.tempUser.delete({
        where: { email: tempUser.email },
      });

      return NextResponse.json({
        success: true,
        message: "New user registered successfully!",
        user: newUser,
      });
    } else {
      return NextResponse.json({ success: false, message: "Invalid OTP" });
    }
  } catch (error: unknown) {
    if (isError(error)) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 },
      );
    } else {
      return NextResponse.json(
        { success: false, message: "An unknown error occurred" },
        { status: 500 },
      );
    }
  }
}
