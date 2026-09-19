"use client";

import { Minus, Plus } from "lucide-react";
import { useCart } from "@/components/Providers";
import { money } from "@/lib/cafe";

export function VegMark({ veg }) {
  return (
    <span
      className={`inline-grid h-4 w-4 place-items-center rounded-full border ${
        veg ? "border-success bg-success/15" : "border-coral bg-coral/15"
      }`}
      title={veg ? "Vegetarian" : "Contains meat, fish or egg"}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${veg ? "bg-success" : "bg-coral"}`}
      />
    </span>
  );
}

export default function MenuCard({ item }) {
  const { items, add, dec } = useCart();
  const inCart = items.find((i) => i.id === item._id);

  return (
    <article
      className={`panel group overflow-hidden p-4 transition-all duration-200 hover:-translate-y-1 ${
        item.isAvailable ? "" : "opacity-70"
      }`}
    >
      <div className="flex gap-4">
        <div
          className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.35rem] border border-border shadow-inner"
          style={{
            background: item.isVeg
              ? "linear-gradient(135deg, rgba(116,209,198,0.18), rgba(255,250,245,0.7))"
              : "linear-gradient(135deg, rgba(215,161,95,0.22), rgba(255,250,245,0.7))",
          }}
          aria-hidden="true"
        >
          {item.imageUrl ? (
            <>
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-full w-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement
                    ?.querySelector("[data-fallback]")
                    ?.classList.remove("hidden");
                }}
              />
              <div
                data-fallback
                className="hidden h-full w-full place-items-center text-4xl"
              >
                {item.emoji}
              </div>
            </>
          ) : (
            <div className="grid h-full w-full place-items-center text-4xl">
              {item.emoji}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="flex items-center gap-2 text-xl font-bold leading-tight">
              <VegMark veg={item.isVeg} />
              <span>{item.name}</span>
            </h3>

            <span className="shrink-0 text-lg font-bold">
              {money(item.price)}
            </span>
          </div>

          {item.description && (
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              {item.description}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between gap-3">
            {item.isPopular ? (
              <span className="chip bg-gold/20 text-ink">Popular</span>
            ) : (
              <span />
            )}

            {!item.isAvailable ? (
              <span className="chip border-danger/30 bg-danger/5 text-danger">
                Sold out
              </span>
            ) : inCart ? (
              <div className="flex items-center gap-2 rounded-full border border-border bg-[color:var(--surface-strong)] p-1">
                <button
                  type="button"
                  className="grid h-8 w-8 place-items-center rounded-full hover:bg-[color:var(--surface)]"
                  onClick={() => dec(item._id)}
                  aria-label={`Remove one ${item.name}`}
                >
                  <Minus size={16} />
                </button>
                <span
                  className="min-w-6 text-center text-sm font-bold"
                  aria-live="polite"
                >
                  {inCart.quantity}
                </span>
                <button
                  type="button"
                  className="grid h-8 w-8 place-items-center rounded-full hover:bg-[color:var(--surface)]"
                  onClick={() => add(item)}
                  aria-label={`Add one more ${item.name}`}
                >
                  <Plus size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-accent btn-sm"
                onClick={() => add(item)}
              >
                <Plus size={16} />
                Add
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
