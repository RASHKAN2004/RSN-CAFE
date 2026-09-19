import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  purpose: { type: String, enum: ['register', 'reset'], required: true },
  codeHash: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  lastSentAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL: auto-delete
});
otpSchema.index({ phone: 1, purpose: 1 }, { unique: true });

export const Otp = mongoose.model('Otp', otpSchema);
