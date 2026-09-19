import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';

import { env } from './src/config/env.js';
import { connectDB } from './src/config/db.js';
import { apiLimiter } from './src/middleware/rateLimit.js';
import { notFound, errorHandler } from './src/middleware/error.js';

import authRoutes from './src/routes/auth.js';
import menuRoutes from './src/routes/menu.js';
import orderRoutes from './src/routes/orders.js';
import paymentRoutes from './src/routes/payments.js';
import notificationRoutes from './src/routes/notifications.js';
import adminRoutes from './src/routes/admin.js';
import cafeRoutes from './src/routes/cafe.js';

const app = express();
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: env.clientUrl.split(',').map((s) => s.trim()) }));
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize()); // blocks NoSQL operator injection ($, .)
if (!env.isProd) app.use(morgan('dev'));
app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => res.json({ ok: true, name: env.cafeName }));
app.use('/api/cafe', cafeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

await connectDB();
app.listen(env.port, () => {
  console.log(`☕ ${env.cafeName} API running on http://localhost:${env.port}  (SMS: ${env.sms.provider})`);
});
