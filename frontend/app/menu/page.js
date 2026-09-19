'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Search, ShoppingBag } from 'lucide-react';
import MenuCard from '@/components/MenuCard';
import { useCart } from '@/components/Providers';
import { api } from '@/lib/api';
import { money } from '@/lib/cafe';

export default function MenuPage() {
  const { count, subtotal } = useCart();
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const [vegOnly, setVegOnly] = useState(false);

  useEffect(() => {
    api('/menu', { auth: false }).then((d) => setItems(d.items)).catch((e) => setError(e.message));
  }, []);

  const categories = useMemo(() => ['All', ...new Set((items || []).map((i) => i.category))], [items]);
  const shown = useMemo(
    () => (items || []).filter((i) =>
      (cat === 'All' || i.category === cat) &&
      (!vegOnly || i.isVeg) &&
      i.name.toLowerCase().includes(q.trim().toLowerCase())),
    [items, cat, q, vegOnly]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 pb-28">
      <h1 className="text-4xl font-extrabold md:text-5xl">Menu</h1>

      <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-soft" size={18} />
          <input className="input pl-10" placeholder="Search the menu" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search the menu" />
        </div>
        <label className="flex cursor-pointer items-center gap-2 font-semibold">
          <input type="checkbox" className="h-5 w-5 accent-[#2f7d4f]" checked={vegOnly} onChange={(e) => setVegOnly(e.target.checked)} /> Vegetarian only
        </label>
      </div>

      <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-2" role="tablist" aria-label="Categories">
        {categories.map((c) => (
          <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
            className={`whitespace-nowrap rounded-xl border-2 border-ink px-4 py-1.5 font-semibold ${cat === c ? 'bg-ink text-salt' : 'hover:bg-mist'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {error && <p className="panel p-6 text-chili">{error}. Make sure the API server is running.</p>}
        {!items && !error && <p className="text-soft">Loading menu…</p>}
        {items && !shown.length && <p className="panel p-6 text-soft">Nothing matches your search. Try another category or clear the filters.</p>}
        <div className="grid gap-4 md:grid-cols-2">
          {shown.map((i) => <MenuCard key={i._id} item={i} />)}
        </div>
      </div>

      {count > 0 && (
        <Link href="/cart" className="btn btn-dark fixed bottom-5 left-1/2 z-30 w-[90vw] max-w-md -translate-x-1/2 justify-between py-3">
          <span className="flex items-center gap-2"><ShoppingBag size={18} /> {count} item{count > 1 ? 's' : ''}</span>
          <span>View cart · {money(subtotal)}</span>
        </Link>
      )}
    </div>
  );
}
