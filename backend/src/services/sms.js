import { env } from '../config/env.js';

let twilioClient;

async function sendTwilio(to, body) {
  if (!twilioClient) {
    const { default: twilio } = await import('twilio');
    twilioClient = twilio(env.sms.twilio.sid, env.sms.twilio.token);
  }
  const from = env.sms.twilio.from || '';
  const payload = from.startsWith('MG') ? { messagingServiceSid: from } : { from };
  await twilioClient.messages.create({ to, body, ...payload });
}

async function sendNotifyLk(to, body) {
  const { userId, apiKey, senderId } = env.sms.notifylk;
  const params = new URLSearchParams({
    user_id: userId,
    api_key: apiKey,
    sender_id: senderId,
    to: to.replace('+', ''), // Notify.lk wants 94771234567
    message: body,
  });
  const res = await fetch('https://app.notify.lk/api/v1/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.status === 'error') throw new Error(data.message || `Notify.lk HTTP ${res.status}`);
}

/** Sends an SMS. Never throws — returns true/false. */
export async function sendSms(to, body) {
  try {
    switch (env.sms.provider) {
      case 'twilio':
        await sendTwilio(to, body);
        break;
      case 'notifylk':
        await sendNotifyLk(to, body);
        break;
      default:
        console.log(`\n📱 [SMS → ${to}]\n   ${body}\n`);
    }
    return true;
  } catch (err) {
    console.error(`[SMS] failed (${env.sms.provider}) → ${to}:`, err.message);
    return false;
  }
}
