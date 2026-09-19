import { Router } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { MenuItem } from '../models/MenuItem.js';
import { protect, staffOnly, adminOnly } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const itemSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.').max(80),
  description: z.string().trim().max(240).optional().default(''),
  category: z.string().trim().min(1, 'Category is required.').max(40),
  price: z.coerce.number({ invalid_type_error: 'Price must be a number.' }).min(0).max(1_000_000),
  emoji: z.string().trim().max(8).optional().default('☕'),
  imageUrl: z.string().trim().url().optional().or(z.literal('')),
  isVeg: z.boolean().optional().default(true),
  isPopular: z.boolean().optional().default(false),
  isAvailable: z.boolean().optional().default(true),
});

const checkId = (req, res, next) =>
  mongoose.isValidObjectId(req.params.id) ? next() : next(new AppError(400, 'Invalid item ID.'));

// Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.category) filter.category = String(req.query.category);
    if (req.query.q) filter.name = { $regex: escapeRegex(String(req.query.q)), $options: 'i' };
    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    res.json({ items });
  })
);

// Staff / admin
router.post(
  '/',
  protect,
  staffOnly,
  validate(itemSchema),
  asyncHandler(async (req, res) => {
    const item = await MenuItem.create(req.body);
    res.status(201).json({ item });
  })
);

router.put(
  '/:id',
  protect,
  staffOnly,
  checkId,
  validate(itemSchema),
  asyncHandler(async (req, res) => {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) throw new AppError(404, 'Menu item not found.');
    res.json({ item });
  })
);

router.patch(
  '/:id/availability',
  protect,
  staffOnly,
  checkId,
  validate(z.object({ isAvailable: z.boolean() })),
  asyncHandler(async (req, res) => {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { isAvailable: req.body.isAvailable },
      { new: true }
    );
    if (!item) throw new AppError(404, 'Menu item not found.');
    res.json({ item });
  })
);

router.delete(
  '/:id',
  protect,
  adminOnly,
  checkId,
  asyncHandler(async (req, res) => {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) throw new AppError(404, 'Menu item not found.');
    res.json({ message: 'Menu item deleted.' });
  })
);

export default router;
