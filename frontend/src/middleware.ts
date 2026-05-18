import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the request is for admin routes (except login)
  if (request.nextUrl.pathname.startsWith("/admin") && 
      !request.nextUrl.pathname.startsWith("/admin/login")) {
    
    // Check for token in cookies or headers
    const token = request.cookies.get("access_token")?.value ||
                  request.headers.get("authorization")?.replace("Bearer ", "");
    
    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
