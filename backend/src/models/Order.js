import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({ _id: String, seq: { type: Number, default: 0 } });
const Counter = mongoose.model('Counter', counterSchema);

export async function nextOrderNumber() {
  const c = await Counter.findOneAndUpdate(
    { _id: 'order' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `RSN-${String(c.seq).padStart(5, '0')}`;
}

const lineSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    customerName: { type: String, trim: true, default: 'Walk-in' },
    customerPhone: { type: String, trim: true },
    items: { type: [lineSchema], validate: (v) => v.length > 0 },
    orderType: { type: String, enum: ['dine-in', 'takeaway'], required: true },
    tableNumber: { type: String, trim: true },
    notes: { type: String, trim: true, maxlength: 200 },
    source: { type: String, enum: ['online', 'counter'], default: 'online' },

    subtotal: { type: Number, required: true },
    serviceCharge: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },

    status: {
      type: String,
      enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    payment: {
      method: { type: String, enum: ['cash', 'card', 'wallet'], default: 'cash' },
      status: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
      paidAt: Date,
      receiptNumber: String,
      transactionId: String,
    },
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 });

export const Order = mongoose.model('Order', orderSchema);
