import User from '../models/User.js';
import { generateOTP, verifyOTP as checkOTP, storeOTP, getStoredOTPHash, deleteOTP } from '../utils/otp.js';
import { signToken, getCookieOptions } from '../utils/jwt.js';
import { addOTPEmailJob } from '../queues/emailQueue.js';

// ─── Send OTP ──────────────────────────────────────────────────────────────────
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    const otp = generateOTP();

    // Store hashed OTP in Redis with 10-minute TTL (overwrites any existing)
    await storeOTP(email, otp);

    // Dispatch email job to BullMQ (background worker handles sending)
    await addOTPEmailJob(email.toLowerCase(), otp);

    return res.status(200).json({ message: 'OTP sent to your email. Valid for 10 minutes.' });
  } catch (err) {
    console.error('[sendOTP]', err);
    return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
};

// ─── Verify OTP ───────────────────────────────────────────────────────────────
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    const storedHash = await getStoredOTPHash(email);
    if (!storedHash) {
      return res.status(400).json({ message: 'OTP not found or already used. Please request a new one.' });
    }

    if (!checkOTP(otp.toString().trim(), storedHash)) {
      return res.status(400).json({ message: 'Invalid OTP. Please check and try again.' });
    }

    // OTP is valid — delete it (single-use)
    await deleteOTP(email);

    // Find or create the user
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      user = await User.create({ email: email.toLowerCase() });
    }

    // Issue JWT in HTTP-only cookie
    const token = signToken({ userId: user._id, email: user.email });
    res.cookie('token', token, getCookieOptions());

    return res.status(200).json({
      message: 'OTP verified successfully.',
      user: {
        id: user._id,
        email: user.email,
        isRegistered: user.isRegistered,
        interests: user.interests,
        notificationTime: user.notificationTime,
      },
    });
  } catch (err) {
    console.error('[verifyOTP]', err);
    return res.status(500).json({ message: 'OTP verification failed. Please try again.' });
  }
};

// ─── Save Interests (Step 2) ───────────────────────────────────────────────────
export const saveInterests = async (req, res) => {
  try {
    const { interests } = req.body;
    if (!Array.isArray(interests) || interests.length < 1 || interests.length > 4) {
      return res.status(400).json({ message: 'Select between 1 and 4 interests.' });
    }

    const validInterests = [
      'Business', 'Sports', 'Entertainment', 'Technology',
      'Health', 'Science', 'Politics', 'World', 'Lifestyle', 'Education',
    ];
    const invalid = interests.filter((i) => !validInterests.includes(i));
    if (invalid.length > 0) {
      return res.status(400).json({ message: `Invalid interests: ${invalid.join(', ')}` });
    }

    req.user.interests = interests;
    await req.user.save();

    return res.status(200).json({ message: 'Interests saved.', interests: req.user.interests });
  } catch (err) {
    console.error('[saveInterests]', err);
    return res.status(500).json({ message: 'Failed to save interests.' });
  }
};

// ─── Save Notification Time (Step 3 — completes registration) ─────────────────
export const saveNotification = async (req, res) => {
  try {
    const { notificationTime } = req.body;
    if (!['morning', 'night'].includes(notificationTime)) {
      return res.status(400).json({ message: 'notificationTime must be "morning" or "night".' });
    }

    req.user.notificationTime = notificationTime;
    req.user.isRegistered = true;
    await req.user.save();

    return res.status(200).json({
      message: 'Registration complete!',
      user: {
        id: req.user._id,
        email: req.user.email,
        isRegistered: req.user.isRegistered,
        interests: req.user.interests,
        notificationTime: req.user.notificationTime,
      },
    });
  } catch (err) {
    console.error('[saveNotification]', err);
    return res.status(500).json({ message: 'Failed to save notification preference.' });
  }
};

// ─── Get current user (me) ─────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  return res.status(200).json({
    user: {
      id: req.user._id,
      email: req.user.email,
      isRegistered: req.user.isRegistered,
      interests: req.user.interests,
      notificationTime: req.user.notificationTime,
    },
  });
};

// ─── Logout ────────────────────────────────────────────────────────────────────
export const logout = (req, res) => {
  res.clearCookie('token', { httpOnly: true, path: '/' });
  return res.status(200).json({ message: 'Logged out successfully.' });
};
