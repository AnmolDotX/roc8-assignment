import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { toast } from "sonner";

export async function middleware(req: NextRequest) {

  const path = req.nextUrl.pathname;
  const isPublicPath = path === '/login' || path == "/signup" || path == "/signup/validate-otp";
  const accessToken = req.cookies.get("accessToken")?.value ?? '';

  if (!accessToken && !isPublicPath) {
    toast.error("Unauthorized")
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if (accessToken && isPublicPath) {
    toast.error("You can't go to login or Signup page without logout")
    return NextResponse.redirect(new URL('/', req.nextUrl))
  }
}

export const config = {
  matcher: [
    '/',
    '/signup',
    '/signup/validate-otp',
    '/login',
  ]
}
