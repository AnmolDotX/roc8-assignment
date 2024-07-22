import { db } from "@/server/db";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/helpers/tokenManager";
import { CustomError, isError } from "@/lib/errors";
import type { User } from "@prisma/client";

const generateAccessAndRefereshTokens = async (user: User) => {
  try {
    const accessToken : string = generateAccessToken(user);

    const refreshToken : string = generateRefreshToken(user);

    await db.user.update({
      where: { id : user?.id },
      data: {
        refreshToken,
      },
    });

    return { accessToken, refreshToken };
  } catch (error: unknown) {
    throw new CustomError(
      "Something went wrong while generating referesh and access token",
    );
  }
};

interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } : LoginRequestBody = await req.json() as LoginRequestBody;

    const user : User | null = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User does not exist" }
      );
    }

    const isPasswordCorrect : boolean = await bcrypt.compare(password, user.password);
    console.log(isPasswordCorrect);
    
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { success: false, message: "Invalid Password" }
      );
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user);

    const loggedInUser = await db.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        name: true,
        refreshToken: true,
        email: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        checkedCategories : true
      },
    });

    const options = {
      httpOnly: true,
      secure: true,
    };

    const response = NextResponse.json(
      {
        success: true,
        message: "user logged in successfully",
        user: loggedInUser,
      },
      {
        status: 200,
      },
    );
    response.cookies.set("accessToken", accessToken, options);
    response.cookies.set("refreshToken", refreshToken, options);
    response.headers.set("Location", "/");
    return response;
  } catch (error: unknown) {
    if (isError(error)) {
      
      return NextResponse.json(
        { success: false, message: error.message }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "An unknown error occurred" }
      );
    }
  }
}
