import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Helper to get authenticated session in API routes.
 * Returns session or throws 401 JSON response.
 */
export async function getAuthSession() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return session;
}

export function unauthorized() {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ message: "Forbidden" }, { status: 403 });
}

export function notFound(resource = "Resource") {
  return NextResponse.json({ message: `${resource} not found` }, { status: 404 });
}

export function badRequest(message: string) {
  return NextResponse.json({ message }, { status: 400 });
}

export function success(data: any, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function isAdmin(role: string) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function isSuperAdmin(role: string) {
  return role === "SUPER_ADMIN";
}
