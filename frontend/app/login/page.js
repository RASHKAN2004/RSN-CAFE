'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AuthShell, { FormError } from '@/components/AuthShell';
import { useAuth } from '@/components/Providers';
import { api, safeNext } from '@/lib/api';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { token, user } = await api('/auth/login', { method: 'POST', auth: false, body: { phone, password } });
      login(token, user);
      const next = safeNext(new URLSearchParams(window.location.search).get('next'));
      router.push(user.role === 'customer' ? next : next === '/' ? '/admin' : next);
    } catch (err) {
      if (err.data?.needsVerification) {
        try {
          const r = await api('/auth/resend-otp', { method: 'POST', auth: false, body: { phone } });
          if (r.devOtp) sessionStorage.setItem('rsn_dev_otp', r.devOtp);
        } catch {}
        return router.push(`/verify?phone=${encodeURIComponent(phone)}`);
      }
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Log in" subtitle="Welcome back. Use the phone number you registered with."
      footer={<>New here? <Link href="/register" className="font-semibold text-ink underline underline-offset-4">Create an account</Link></>}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="phone">Phone number</label>
          <input id="phone" className="input" type="tel" inputMode="tel" autoComplete="tel" placeholder="0771234567" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <FormError message={error} />
        <button className="btn btn-primary w-full" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
        <p className="text-center text-sm"><Link href="/forgot-password" className="text-soft underline underline-offset-4">Forgot your password?</Link></p>
      </form>
    </AuthShell>
  );
}
