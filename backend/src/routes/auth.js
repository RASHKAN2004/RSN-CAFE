import { Router } from 'express';
import { z } from 'zod';
import { User } from '../models/User.js';
import { protect, signToken } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { authLimiter, otpLimiter } from '../middleware/rateLimit.js';
import { issueOtp, verifyOtp } from '../services/otp.js';
import { notifyUser } from '../services/notify.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { normalizePhone } from '../utils/phone.js';
import { env } from '../config/env.js';

const router = Router();

const phone = z
  .string({ required_error: 'Phone number is required' })
  .trim()
  .transform((v, ctx) => {
    const p = normalizePhone(v);
    if (!p) {
      ctx.addIssue({ code: 'custom', message: 'Enter a valid phone number (e.g. 0771234567).' });
      return z.NEVER;
    }
    return p;
  });
const password = z
  .string({ required_error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters.')
  .max(72, 'Password is too long.')
  .regex(/[A-Za-z]/, 'Password needs at least one letter.')
  .regex(/\d/, 'Password needs at least one number.');
const otp = z.string().trim().regex(/^\d{6}$/, 'OTP must be 6 digits.');

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(60),
  phone,
  email: z.string().trim().email('Enter a valid email.').optional().or(z.literal('')),
  password,
});

router.post(
  '/register',
  otpLimiter,
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const { name, phone, email, password } = req.body;
    let user = await User.findOne({ phone });
    if (user?.isVerified)
      throw new AppError(409, 'This phone number is already registered. Please log in.');

    if (email) {
      const clash = await User.findOne({ email, ...(user ? { _id: { $ne: user._id } } : {}) });
      if (clash) throw new AppError(409, 'This email is already in use.');
    }
    if (!user) user = new User({ phone });
    user.name = name;
    user.email = email || undefined;
    user.password = password;
    await user.save();

    const devOtp = await issueOtp(phone, 'register');
    res.status(201).json({ message: 'OTP sent to your phone.', phone, devOtp });
  })
);

router.post(
  '/verify-otp',
  authLimiter,
  validate(z.object({ phone, otp })),
  asyncHandler(async (req, res) => {
    const { phone, otp } = req.body;
    await verifyOtp(phone, 'register', otp);
    const user = await User.findOneAndUpdate({ phone }, { isVerified: true }, { new: true });
    if (!user) throw new AppError(404, 'Account not found. Please register again.');

    await notifyUser(
      user._id,
      {
        title: `Welcome to ${env.cafeName}!`,
        message: 'Your phone is verified. Browse the menu and place your first order.',
        type: 'account',
      },
      { to: user.phone, text: `Welcome to ${env.cafeName}, ${user.name}! Your account is ready.` }
    );
    res.json({ token: signToken(user), user: user.toPublic() });
  })
);

const otpPurposeHandler = (purpose) =>
  asyncHandler(async (req, res) => {
    const { phone } = req.body;
    const user = await User.findOne({ phone });
    const eligible = user && (purpose === 'register' ? !user.isVerified : user.isVerified);
    const devOtp = eligible ? await issueOtp(phone, purpose) : undefined;
    // Same response either way → does not reveal which numbers are registered.
    res.json({ message: 'If this number is eligible, an OTP has been sent.', devOtp });
  });

router.post('/resend-otp', otpLimiter, validate(z.object({ phone })), otpPurposeHandler('register'));
router.post('/forgot-password', otpLimiter, validate(z.object({ phone })), otpPurposeHandler('reset'));

router.post(
  '/reset-password',
  authLimiter,
  validate(z.object({ phone, otp, newPassword: password })),
  asyncHandler(async (req, res) => {
    const { phone, otp, newPassword } = req.body;
    await verifyOtp(phone, 'reset', otp);
    const user = await User.findOne({ phone });
    if (!user) throw new AppError(400, 'Could not reset password.');
    user.password = newPassword;
    await user.save();
    await notifyUser(user._id, {
      title: 'Password changed',
      message: 'Your password was changed. If this was not you, contact the cafe.',
      type: 'account',
    });
    res.json({ message: 'Password updated. You can log in now.' });
  })
);

router.post(
  '/login',
  authLimiter,
  validate(z.object({ phone, password: z.string().min(1, 'Password is required.') })),
  asyncHandler(async (req, res) => {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      throw new AppError(401, 'Incorrect phone number or password.');
    if (!user.isVerified)
      throw new AppError(403, 'Please verify your phone number first.', {
        needsVerification: true,
        phone,
      });
    res.json({ token: signToken(user), user: user.toPublic() });
  })
);

router.get('/me', protect, (req, res) => res.json({ user: req.user.toPublic() }));

export default router;
