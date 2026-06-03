import { db } from "@/lib/db";
import { getAuthSession, unauthorized, notFound, success } from "@/lib/api-helpers";
import { NextResponse } from "next/server";

// PUT /api/goals/[id] - Update / Complete goal
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { id } = await params;
  const existing = await db.weeklyGoal.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) return notFound("Goal");

  const body = await req.json();
  const goal = await db.weeklyGoal.update({ where: { id }, data: body });

  if (body.status === "COMPLETED") {
    await db.activityLog.create({
      data: { userId: session.user.id, activity: `Completed goal: ${goal.title}` },
    });
  }

  return success(goal);
}

// DELETE /api/goals/[id] - Delete goal
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { id } = await params;
  const existing = await db.weeklyGoal.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!existing) return notFound("Goal");

  await db.weeklyGoal.delete({ where: { id } });
  return success({ message: "Goal deleted" });
}
