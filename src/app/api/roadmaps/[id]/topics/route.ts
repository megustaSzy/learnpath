import { db } from "@/lib/db";
import { getAuthSession, unauthorized, forbidden, notFound, success, isAdmin } from "@/lib/api-helpers";
import { NextResponse } from "next/server";

// GET /api/roadmaps/[id]/topics - Get topics for a roadmap
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const roadmap = await db.roadmap.findUnique({ where: { id } });
  if (!roadmap) return notFound("Roadmap");

  const topics = await db.roadmapTopic.findMany({
    where: { roadmapId: id },
    orderBy: { orderNumber: "asc" },
    include: { resources: true },
  });
  return success(topics);
}

// POST /api/roadmaps/[id]/topics - Create topic (Admin only)
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session) return unauthorized();
  if (!isAdmin(session.user.role)) return forbidden();

  const { id } = await params;
  const roadmap = await db.roadmap.findUnique({ where: { id } });
  if (!roadmap) return notFound("Roadmap");

  try {
    const { title, description, orderNumber, estimatedHours } = await req.json();
    if (!title || !orderNumber) {
      return NextResponse.json({ message: "Title and orderNumber are required" }, { status: 400 });
    }

    const topic = await db.roadmapTopic.create({
      data: {
        roadmapId: id,
        title,
        description,
        orderNumber: parseInt(orderNumber),
        estimatedHours: estimatedHours ? parseInt(estimatedHours) : null,
      },
    });
    return success(topic, 201);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
