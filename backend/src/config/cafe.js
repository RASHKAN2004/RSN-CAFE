import { env } from './env.js';

// 👉 Update the street address / coordinates / hours to your real cafe details.
export const cafeInfo = {
  name: env.cafeName,
  tagline: 'Coffee & bites by the Kalpitiya lagoon',
  address: 'Kalpitiya, Puttalam District, North Western Province, Sri Lanka',
  city: 'Kalpitiya',
  coordinates: { lat: 8.2333, lng: 79.7667 },
  mapQuery: 'Kalpitiya, Sri Lanka',
  phone: env.cafePhone,
  hours: [{ days: 'Every day', time: '7:00 AM – 10:00 PM' }],
  currencyLabel: env.currencyLabel,
  taxRate: env.taxRate,
  serviceChargeRate: env.serviceChargeRate,
};
