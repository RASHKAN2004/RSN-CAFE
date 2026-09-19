'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import MenuCard from '@/components/MenuCard';

export default function FeaturedItems() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/menu', { auth: false })
      .then((d) => setItems(d.items.filter((i) => i.isPopular && i.isAvailable).slice(0, 6)))
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="panel p-6 text-soft">Menu is not loading right now. {error}</p>;
  if (!items) return <p className="text-soft">Loading favourites…</p>;
  if (!items.length) return <p className="panel p-6 text-soft">No favourites yet. Mark items as popular in the dashboard.</p>;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((i) => <MenuCard key={i._id} item={i} />)}
    </div>
  );
}
