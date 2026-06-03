import { db } from "@/lib/db";
import { getAuthSession, unauthorized, forbidden, success, isSuperAdmin } from "@/lib/api-helpers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// GET /api/admins - Get all admins (Super Admin only)
export async function GET() {
  const session = await getAuthSession();
  if (!session) return unauthorized();
  if (!isSuperAdmin(session.user.role)) return forbidden();

  const admins = await db.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true, name: true, email: true, isActive: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return success(admins);
}

// POST /api/admins - Create new admin (Super Admin only)
export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session) return unauthorized();
  if (!isSuperAdmin(session.user.role)) return forbidden();

  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await db.user.create({
      data: { name, email, password: hashedPassword, role: "ADMIN" },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return success(admin, 201);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
