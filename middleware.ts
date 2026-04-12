import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isMarketingPath = request.nextUrl.pathname.startsWith('/marketing-dashboard');

  if (isMarketingPath) {
    const authCookie = request.cookies.get('marketing_auth_token');

    // Super simple auth check for the marketing team
    // In production, this token should be a secure JWT or session ID
    if (!authCookie || authCookie.value !== process.env.MARKETING_ADMIN_TOKEN) {
      // If no valid token, redirect to login
      const loginUrl = new URL('/marketing-login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/marketing-dashboard/:path*'],
};
