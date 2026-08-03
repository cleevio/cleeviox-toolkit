import { cookies } from 'next/headers';
import { jwtVerify, type JWTPayload } from 'jose';

const COOKIE_NAME = process.env.CLEEVIO_JWT_COOKIE_NAME ?? 'cleevio_session';

export interface Session extends JWTPayload {
  readonly email?: string;
  readonly sub?: string;
}

function getSecret(): Uint8Array {
  const secret = process.env.CLEEVIO_JWT_SECRET;
  if (!secret) {
    throw new Error('CLEEVIO_JWT_SECRET is not set.');
  }
  return new TextEncoder().encode(secret);
}

/**
 * Reads and verifies the httpOnly session cookie. Returns null when the
 * cookie is missing, expired, or fails verification — callers decide whether
 * that means redirect, 401, or anonymous rendering.
 */
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify<Session>(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}
