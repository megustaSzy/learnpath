import { db } from "@/lib/db";
import { getAuthSession, unauthorized, forbidden, notFound, success, isAdmin } from "@/lib/api-helpers";
import { NextResponse } from "next/server";

// POST /api/topics/[id]/resources - Add resource to topic (Admin only)
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session) return unauthorized();
  if (!isAdmin(session.user.role)) return forbidden();

  const { id } = await params;
  const topic = await db.roadmapTopic.findUnique({ where: { id } });
  if (!topic) return notFound("Topic");

  try {
    const { title, url, resourceType } = await req.json();
    if (!title || !url || !resourceType) {
      return NextResponse.json({ message: "Title, url, and resourceType are required" }, { status: 400 });
    }

    const resource = await db.topicResource.create({
      data: { topicId: id, title, url, resourceType },
    });
    return success(resource, 201);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE /api/topics/[id]/resources?resourceId=xxx - Delete resource
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session) return unauthorized();
  if (!isAdmin(session.user.role)) return forbidden();

  const { searchParams } = new URL(req.url);
  const resourceId = searchParams.get("resourceId");
  if (!resourceId) return NextResponse.json({ message: "resourceId is required" }, { status: 400 });

  const resource = await db.topicResource.findUnique({ where: { id: resourceId } });
  if (!resource) return notFound("Resource");

  await db.topicResource.delete({ where: { id: resourceId } });
  return success({ message: "Resource deleted" });
}
