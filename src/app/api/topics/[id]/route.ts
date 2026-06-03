import { db } from "@/lib/db";
import { getAuthSession, unauthorized, forbidden, notFound, success, isAdmin } from "@/lib/api-helpers";
import { NextResponse } from "next/server";

// GET /api/topics/[id] - Get topic detail
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const topic = await db.roadmapTopic.findUnique({
    where: { id },
    include: { resources: true, roadmap: { select: { id: true, title: true, slug: true } } },
  });
  if (!topic) return notFound("Topic");
  return success(topic);
}

// PUT /api/topics/[id] - Update topic (Admin only)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session) return unauthorized();
  if (!isAdmin(session.user.role)) return forbidden();

  const { id } = await params;
  const existing = await db.roadmapTopic.findUnique({ where: { id } });
  if (!existing) return notFound("Topic");

  const body = await req.json();
  const topic = await db.roadmapTopic.update({ where: { id }, data: body });
  return success(topic);
}

// DELETE /api/topics/[id] - Delete topic (Admin only)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session) return unauthorized();
  if (!isAdmin(session.user.role)) return forbidden();

  const { id } = await params;
  const existing = await db.roadmapTopic.findUnique({ where: { id } });
  if (!existing) return notFound("Topic");

  await db.roadmapTopic.delete({ where: { id } });
  return success({ message: "Topic deleted" });
}
