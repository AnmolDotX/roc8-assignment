import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";
import { generateAccessToken, generateRefreshToken } from "@/helpers/tokenManager";
import { isError } from "@/lib/errors";
import { User } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { token } : {token : string} = await req.json();

    const user : User | null = await db.user.findFirst({
      where: { refreshToken: token }
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid refresh token" }, { status: 401 });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await db.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    return NextResponse.json({
      success: true,
      accessToken,
      refreshToken
    });

  } catch (error) {
    if (isError(error)) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ success: false, message: "An unknown error occurred" }, { status: 500 });
    }
  }
}
