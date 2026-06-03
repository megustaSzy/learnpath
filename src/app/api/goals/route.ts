import { db } from "@/lib/db";
import { getAuthSession, unauthorized, success } from "@/lib/api-helpers";
import { NextResponse } from "next/server";

// GET /api/goals - Get user's weekly goals
export async function GET() {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const goals = await db.weeklyGoal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
  return success(goals);
}

// POST /api/goals - Create weekly goal
export async function POST(req: Request) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  try {
    const { title, deadline } = await req.json();
    if (!title || !deadline) {
      return NextResponse.json({ message: "Title and deadline are required" }, { status: 400 });
    }

    const goal = await db.weeklyGoal.create({
      data: {
        userId: session.user.id,
        title,
        deadline: new Date(deadline),
      },
    });
    return success(goal, 201);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
