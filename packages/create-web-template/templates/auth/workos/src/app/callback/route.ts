import { handleAuth } from '@workos-inc/authkit-nextjs';

/** Completes the AuthKit OAuth flow — must match NEXT_PUBLIC_WORKOS_REDIRECT_URI. */
export const GET = handleAuth();
