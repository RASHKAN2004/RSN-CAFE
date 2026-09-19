"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useToast } from "@/components/Providers";
import { api } from "@/lib/api";
import { DEFAULT_RATES, calcTotals, money } from "@/lib/cafe";

export default function PosPanel() {
  const toast = useToast();
  const router = useRouter();

  const [menu, setMenu] = useState([]);
  const [rates, setRates] = useState(DEFAULT_RATES);
  const [cat, setCat] = useState("All");
  const [lines, setLines] = useState({});
  const [orderType, setOrderType] = useState("takeaway");
  const [tableNumber, setTableNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [markPaid, setMarkPaid] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api("/menu", { auth: false })
      .then((d) => setMenu(d.items.filter((i) => i.isAvailable)))
      .catch((e) => toast(e.message, "error"));

    api("/cafe/info", { auth: false })
      .then((d) =>
        setRates({
          serviceChargeRate: d.serviceChargeRate,
          taxRate: d.taxRate,
        }),
      )
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cats = useMemo(
    () => ["All", ...new Set(menu.map((i) => i.category))],
    [menu],
  );
  const shown = menu.filter((i) => cat === "All" || i.category === cat);
  const list = Object.values(lines);
  const subtotal = list.reduce(
    (sum, line) => sum + line.item.price * line.qty,
    0,
  );
  const totals = calcTotals(subtotal, orderType, rates);

  const bump = (item, diff) =>
    setLines((current) => {
      const qty = (current[item._id]?.qty || 0) + diff;
      const next = { ...current };

      if (qty <= 0) delete next[item._id];
      else next[item._id] = { item, qty: Math.min(qty, 20) };

      return next;
    });

  async function create() {
    setBusy(true);

    try {
      const { order } = await api("/orders/counter", {
        method: "POST",
        body: {
          items: list.map((line) => ({
            menuItem: line.item._id,
            quantity: line.qty,
          })),
          orderType,
          tableNumber: orderType === "dine-in" ? tableNumber : undefined,
          customerName: customerName || undefined,
          customerPhone: customerPhone || undefined,
          paymentMethod,
          markPaid,
        },
      });

      toast(`Bill ${order.orderNumber} created.`);
      router.push(`/orders/${order._id}`);
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <section>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`whitespace-nowrap rounded-full border px-3 py-2 text-sm font-semibold ${
                cat === c
                  ? "border-ink bg-ink text-bg"
                  : "border-border bg-[color:var(--card)] text-ink hover:border-accent"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {shown.map((item) => (
            <button
              key={item._id}
              type="button"
              onClick={() => bump(item, 1)}
              className="panel flex items-center gap-3 p-3 text-left transition-transform hover:-translate-y-0.5"
            >
              <span className="grid h-14 w-14 place-items-center rounded-[1rem] bg-[color:var(--surface-strong)] text-3xl">
                {item.emoji}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">
                  {item.name}
                </span>
                <span className="mt-1 block text-sm text-ink-soft">
                  {money(item.price)}
                </span>
              </span>

              {lines[item._id] && (
                <span className="chip bg-gold/20">{lines[item._id].qty}</span>
              )}
            </button>
          ))}
        </div>
      </section>

      <section className="panel h-fit space-y-4 p-5">
        <h2 className="text-2xl">Current bill</h2>

        {!list.length && (
          <p className="text-sm text-ink-soft">
            Tap items on the left to add them.
          </p>
        )}

        <ul className="space-y-3">
          {list.map(({ item, qty }) => (
            <li
              key={item._id}
              className="flex items-center justify-between gap-2 rounded-2xl border border-border bg-[color:var(--surface)] p-2"
            >
              <span className="min-w-0 flex-1 truncate font-semibold">
                {item.name}
              </span>

              <span className="flex items-center gap-1 rounded-full border border-border bg-[color:var(--surface-strong)] p-1">
                <button
                  type="button"
                  className="grid h-7 w-7 place-items-center rounded-full hover:bg-[color:var(--surface)]"
                  onClick={() => bump(item, -1)}
                  aria-label={`Remove one ${item.name}`}
                >
                  <Minus size={14} />
                </button>
                <span className="min-w-5 text-center text-sm font-bold">
                  {qty}
                </span>
                <button
                  type="button"
                  className="grid h-7 w-7 place-items-center rounded-full hover:bg-[color:var(--surface)]"
                  onClick={() => bump(item, 1)}
                  aria-label={`Add one ${item.name}`}
                >
                  <Plus size={14} />
                </button>
              </span>

              <span className="w-20 text-right text-sm font-semibold">
                {money(item.price * qty)}
              </span>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-2 gap-2">
          {[
            ["takeaway", "Takeaway"],
            ["dine-in", "Dine in"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setOrderType(value)}
              className={`rounded-full border px-3 py-2 text-sm font-semibold ${
                orderType === value
                  ? "border-ink bg-ink text-bg"
                  : "border-border bg-[color:var(--surface)] text-ink hover:border-accent"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {orderType === "dine-in" && (
          <input
            className="input"
            placeholder="Table number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            maxLength={10}
            aria-label="Table number"
          />
        )}

        <input
          className="input"
          placeholder="Customer name (optional)"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          maxLength={60}
          aria-label="Customer name"
        />

        <input
          className="input"
          type="tel"
          placeholder="Customer phone for SMS bill (optional)"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          aria-label="Customer phone"
        />

        <div className="grid grid-cols-3 gap-2">
          {[
            ["cash", "Cash"],
            ["card", "Card"],
            ["wallet", "Wallet"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setPaymentMethod(value)}
              className={`rounded-full border px-3 py-2 text-xs font-semibold ${
                paymentMethod === value
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-[color:var(--surface)] text-ink hover:border-accent"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            className="h-4 w-4 accent-accent"
            checked={markPaid}
            onChange={(e) => setMarkPaid(e.target.checked)}
          />
          Customer has paid now
        </label>

        <dl className="space-y-2 border-t border-border pt-3 text-sm">
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
          <div className="flex items-center justify-between border-t border-border pt-3 text-lg font-bold">
            <dt>Total</dt>
            <dd>{money(totals.total)}</dd>
          </div>
        </dl>

        <button
          type="button"
          className="btn btn-accent w-full py-3.5"
          disabled={
            !list.length || busy || (orderType === "dine-in" && !tableNumber)
          }
          onClick={create}
        >
          {busy ? "Creating…" : "Create bill"}
        </button>
      </section>
    </div>
  );
}
