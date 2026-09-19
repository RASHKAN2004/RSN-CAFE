'use client';
import { useEffect, useState } from 'react';

/** Countdown for the "Resend code" button. */
export default function useCooldown(start = 60) {
  const [left, setLeft] = useState(start);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  return [left, () => setLeft(start)];
}
