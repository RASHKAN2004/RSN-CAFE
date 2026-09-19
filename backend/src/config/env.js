const num = (v, d) => (v === undefined || v === '' ? d : Number(v));
const bool = (v, d) => (v === undefined || v === '' ? d : String(v).toLowerCase() === 'true');

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  isProd: process.env.NODE_ENV === 'production',
  port: num(process.env.PORT, 5000),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rsn_cafe',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',

  cafeName: process.env.CAFE_NAME || 'RSN CAFE',
  cafePhone: process.env.CAFE_PHONE || '',
  currencyLabel: process.env.CURRENCY_LABEL || 'Rs.',
  taxRate: num(process.env.TAX_RATE, 0),
  serviceChargeRate: num(process.env.SERVICE_CHARGE_RATE, 0.1),
  defaultCountryCode: process.env.DEFAULT_COUNTRY_CODE || '94',
  timezone: process.env.TIMEZONE || 'Asia/Colombo',
  tzOffsetMinutes: num(process.env.TZ_OFFSET_MINUTES, 330),

  admin: {
    name: process.env.ADMIN_NAME || 'RSN Admin',
    phone: process.env.ADMIN_PHONE || '',
    password: process.env.ADMIN_PASSWORD || '',
  },

  sms: {
    provider: (process.env.SMS_PROVIDER || 'console').toLowerCase(),
    showDevOtp: bool(process.env.SHOW_DEV_OTP, true),
    adminAlertPhone: process.env.ADMIN_ALERT_PHONE || '',
    twilio: {
      sid: process.env.TWILIO_ACCOUNT_SID,
      token: process.env.TWILIO_AUTH_TOKEN,
      from: process.env.TWILIO_FROM,
    },
    notifylk: {
      userId: process.env.NOTIFYLK_USER_ID,
      apiKey: process.env.NOTIFYLK_API_KEY,
      senderId: process.env.NOTIFYLK_SENDER_ID || 'NotifyDEMO',
    },
  },

  otp: { ttlMinutes: 5, cooldownSeconds: 60, maxAttempts: 5 },
};

if (!env.jwtSecret || env.jwtSecret.length < 32) {
  throw new Error(
    'JWT_SECRET is missing or too short (need 32+ chars). Copy .env.example to .env and set it.'
  );
}
