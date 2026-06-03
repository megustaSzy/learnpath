import { db } from "@/lib/db";
import { getAuthSession, unauthorized, forbidden, notFound, success, isSuperAdmin } from "@/lib/api-helpers";
import { NextResponse } from "next/server";

// GET /api/users/[id] - Get user detail (Super Admin only)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session) return unauthorized();
  if (!isSuperAdmin(session.user.role)) return forbidden();

  const { id } = await params;
  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, email: true, role: true, isActive: true,
      bio: true, githubUrl: true, linkedinUrl: true, createdAt: true,
      _count: { select: { userRoadmaps: true, weeklyGoals: true, achievements: true } },
    },
  });
  if (!user) return notFound("User");
  return success(user);
}

// PUT /api/users/[id] - Update user role / toggle active (Super Admin only)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session) return unauthorized();
  if (!isSuperAdmin(session.user.role)) return forbidden();

  const { id } = await params;
  const existing = await db.user.findUnique({ where: { id } });
  if (!existing) return notFound("User");

  const body = await req.json();
  const updateData: any = {};

  if (body.role && ["USER", "ADMIN", "SUPER_ADMIN"].includes(body.role)) {
    updateData.role = body.role;
  }
  if (typeof body.isActive === "boolean") {
    updateData.isActive = body.isActive;
  }

  const user = await db.user.update({
    where: { id },
    data: updateData,
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });
  return success(user);
}

// DELETE /api/users/[id] - Delete user (Super Admin only)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session) return unauthorized();
  if (!isSuperAdmin(session.user.role)) return forbidden();

  const { id } = await params;
  if (id === session.user.id) {
    return NextResponse.json({ message: "Cannot delete yourself" }, { status: 400 });
  }

  const existing = await db.user.findUnique({ where: { id } });
  if (!existing) return notFound("User");

  await db.user.delete({ where: { id } });
  return success({ message: "User deleted" });
}
