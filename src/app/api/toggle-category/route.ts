import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/server/db";
import type { UserCategory } from "@prisma/client";

interface RequestBody {
  userId: string;
  categoryId: number;
  isChecked: boolean;
}

export async function POST(req: NextRequest) {

  const { userId, categoryId, isChecked } : RequestBody = await req.json() as RequestBody;

  try {
    const userCategory : UserCategory = await db.userCategory.upsert({
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
