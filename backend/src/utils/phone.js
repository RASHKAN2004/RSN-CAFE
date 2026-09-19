import { env } from '../config/env.js';

/** Normalise user input to E.164 (+94771234567). Returns null when invalid. */
export function normalizePhone(input) {
  if (!input) return null;
  let p = String(input).replace(/[\s\-().]/g, '');
  if (p.startsWith('00')) p = '+' + p.slice(2);
  if (!p.startsWith('+')) {
    if (p.startsWith('0')) p = env.defaultCountryCode + p.slice(1);
    else if (!p.startsWith(env.defaultCountryCode)) p = env.defaultCountryCode + p;
    p = '+' + p;
  }
  return /^\+\d{9,15}$/.test(p) ? p : null;
}
