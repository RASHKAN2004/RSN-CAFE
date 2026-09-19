"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { money } from "@/lib/cafe";

const lastDays = (n) =>
  Array.from({ length: n }, (_, i) => {
    const d = new Date(Date.now() - (n - 1 - i) * 86400000);
    return {
      key: d.toLocaleDateString("en-CA", { timeZone: "Asia/Colombo" }),
      label: d.toLocaleDateString("en-US", {
        weekday: "short",
        timeZone: "Asia/Colombo",
      }),
    };
  });

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = () =>
      api("/admin/stats")
        .then(setStats)
        .catch((e) => setError(e.message));

    load();
    const t = setInterval(load, 20000);
    return () => clearInterval(t);
  }, []);

  if (error) return <p className="text-danger">{error}</p>;
  if (!stats) return <p className="text-ink-soft">Loading sales dashboard…</p>;

  const days = lastDays(7).map((d) => ({
    ...d,
    ...(stats.week.find((w) => w.date === d.key) || { revenue: 0, orders: 0 }),
  }));
  const max = Math.max(...days.map((d) => d.revenue), 1);
  const activeTotal =
    stats.active.pending + stats.active.preparing + stats.active.ready;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="panel border border-gold/40 bg-gold/15 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">
            Paid today
          </p>
          <p className="mt-3 font-display text-4xl font-bold">
            {money(stats.today.revenue)}
          </p>
        </div>

        <div className="panel p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">
            Orders today
          </p>
          <p className="mt-3 font-display text-4xl font-bold">
            {stats.today.orders}
          </p>
        </div>

        <div className="panel p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">
            In progress
          </p>
          <p className="mt-3 font-display text-4xl font-bold">{activeTotal}</p>
          <p className="mt-2 text-sm text-ink-soft">
            {stats.active.pending} pending · {stats.active.preparing} preparing
            · {stats.active.ready} ready
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="panel p-5">
          <h2 className="text-2xl">Paid revenue, last 7 days</h2>

          <div
            className="mt-6 flex h-52 items-end gap-3"
            role="img"
            aria-label="Bar chart of paid revenue for the last seven days"
          >
            {days.map((d) => (
              <div
                key={d.key}
                className="flex flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="text-[10px] font-semibold text-ink-soft">
                  {d.revenue ? money(d.revenue).replace("Rs. ", "") : ""}
                </span>
                <div
                  className="w-full rounded-t-[1rem] bg-accent"
                  style={{
                    height: `${Math.max((d.revenue / max) * 100, d.revenue ? 8 : 2)}%`,
                  }}
                />
                <span className="text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel p-5">
          <h2 className="text-2xl">Best sellers</h2>
          {!stats.topItems.length && (
            <p className="mt-4 text-sm text-ink-soft">
              Sales will appear once orders are paid.
            </p>
          )}

          <ol className="mt-4 space-y-3">
            {stats.topItems.map((item) => (
              <li
                key={item.name}
                className="flex items-center justify-between gap-3 rounded-2xl bg-[color:var(--surface)] px-3 py-2"
              >
                <span className="font-semibold">{item.name}</span>
                <span className="text-sm text-ink-soft">
                  {item.qty} sold · {money(item.revenue)}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
