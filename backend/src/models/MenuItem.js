import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, trim: true, maxlength: 240, default: '' },
    category: { type: String, required: true, trim: true, maxlength: 40, index: true },
    price: { type: Number, required: true, min: 0 },
    emoji: { type: String, trim: true, maxlength: 8, default: '☕' },
    imageUrl: { type: String, trim: true, default: '' },
    isVeg: { type: Boolean, default: true },
    isPopular: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const MenuItem = mongoose.model('MenuItem', menuItemSchema);
