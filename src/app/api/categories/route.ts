import { db } from "@/lib/db";
import { getAuthSession, unauthorized, forbidden, success, isAdmin } from "@/lib/api-helpers";
import { NextResponse } from "next/server";

// GET /api/categories - Get all categories
export async function GET() {
  const categories = await db.roadmapCategory.findMany({ orderBy: { name: "asc" } });
  return success(categories);
}

// POST /api/categories - Create category (Admin only)
export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session) return unauthorized();
  if (!isAdmin(session.user.role)) return forbidden();

  try {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ message: "Name is required" }, { status: 400 });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const category = await db.roadmapCategory.create({ data: { name, slug } });
    return success(category, 201);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
