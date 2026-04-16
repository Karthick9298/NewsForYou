import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/** Sign a JWT with user payload */
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/** Verify a JWT and return decoded payload, or null on failure */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/** Cookie options for HTTP-only secure JWT */
function getCookieOptions() {
  return {
    httpOnly: true,
    // In production the frontend and backend are on different domains, so the
    // cookie must be SameSite=None + Secure to be sent with cross-origin requests.
    // In local dev (same origin, no HTTPS) SameSite=Lax is fine.
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    path: '/',
  };
}

export { signToken, verifyToken, getCookieOptions };
