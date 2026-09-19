'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthShell, { FormError } from '@/components/AuthShell';
import OtpField from '@/components/OtpField';
import { useToast } from '@/components/Providers';
import { api } from '@/lib/api';

export default function ForgotPasswordPage() {
  const toast = useToast();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function run(fn) {
    setError('');
    setBusy(true);
    try { await fn(); } catch (err) { setError(err.message); } finally { setBusy(false); }
  }

  const sendCode = (e) => {
    e.preventDefault();
    run(async () => {
      const r = await api('/auth/forgot-password', { method: 'POST', auth: false, body: { phone } });
      setDevOtp(r.devOtp || '');
      setStep(2);
    });
  };
  const reset = (e) => {
    e.preventDefault();
    run(async () => {
      await api('/auth/reset-password', { method: 'POST', auth: false, body: { phone, otp, newPassword } });
      toast('Password updated. Please log in.');
      router.push('/login');
    });
  };

  return (
    <AuthShell title="Reset password" subtitle={step === 1 ? 'Enter your phone number and we will text you a code.' : `Enter the code sent to ${phone} and choose a new password.`}
      footer={<Link href="/login" className="underline underline-offset-4">Back to log in</Link>}>
      {step === 1 ? (
        <form onSubmit={sendCode} className="space-y-4">
          <div>
            <label className="label" htmlFor="phone">Phone number</label>
            <input id="phone" className="input" type="tel" inputMode="tel" placeholder="0771234567" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <FormError message={error} />
          <button className="btn btn-primary w-full" disabled={busy}>{busy ? 'Sending…' : 'Send code'}</button>
        </form>
      ) : (
        <form onSubmit={reset} className="space-y-4">
          {devOtp && <p className="rounded-xl border-2 border-dashed border-tide bg-tide/10 px-4 py-3 text-sm"><strong>Dev mode:</strong> your code is <strong className="font-display text-lg tracking-widest">{devOtp}</strong></p>}
          <OtpField value={otp} onChange={setOtp} />
          <div>
            <label className="label" htmlFor="np">New password</label>
            <input id="np" className="input" type="password" autoComplete="new-password" minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>
          <FormError message={error} />
          <button className="btn btn-primary w-full" disabled={busy || otp.length !== 6}>{busy ? 'Saving…' : 'Update password'}</button>
        </form>
      )}
    </AuthShell>
  );
}
