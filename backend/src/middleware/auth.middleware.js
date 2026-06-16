import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';

/**
 * Protect routes — reads JWT from HTTP-only cookie.
 * Requires a fully-issued token that contains a userId.
 */
async function protect(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return next(new AppError(401, 'Not authenticated. Please log in.'));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return next(new AppError(401, 'Invalid or expired session. Please log in again.'));
    }

    const user = await User.findById(decoded.userId).select('-__v');
    if (!user) {
      return next(new AppError(401, 'User no longer exists.'));
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Protect registration routes — handles two token shapes:
 *  1. { userId, email } — existing (possibly partial) user; populates req.user
 *  2. { email }         — brand-new user whose OTP was just verified but whose
 *                         DB record has not been created yet; populates req.pendingEmail
 *
 * Use this middleware only for /register/interests so that new users can save
 * their interests (which triggers their actual DB creation) without needing a
 * userId in the token.
 */
async function protectRegistration(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return next(new AppError(401, 'Not authenticated. Please verify your email first.'));
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return next(new AppError(401, 'Invalid or expired session. Please verify your email again.'));
    }

    if (decoded.userId) {
      // Token belongs to an existing user
      const user = await User.findById(decoded.userId).select('-__v');
      if (!user) {
        return next(new AppError(401, 'User no longer exists.'));
      }
      req.user = user;
    } else if (decoded.email) {
      // Token belongs to a brand-new user (OTP verified, not yet in DB)
      req.user = null;
      req.pendingEmail = decoded.email;
    } else {
      return next(new AppError(401, 'Invalid session.'));
    }

    next();
  } catch (err) {
    next(err);
  }
}

export { protect, protectRegistration };

