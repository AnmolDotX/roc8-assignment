import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  // const userId = req.headers.get("user-id");
  // if (!userId) {
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  // }

  const {userId} = await req.json();

  try {
    const checkedCategories = await db.userCategory.findMany({
      where: {
        userId: parseInt(userId, 10),
        isChecked: true,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(checkedCategories, { status: 200 });
  } catch (error) {
    if(error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
        return NextResponse.json({ error: "Unkown error while getting checked categories" }, { status: 500 });
    }
  }
}
