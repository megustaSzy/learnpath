import { db } from "@/lib/db";
import { getAuthSession, unauthorized, success } from "@/lib/api-helpers";
import { NextResponse } from "next/server";

// GET /api/profile - Get user profile
export async function GET() {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, name: true, email: true, avatar: true, bio: true,
      githubUrl: true, linkedinUrl: true, role: true, isActive: true, createdAt: true,
    },
  });
  return success(user);
}

// PUT /api/profile - Update user profile
export async function PUT(req: Request) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  try {
    const { name, bio, githubUrl, linkedinUrl } = await req.json();
    const user = await db.user.update({
      where: { id: session.user.id },
      data: { name, bio, githubUrl, linkedinUrl },
      select: {
        id: true, name: true, email: true, avatar: true, bio: true,
        githubUrl: true, linkedinUrl: true, role: true, createdAt: true,
      },
    });
    return success(user);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
