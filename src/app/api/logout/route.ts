import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest) {
    NextResponse.json("hello logout endpoint is in developement")
}