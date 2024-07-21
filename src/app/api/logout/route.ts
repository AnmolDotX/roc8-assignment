import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    response.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: true,
      path: "/",
      expires: new Date(0), 
    });
    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: true,
      path: "/",
      expires: new Date(0),
    });

    response.headers.set("Location", "/login");

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to log out" }
    );
  }
}
