import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    phone: { type: String, required: true, unique: true, index: true },
    email: { type: String, lowercase: true, trim: true, unique: true, sparse: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ['customer', 'staff', 'admin'], default: 'customer' },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.methods.toPublic = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    phone: this.phone,
    email: this.email || null,
    role: this.role,
    isVerified: this.isVerified,
  };
};

export const User = mongoose.model('User', userSchema);
