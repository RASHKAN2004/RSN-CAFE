'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { money } from '@/lib/cafe';

const lastDays = (n) =>
  Array.from({ length: n }, (_, i) => {
    const d = new Date(Date.now() - (n - 1 - i) * 86400000);
    return {
      key: d.toLocaleDateString('en-CA', { timeZone: 'Asia/Colombo' }),
      label: d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'Asia/Colombo' }),
    };
  });

export default function Overview() {
  const [s, setS] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = () => api('/admin/stats').then(setS).catch((e) => setError(e.message));
    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, []);

  if (error) return <p className="text-chili">{error}</p>;
  if (!s) return <p className="text-soft">Loading…</p>;

  const days = lastDays(7).map((d) => ({ ...d, ...(s.week.find((w) => w.date === d.key) || { revenue: 0, orders: 0 }) }));
  const max = Math.max(...days.map((d) => d.revenue), 1);
  const activeTotal = s.active.pending + s.active.preparing + s.active.ready;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="panel border-ink bg-saffron p-5">
          <p className="text-sm font-semibold">Paid today</p>
          <p className="mt-1 font-display text-4xl font-extrabold">{money(s.today.revenue)}</p>
        </div>
        <div className="panel p-5">
          <p className="text-sm font-semibold text-soft">Orders today</p>
          <p className="mt-1 font-display text-4xl font-extrabold">{s.today.orders}</p>
        </div>
        <div className="panel p-5">
          <p className="text-sm font-semibold text-soft">In progress now</p>
          <p className="mt-1 font-display text-4xl font-extrabold">{activeTotal}</p>
          <p className="mt-1 text-sm text-soft">{s.active.pending} new · {s.active.preparing} preparing · {s.active.ready} ready</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="panel p-5 lg:col-span-3">
          <h2 className="text-xl font-bold">Paid revenue, last 7 days</h2>
          <div className="mt-6 flex h-48 items-end gap-3" role="img" aria-label="Bar chart of paid revenue for the last seven days">
            {days.map((d) => (
              <div key={d.key} className="flex flex-1 flex-col items-center justify-end gap-2">
                <span className="text-xs font-semibold">{d.revenue ? money(d.revenue).replace('Rs. ', '') : ''}</span>
                <div className="w-full rounded-t-lg bg-tide" style={{ height: `${Math.max((d.revenue / max) * 100, d.revenue ? 4 : 1)}%` }} />
                <span className="text-xs text-soft">{d.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel p-5 lg:col-span-2">
          <h2 className="text-xl font-bold">Best sellers this week</h2>
          {!s.topItems.length && <p className="mt-4 text-sm text-soft">Sales will appear once orders are paid.</p>}
          <ol className="mt-4 space-y-3">
            {s.topItems.map((t) => (
              <li key={t.name} className="flex items-center justify-between gap-3">
                <span className="font-semibold">{t.name}</span>
                <span className="text-sm text-soft">{t.qty} sold · {money(t.revenue)}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
