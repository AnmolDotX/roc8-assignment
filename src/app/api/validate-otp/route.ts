import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import bcrypt from "bcrypt";
import { isError } from "@/lib/errors";

export async function POST(req: NextRequest) {
  const { email, otp } = await req.json();
  try {
    const tempUser = await db.tempUser.findUnique({
      where: { email },
    });

    if (tempUser && tempUser.otp === otp) {
      const hashedPassword = await bcrypt.hash(tempUser.password, 10);

      let newUser;
      if (hashedPassword) {
        newUser = await db.user.create({
          data: {
            email: tempUser.email,
            name: tempUser.username,
            password: hashedPassword,
            emailVerified : true
          },
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
