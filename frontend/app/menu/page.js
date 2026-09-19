"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, ShoppingBag, Sparkles } from "lucide-react";
import MenuCard from "@/components/MenuCard";
import { useCart } from "@/components/Providers";
import { api } from "@/lib/api";
import { money } from "@/lib/cafe";

export default function MenuPage() {
  const { count, subtotal } = useCart();
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [vegOnly, setVegOnly] = useState(false);

  useEffect(() => {
    api("/menu", { auth: false })
      .then((d) => setItems(d.items))
      .catch((e) => setError(e.message));
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set((items || []).map((i) => i.category))],
    [items],
  );

  const shown = useMemo(
    () =>
      (items || []).filter(
        (i) =>
          (cat === "All" || i.category === cat) &&
          (!vegOnly || i.isVeg) &&
          i.name.toLowerCase().includes(q.trim().toLowerCase()),
      ),
    [items, cat, q, vegOnly],
  );

  return (
    <div className="page-shell py-10 pb-28">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-ink-soft">
            Order with ease
          </p>
          <h1 className="mt-2 text-5xl sm:text-6xl">Menu</h1>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-[color:var(--card)] px-3 py-2 text-sm text-ink-soft">
          <Sparkles className="text-accent" size={16} />
          Freshly prepared to order
        </div>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft"
            size={18}
          />
          <input
            className="input pl-11"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search favourites, kottu, coffee..."
            aria-label="Search the menu"
          />
        </div>

        <label className="inline-flex cursor-pointer items-center gap-3 self-start rounded-full border border-border bg-[color:var(--card)] px-4 py-2.5 text-sm font-semibold text-ink">
          <input
            type="checkbox"
            className="h-4 w-4 accent-accent"
            checked={vegOnly}
            onChange={(e) => setVegOnly(e.target.checked)}
          />
          Vegetarian only
        </label>
      </div>

      <div className="sticky top-20 z-20 -mx-4 mb-6 border-y border-border bg-[color:var(--bg)]/90 px-4 py-3 backdrop-blur-md">
        <div
          role="tablist"
          aria-label="Categories"
          className="flex gap-2 overflow-x-auto pb-1"
        >
          {categories.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={cat === c}
              onClick={() => setCat(c)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                cat === c
                  ? "border-ink bg-ink text-bg"
                  : "border-border bg-[color:var(--card)] text-ink hover:border-accent hover:text-accent"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {error && (
          <div className="panel border-danger/40 bg-danger/5 p-4 text-sm font-medium text-danger">
            {error}. Make sure the API server is running.
          </div>
        )}

        {!items && !error && (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="panel animate-pulse p-4">
                <div className="flex gap-4">
                  <div className="h-24 w-24 rounded-[1.25rem] bg-[color:var(--surface-strong)]" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-2/3 rounded-full bg-[color:var(--surface-strong)]" />
                    <div className="h-3 w-full rounded-full bg-[color:var(--surface-strong)]" />
                    <div className="h-3 w-4/5 rounded-full bg-[color:var(--surface-strong)]" />
                    <div className="h-9 w-24 rounded-full bg-[color:var(--surface-strong)]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {items && !shown.length && (
          <div className="panel p-8 text-center text-ink-soft">
            Nothing matches that filter right now. Try another category or clear
            the search.
          </div>
        )}

        {items && (
          <div className="grid gap-4 md:grid-cols-2">
            {shown.map((i) => (
              <MenuCard key={i._id} item={i} />
            ))}
          </div>
        )}
      </div>

      {count > 0 && (
        <Link
          href="/cart"
          className="fixed bottom-5 left-1/2 z-30 flex w-[92vw] max-w-md -translate-x-1/2 items-center justify-between rounded-full border border-border bg-ink px-4 py-3 text-white shadow-[0_20px_45px_rgba(18,15,13,0.3)]"
        >
          <span className="flex items-center gap-2 text-sm font-semibold">
            <ShoppingBag size={18} />
            {count} item{count > 1 ? "s" : ""}
          </span>
          <span className="text-sm font-semibold">{money(subtotal)}</span>
        </Link>
      )}
    </div>
  );
}
