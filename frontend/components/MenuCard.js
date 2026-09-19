'use client';
import { Minus, Plus } from 'lucide-react';
import { useCart } from '@/components/Providers';
import { money } from '@/lib/cafe';

export function VegMark({ veg }) {
  return (
    <span className={`inline-grid h-4 w-4 place-items-center rounded-sm border-2 ${veg ? 'border-palm' : 'border-chili'}`} title={veg ? 'Vegetarian' : 'Contains meat, fish or egg'}>
      <span className={`h-1.5 w-1.5 rounded-full ${veg ? 'bg-palm' : 'bg-chili'}`} />
    </span>
  );
}

export default function MenuCard({ item }) {
  const { items, add, dec } = useCart();
  const inCart = items.find((i) => i.id === item._id);

  return (
    <article className={`panel flex gap-4 p-4 ${item.isAvailable ? '' : 'opacity-60'}`}>
      <div className="grid h-20 w-20 shrink-0 place-items-center rounded-xl bg-mist text-4xl" aria-hidden="true">{item.emoji}</div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="flex items-center gap-2 text-lg font-bold leading-tight">
            <VegMark veg={item.isVeg} /> {item.name}
          </h3>
          <span className="whitespace-nowrap font-bold">{money(item.price)}</span>
        </div>
        {item.description && <p className="mt-1 text-sm text-soft">{item.description}</p>}
        <div className="mt-auto flex items-center justify-between pt-3">
          {item.isPopular ? <span className="badge bg-saffron/40">Popular</span> : <span />}
          {!item.isAvailable ? (
            <span className="badge bg-chili/15 text-chili">Sold out</span>
          ) : inCart ? (
            <div className="flex items-center gap-2 rounded-xl border-2 border-ink">
              <button className="p-1.5 hover:bg-mist" onClick={() => dec(item._id)} aria-label={`Remove one ${item.name}`}><Minus size={16} /></button>
              <span className="min-w-5 text-center font-bold" aria-live="polite">{inCart.quantity}</span>
              <button className="p-1.5 hover:bg-mist" onClick={() => add(item)} aria-label={`Add one more ${item.name}`}><Plus size={16} /></button>
            </div>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => add(item)}><Plus size={16} /> Add</button>
          )}
        </div>
      </div>
    </article>
  );
}
