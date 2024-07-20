import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {

  // const userId = req.headers.get("user-id");
  // if (!userId) {
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  // }

  const { userId, categoryId, isChecked } = await req.json();

  try {
    const userCategory = await prisma.userCategory.upsert({
      where: {
        userId_categoryId: {
          userId: parseInt(userId, 10),
          categoryId,
        },
      },
      update: { isChecked },
      create: {
        userId: parseInt(userId, 10),
        categoryId,
        isChecked,
      },
    });

    return NextResponse.json(userCategory, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
        return NextResponse.json({ error: "Unknown error while updating category" }, { status: 500 });
    }
  }
}
