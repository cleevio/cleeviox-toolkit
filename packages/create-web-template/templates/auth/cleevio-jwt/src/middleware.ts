import { NextResponse, type NextRequest } from 'next/server';

const COOKIE_NAME = process.env.CLEEVIO_JWT_COOKIE_NAME ?? 'cleevio_session';
const PUBLIC_PATHS = ['/login', '/api/auth'];

/**
 * Presence check only — cryptographic verification happens in
 * `src/lib/auth/session.ts` where the secret is available. Middleware just
 * short-circuits obviously unauthenticated navigation to the login page.
 */
export function middleware(request: NextRequest): NextResponse {
  const isPublic = PUBLIC_PATHS.some((publicPath) => request.nextUrl.pathname.startsWith(publicPath));
  if (isPublic || request.cookies.has(COOKIE_NAME)) {
    return NextResponse.next();
  }

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('from', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
