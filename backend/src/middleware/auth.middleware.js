import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

/**
 * Protect routes — reads JWT from HTTP-only cookie.
 */
async function protect(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated. Please log in.' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired session. Please log in again.' });
    }

    const user = await User.findById(decoded.userId).select('-__v');
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Auth middleware error.' });
  }
}

export { protect };

