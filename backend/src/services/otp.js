import crypto from 'crypto';
import { env } from '../config/env.js';
import { Otp } from '../models/Otp.js';
import { AppError } from '../utils/AppError.js';
import { sendSms } from './sms.js';

const hash = (phone, purpose, code) =>
  crypto.createHmac('sha256', env.jwtSecret).update(`${phone}:${purpose}:${code}`).digest('hex');

/** Creates + sends an OTP. Returns the code ONLY in console/dev mode (for easy testing). */
export async function issueOtp(phone, purpose) {
  const existing = await Otp.findOne({ phone, purpose });
  if (existing) {
    const wait = Math.ceil(
      (existing.lastSentAt.getTime() + env.otp.cooldownSeconds * 1000 - Date.now()) / 1000
    );
    if (wait > 0) throw new AppError(429, `Please wait ${wait}s before requesting another OTP.`);
  }

  const code = String(crypto.randomInt(100000, 1000000));
  await Otp.findOneAndUpdate(
    { phone, purpose },
    {
      codeHash: hash(phone, purpose, code),
      attempts: 0,
      lastSentAt: new Date(),
      expiresAt: new Date(Date.now() + env.otp.ttlMinutes * 60 * 1000),
    },
    { upsert: true, new: true }
  );

  const ok = await sendSms(
    phone,
    `${code} is your ${env.cafeName} verification code. Valid for ${env.otp.ttlMinutes} minutes. Never share it with anyone.`
  );
  if (!ok) throw new AppError(502, 'Could not send the OTP SMS. Please try again shortly.');

  const exposeDev = env.sms.provider === 'console' && env.sms.showDevOtp && !env.isProd;
  return exposeDev ? code : undefined;
}

export async function verifyOtp(phone, purpose, code) {
  const rec = await Otp.findOne({ phone, purpose });
  if (!rec || rec.expiresAt < new Date())
    throw new AppError(400, 'OTP expired or not found. Please request a new one.');
  if (rec.attempts >= env.otp.maxAttempts) {
    await rec.deleteOne();
    throw new AppError(429, 'Too many wrong attempts. Please request a new OTP.');
  }
  const a = Buffer.from(rec.codeHash);
  const b = Buffer.from(hash(phone, purpose, String(code)));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    rec.attempts += 1;
    await rec.save();
    throw new AppError(400, 'Incorrect OTP. Please check and try again.');
  }
  await rec.deleteOne();
}
