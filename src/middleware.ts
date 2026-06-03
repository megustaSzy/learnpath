import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  const publicRoutes = ["/login", "/register", "/"];
  const isPublicRoute = publicRoutes.includes(pathname);
  const isApiAuthRoute = pathname.startsWith("/api/auth");

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isPublicRoute && isLoggedIn && pathname !== "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isPublicRoute && !isLoggedIn && pathname !== "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)"],
};
