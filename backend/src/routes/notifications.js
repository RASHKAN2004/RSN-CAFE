import { Router } from 'express';
import mongoose from 'mongoose';
import { Notification } from '../models/Notification.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

const router = Router();
router.use(protect);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50),
      Notification.countDocuments({ user: req.user._id, isRead: false }),
    ]);
    res.json({ notifications, unreadCount });
  })
);

router.get(
  '/unread-count',
  asyncHandler(async (req, res) => {
    res.json({ unreadCount: await Notification.countDocuments({ user: req.user._id, isRead: false }) });
  })
);

router.patch(
  '/read-all',
  asyncHandler(async (req, res) => {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    res.json({ message: 'All notifications marked as read.' });
  })
);

router.patch(
  '/:id/read',
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) throw new AppError(400, 'Invalid ID.');
    await Notification.updateOne({ _id: req.params.id, user: req.user._id }, { isRead: true });
    res.json({ message: 'Marked as read.' });
  })
);

export default router;
