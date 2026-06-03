import { db } from "@/lib/db";
import { getAuthSession, unauthorized, forbidden, success, isSuperAdmin } from "@/lib/api-helpers";
import { NextResponse } from "next/server";

// GET /api/users - Get all users (Super Admin only)
export async function GET(req: Request) {
  const session = await getAuthSession();
  if (!session) return unauthorized();
  if (!isSuperAdmin(session.user.role)) return forbidden();

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";

  const users = await db.user.findMany({
    where: search ? {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    } : undefined,
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return success(users);
}
