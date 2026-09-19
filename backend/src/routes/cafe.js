import { Router } from 'express';
import { cafeInfo } from '../config/cafe.js';

const router = Router();
router.get('/info', (req, res) => res.json(cafeInfo));
export default router;
