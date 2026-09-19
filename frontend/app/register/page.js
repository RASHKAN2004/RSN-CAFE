'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthShell, { FormError } from '@/components/AuthShell';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [f, setF] = useState({ name: '', phone: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const r = await api('/auth/register', { method: 'POST', auth: false, body: f });
      if (r.devOtp) sessionStorage.setItem('rsn_dev_otp', r.devOtp);
      router.push(`/verify?phone=${encodeURIComponent(f.phone)}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="We will text a 6-digit code to confirm your number."
      footer={<>Already registered? <Link href="/login" className="font-semibold text-ink underline underline-offset-4">Log in</Link></>}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="name">Your name</label>
          <input id="name" className="input" autoComplete="name" value={f.name} onChange={set('name')} minLength={2} maxLength={60} required />
        </div>
        <div>
          <label className="label" htmlFor="phone">Mobile number</label>
          <input id="phone" className="input" type="tel" inputMode="tel" autoComplete="tel" placeholder="0771234567" value={f.phone} onChange={set('phone')} required />
        </div>
        <div>
          <label className="label" htmlFor="email">Email (optional)</label>
          <input id="email" className="input" type="email" autoComplete="email" value={f.email} onChange={set('email')} />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" className="input" type="password" autoComplete="new-password" value={f.password} onChange={set('password')} minLength={8} required />
          <p className="mt-1 text-xs text-soft">At least 8 characters with a letter and a number.</p>
        </div>
        <FormError message={error} />
        <button className="btn btn-primary w-full" disabled={busy}>{busy ? 'Sending code…' : 'Send verification code'}</button>
      </form>
    </AuthShell>
  );
}
