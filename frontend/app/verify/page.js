'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AuthShell, { FormError } from '@/components/AuthShell';
import OtpField from '@/components/OtpField';
import useCooldown from '@/components/useCooldown';
import { useAuth, useToast } from '@/components/Providers';
import { api } from '@/lib/api';

export default function VerifyPage() {
  const { login } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [left, restart] = useCooldown(60);

  useEffect(() => {
    setPhone(new URLSearchParams(window.location.search).get('phone') || '');
    setDevOtp(sessionStorage.getItem('rsn_dev_otp') || '');
  }, []);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { token, user } = await api('/auth/verify-otp', { method: 'POST', auth: false, body: { phone, otp } });
      sessionStorage.removeItem('rsn_dev_otp');
      login(token, user);
      toast('Phone verified. Welcome to RSN CAFE!');
      router.push('/menu');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function resend() {
    setError('');
    try {
      const r = await api('/auth/resend-otp', { method: 'POST', auth: false, body: { phone } });
      if (r.devOtp) { sessionStorage.setItem('rsn_dev_otp', r.devOtp); setDevOtp(r.devOtp); }
      restart();
      toast('A new code is on its way.');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AuthShell title="Enter your code" subtitle={phone ? `We sent a 6-digit code by SMS to ${phone}.` : 'Enter the code we sent by SMS.'}
      footer={<Link href="/register" className="underline underline-offset-4">Wrong number? Start again</Link>}>
      {devOtp && (
        <p className="mb-4 rounded-xl border-2 border-dashed border-tide bg-tide/10 px-4 py-3 text-sm">
          <strong>Dev mode:</strong> SMS is not connected, so your code is <strong className="font-display text-lg tracking-widest">{devOtp}</strong>
        </p>
      )}
      <form onSubmit={submit} className="space-y-4">
        <OtpField value={otp} onChange={setOtp} />
        <FormError message={error} />
        <button className="btn btn-primary w-full" disabled={busy || otp.length !== 6}>{busy ? 'Verifying…' : 'Verify and continue'}</button>
        <button type="button" className="btn btn-ghost w-full" onClick={resend} disabled={left > 0}>
          {left > 0 ? `Resend code in ${left}s` : 'Resend code'}
        </button>
      </form>
    </AuthShell>
  );
}
