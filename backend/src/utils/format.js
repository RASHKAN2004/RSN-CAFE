import { env } from '../config/env.js';

export const money = (n) =>
  `${env.currencyLabel} ${Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

export const round2 = (n) => Math.round(n * 100) / 100;
