"use client";

export default function OtpField({ value, onChange, id = "otp" }) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        6-digit code
      </label>
      <input
        id={id}
        className="input text-center font-display text-3xl tracking-[0.45em]"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        placeholder="••••••"
        value={value}
        onChange={(e) =>
          onChange(e.target.value.replace(/\D/g, "").slice(0, 6))
        }
        required
      />
    </div>
  );
}
