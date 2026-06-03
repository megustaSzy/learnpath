import { db } from "@/lib/db";
import { getAuthSession, unauthorized, forbidden, success, isAdmin } from "@/lib/api-helpers";
import { NextResponse } from "next/server";

// GET /api/roadmaps - Get all roadmaps
export async function GET() {
  const roadmaps = await db.roadmap.findMany({
    include: {
      category: true,
      creator: { select: { id: true, name: true } },
      _count: { select: { topics: true, userRoadmaps: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return success(roadmaps);
}

// POST /api/roadmaps - Create roadmap (Admin only)
export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session) return unauthorized();
  if (!isAdmin(session.user.role)) return forbidden();

  try {
    const { title, description, categoryId, difficulty, estimatedHours } = await req.json();
    if (!title || !categoryId) {
      return NextResponse.json({ message: "Title and categoryId are required" }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const roadmap = await db.roadmap.create({
      data: {
        title,
        slug,
        description,
        categoryId,
        difficulty: difficulty || "BEGINNER",
        estimatedHours: estimatedHours ? parseInt(estimatedHours) : null,
        createdBy: session.user.id,
      },
    });
    return success(roadmap, 201);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
