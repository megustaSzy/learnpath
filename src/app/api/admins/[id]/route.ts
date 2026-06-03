import { db } from "@/lib/db";
import { getAuthSession, unauthorized, forbidden, notFound, success, isSuperAdmin } from "@/lib/api-helpers";
import { NextResponse } from "next/server";

// PUT /api/admins/[id] - Update admin (Super Admin only)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session) return unauthorized();
  if (!isSuperAdmin(session.user.role)) return forbidden();

  const { id } = await params;
  const existing = await db.user.findFirst({ where: { id, role: "ADMIN" } });
  if (!existing) return notFound("Admin");

  const body = await req.json();
  const updateData: any = {};
  if (body.name) updateData.name = body.name;
  if (typeof body.isActive === "boolean") updateData.isActive = body.isActive;

  const admin = await db.user.update({
    where: { id },
    data: updateData,
    select: { id: true, name: true, email: true, isActive: true },
  });
  return success(admin);
}

// DELETE /api/admins/[id] - Remove admin (Super Admin only)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session) return unauthorized();
  if (!isSuperAdmin(session.user.role)) return forbidden();

  const { id } = await params;
  const existing = await db.user.findFirst({ where: { id, role: "ADMIN" } });
  if (!existing) return notFound("Admin");

  await db.user.delete({ where: { id } });
  return success({ message: "Admin removed" });
}
