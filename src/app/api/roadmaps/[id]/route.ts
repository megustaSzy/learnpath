import { db } from "@/lib/db";
import { getAuthSession, unauthorized, forbidden, notFound, success, isAdmin } from "@/lib/api-helpers";
import { NextResponse } from "next/server";

// GET /api/roadmaps/[id] - Get roadmap detail with topics & resources
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const roadmap = await db.roadmap.findUnique({
    where: { id },
    include: {
      category: true,
      creator: { select: { id: true, name: true } },
      topics: {
        orderBy: { orderNumber: "asc" },
        include: {
          resources: true,
          _count: { select: { userProgress: true } },
        },
      },
      _count: { select: { userRoadmaps: true } },
    },
  });

  if (!roadmap) return notFound("Roadmap");
  return success(roadmap);
}

// PUT /api/roadmaps/[id] - Update roadmap (Admin only)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session) return unauthorized();
  if (!isAdmin(session.user.role)) return forbidden();

  const { id } = await params;
  const existing = await db.roadmap.findUnique({ where: { id } });
  if (!existing) return notFound("Roadmap");

  const body = await req.json();
  const updateData: any = { ...body };
  if (body.title) {
    updateData.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  }
  if (body.estimatedHours) updateData.estimatedHours = parseInt(body.estimatedHours);

  const roadmap = await db.roadmap.update({ where: { id }, data: updateData });
  return success(roadmap);
}

// DELETE /api/roadmaps/[id] - Delete roadmap (Admin only)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session) return unauthorized();
  if (!isAdmin(session.user.role)) return forbidden();

  const { id } = await params;
  const existing = await db.roadmap.findUnique({ where: { id } });
  if (!existing) return notFound("Roadmap");

  await db.roadmap.delete({ where: { id } });
  return success({ message: "Roadmap deleted" });
}
