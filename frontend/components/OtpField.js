'use client';
export default function OtpField({ value, onChange, id = 'otp' }) {
  return (
    <div>
      <label className="label" htmlFor={id}>6-digit code</label>
      <input
        id={id}
        className="input text-center font-display text-3xl font-bold tracking-[0.5em]"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        placeholder="••••••"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
        required
      />
    </div>
  );
}
