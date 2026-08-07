import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

/**
 * AuthKit session proxy (Next 16.3 renamed the `middleware` file convention
 * to `proxy`) — refreshes the WorkOS session cookie and exposes auth state to
 * `withAuth()` in Server Components. Configure WORKOS_* env vars (see
 * .env.example); generate WORKOS_COOKIE_PASSWORD with `openssl rand -base64 32`.
 */
export default authkitMiddleware();

export const config = {
  matcher: ['/((?!_next/static|_next/image|icon.svg|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
