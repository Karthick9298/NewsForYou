import express from 'express';
import rateLimit from 'express-rate-limit';
import * as authController from '../controllers/auth.controller.js';
import { protect, protectRegistration } from '../middleware/auth.middleware.js';

const router = express.Router();

// Rate limiter: max 5 OTP requests per IP per 15 minutes
// const otpLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 15,
//   message: { message: 'Too many OTP requests from this IP. Please try again after 15 minutes.' },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// ── Public routes ──────────────────────────────────────────────────────────────
router.post('/send-otp', authController.sendOTP); // otp-limiter
router.post('/verify-otp', authController.verifyOTP);
router.post('/logout', authController.logout);

// ── Protected routes (require valid JWT cookie) ────────────────────────────────
router.get('/me', protect, authController.getMe);
// interests uses protectRegistration: accepts both a userId token (existing user)
// and an email-only token (brand-new user whose record is created here)
router.post('/register/interests', protectRegistration, authController.saveInterests);
router.post('/register/notification', protect, authController.saveNotification);

export default router;
