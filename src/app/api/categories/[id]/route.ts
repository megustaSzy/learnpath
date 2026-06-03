import { db } from "@/lib/db";
import { getAuthSession, unauthorized, forbidden, notFound, success, isAdmin } from "@/lib/api-helpers";
import { NextResponse } from "next/server";

// PUT /api/categories/[id] - Update category
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session) return unauthorized();
  if (!isAdmin(session.user.role)) return forbidden();

  const { id } = await params;
  const { name } = await req.json();
  if (!name) return NextResponse.json({ message: "Name is required" }, { status: 400 });

  const existing = await db.roadmapCategory.findUnique({ where: { id } });
  if (!existing) return notFound("Category");

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  const category = await db.roadmapCategory.update({ where: { id }, data: { name, slug } });
  return success(category);
}

// DELETE /api/categories/[id] - Delete category
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session) return unauthorized();
  if (!isAdmin(session.user.role)) return forbidden();

  const { id } = await params;
  const existing = await db.roadmapCategory.findUnique({ where: { id } });
  if (!existing) return notFound("Category");

  await db.roadmapCategory.delete({ where: { id } });
  return success({ message: "Category deleted" });
}
