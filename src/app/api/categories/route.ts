import { db } from "@/server/db";
import type {NextRequest} from 'next/server'
import { NextResponse } from "next/server";
import type { Category } from "@prisma/client";

interface CategoryWithChecked extends Category {
  isChecked: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: {
    categories: CategoryWithChecked[];
    pagination: {
      page: number;
      limit: number;
      totalCategories: number;
      totalPages: number;
    };
  };
  error?: string;
}

interface RequestBody {
  userId : number
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') ?? '1');
    const limit = parseInt(url.searchParams.get('limit') ?? '6');
    const skip = (page - 1) * limit;
    const { userId } : RequestBody = await req.json() as RequestBody;

    const [categories, totalCategories, user] = await Promise.all([
      db.category.findMany({
        skip,
        take: limit,
      }),
      db.category.count(),
      userId ? db.user.findUnique({
        where: { id: userId },
        select: { checkedCategories: { select: { categoryId: true } } }
      }) : null
    ]);

    const totalPages = Math.ceil(totalCategories / limit);

    if (!categories) {
      return NextResponse.json({
        success: false,
        message: "No categories available!"
      }, { status: 400 });
    }

    const checkedCategoryIds = user ? user.checkedCategories.map(uc => uc.categoryId) : [];

    const categoriesWithCheckedStatus: CategoryWithChecked[] = categories.map(category => ({
      ...category,
      isChecked: checkedCategoryIds.includes(category.id)
    }));

    return NextResponse.json({
      success: true,
      message: "Categories loaded successfully",
      data: {
        categories: categoriesWithCheckedStatus,
        pagination: {
          page,
          limit,
          totalCategories,
          totalPages,
        }
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ success: false, message: "Unknown error while loading categories" }, { status: 500 });
    }
  }
}
