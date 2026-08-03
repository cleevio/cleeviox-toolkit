import NextAuth from 'next-auth';

/**
 * Add providers here — see https://authjs.dev/getting-started/providers.
 * AUTH_SECRET must be set (see .env.example); generate one with `npx auth secret`.
 */
export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [],
});
