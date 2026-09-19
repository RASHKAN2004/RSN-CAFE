"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useAuth, useCart, useToast } from "@/components/Providers";
import { api } from "@/lib/api";
import { DEFAULT_RATES, calcTotals, money } from "@/lib/cafe";

const PAY = [
  {
    value: "cash",
    label: "Cash at counter",
    detail: "Pay when you collect or finish",
  },
  { value: "card", label: "Card online", detail: "Pay now, skip the queue" },
  {
    value: "wallet",
    label: "Mobile wallet",
    detail: "Pay now with your wallet",
  },
];

export default function CartPage() {
  const { items, add, dec, remove, clear, subtotal } = useCart();
  const { user, loading } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [rates, setRates] = useState(DEFAULT_RATES);
  const [orderType, setOrderType] = useState("dine-in");
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/cafe/info", { auth: false })
      .then((d) =>
        setRates({
          serviceChargeRate: d.serviceChargeRate,
          taxRate: d.taxRate,
        }),
      )
      .catch(() => {});
  }, []);

  const totals = calcTotals(subtotal, orderType, rates);

  async function placeOrder(e) {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const { order } = await api("/orders", {
        method: "POST",
        body: {
          items: items.map((i) => ({ menuItem: i.id, quantity: i.quantity })),
          orderType,
          tableNumber: orderType === "dine-in" ? tableNumber : undefined,
          notes: notes || undefined,
          paymentMethod,
        },
      });

      clear();
      toast(`Order ${order.orderNumber} placed. Check your phone for an SMS.`);
      router.push(`/orders/${order._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!items.length) {
    return (
      <div className="page-shell py-20 text-center">
        <div className="mx-auto max-w-xl">
          <div className="mx-auto mb-6 grid h-18 w-18 place-items-center rounded-full bg-accent-soft text-accent">
            <ShoppingBag size={30} />
          </div>
          <h1 className="text-5xl">Your cart is empty</h1>
          <p className="mt-4 text-lg text-ink-soft">
            Pick something from the menu and it will show up here.
          </p>
          <Link href="/menu" className="btn btn-accent mt-7">
            Browse the menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell py-10 pb-24">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.22em] text-ink-soft">
          Checkout
        </p>
        <h1 className="mt-2 text-5xl">Your order</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="panel p-4 sm:p-6">
          <ul className="space-y-4">
            {items.map((i) => (
              <li
                key={i.id}
                className="flex items-center gap-3 rounded-[1.4rem] border border-border bg-[color:var(--surface)] p-3 sm:p-4"
              >
                <div className="relative h-16 w-16 overflow-hidden rounded-[1.1rem] bg-[color:var(--surface-strong)]">
                  {i.imageUrl ? (
                    <>
                      <img
                        src={i.imageUrl}
                        alt={i.name}
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
                        className="hidden grid h-full w-full place-items-center text-3xl"
                      >
                        {i.emoji}
                      </div>
                    </>
                  ) : (
                    <div className="grid h-full w-full place-items-center text-3xl">
                      {i.emoji}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-lg font-bold">{i.name}</p>
                  <p className="mt-1 text-sm text-ink-soft">
                    {money(i.price)} each
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-border bg-[color:var(--surface-strong)] p-1">
                  <button
                    type="button"
                    className="grid h-8 w-8 place-items-center rounded-full text-ink hover:bg-[color:var(--surface)]"
                    onClick={() => dec(i.id)}
                    aria-label={`Remove one ${i.name}`}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="min-w-6 text-center text-sm font-bold">
                    {i.quantity}
                  </span>
                  <button
                    type="button"
                    className="grid h-8 w-8 place-items-center rounded-full text-ink hover:bg-[color:var(--surface)]"
                    onClick={() =>
                      add({
                        _id: i.id,
                        name: i.name,
                        price: i.price,
                        emoji: i.emoji,
                        imageUrl: i.imageUrl || "",
                      })
                    }
                    aria-label={`Add one ${i.name}`}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <p className="w-20 text-right text-base font-bold">
                  {money(i.price * i.quantity)}
                </p>

                <button
                  type="button"
                  className="grid h-10 w-10 place-items-center rounded-full text-danger hover:bg-danger/10"
                  onClick={() => remove(i.id)}
                  aria-label={`Delete ${i.name}`}
                >
                  <Trash2 size={18} />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <form
          onSubmit={placeOrder}
          className="panel h-fit space-y-6 p-5 sm:p-6"
        >
          <fieldset className="space-y-3">
            <legend className="field-label">How will you have it?</legend>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["dine-in", "Dine in"],
                ["takeaway", "Takeaway"],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className={`cursor-pointer rounded-[1.1rem] border p-3 text-center text-sm font-semibold transition-colors ${
                    orderType === value
                      ? "border-ink bg-ink text-bg"
                      : "border-border bg-[color:var(--surface)] text-ink hover:border-accent"
                  }`}
                >
                  <input
                    type="radio"
                    name="orderType"
                    value={value}
                    checked={orderType === value}
                    onChange={() => setOrderType(value)}
                    className="sr-only"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          {orderType === "dine-in" && (
            <div>
              <label htmlFor="tableNumber" className="field-label">
                Table number
              </label>
              <input
                id="tableNumber"
                className="input"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                maxLength={10}
                placeholder="e.g. 4"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="notes" className="field-label">
              Notes for the kitchen
            </label>
            <textarea
              id="notes"
              className="input min-h-[88px] resize-none"
              rows={3}
              maxLength={200}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Less sugar, no onion, extra chilli..."
            />
          </div>

          <fieldset className="space-y-3">
            <legend className="field-label">Payment</legend>
            <div className="space-y-2">
              {PAY.map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-[1.1rem] border p-3 transition-colors ${
                    paymentMethod === option.value
                      ? "border-accent bg-accent-soft"
                      : "border-border bg-[color:var(--surface)] hover:border-accent"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.value}
                    checked={paymentMethod === option.value}
                    onChange={() => setPaymentMethod(option.value)}
                    className="mt-1 h-4 w-4 accent-accent"
                  />
                  <span>
                    <span className="block text-sm font-semibold">
                      {option.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-ink-soft">
                      {option.detail}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <dl className="space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex items-center justify-between text-ink-soft">
              <dt>Subtotal</dt>
              <dd>{money(totals.subtotal)}</dd>
            </div>
            {totals.serviceCharge > 0 && (
              <div className="flex items-center justify-between text-ink-soft">
                <dt>Service charge</dt>
                <dd>{money(totals.serviceCharge)}</dd>
              </div>
            )}
            {totals.tax > 0 && (
              <div className="flex items-center justify-between text-ink-soft">
                <dt>Tax</dt>
                <dd>{money(totals.tax)}</dd>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-border pt-3 text-base font-bold">
              <dt>Total</dt>
              <dd>{money(totals.total)}</dd>
            </div>
          </dl>

          {error && (
            <p
              className="rounded-2xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm font-semibold text-danger"
              role="alert"
            >
              {error}
            </p>
          )}

          {!loading && !user ? (
            <div className="space-y-3">
              <p className="text-sm text-ink-soft">
                Log in with your phone number to place this order. Your cart
                stays saved for later.
              </p>
              <Link href="/login?next=/cart" className="btn btn-accent w-full">
                Log in to order
              </Link>
            </div>
          ) : (
            <button
              type="submit"
              className="btn btn-accent w-full py-3.5 text-base"
              disabled={busy || loading}
            >
              {busy ? "Placing order…" : `Place order · ${money(totals.total)}`}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
