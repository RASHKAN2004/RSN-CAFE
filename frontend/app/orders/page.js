"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { api } from "@/lib/api";
import { STATUS_LABEL, STATUS_STYLE, fmtDate, money } from "@/lib/cafe";

function Orders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/orders/mine")
      .then((d) => setOrders(d.orders))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="page-shell py-10 pb-24">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.22em] text-ink-soft">
          Your activity
        </p>
        <h1 className="mt-2 text-5xl">My orders</h1>
      </div>

      {error && (
        <div className="panel border-danger/40 bg-danger/5 p-4 text-sm font-medium text-danger">
          {error}
        </div>
      )}

      {!orders && !error && (
        <p className="mt-6 text-ink-soft">Loading your orders…</p>
      )}

      {orders && !orders.length && (
        <div className="panel mt-6 p-8 text-center">
          <p className="text-lg text-ink-soft">You haven’t ordered yet.</p>
          <Link href="/menu" className="btn btn-accent mt-6">
            Browse the menu
          </Link>
        </div>
      )}

      <ul className="mt-6 space-y-4">
        {orders?.map((o) => (
          <li key={o._id}>
            <Link
              href={`/orders/${o._id}`}
              className="panel block p-4 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-bold">{o.orderNumber}</p>
                    <span className={`status-badge ${STATUS_STYLE[o.status]}`}>
                      {STATUS_LABEL[o.status]}
                    </span>
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm text-ink-soft">
                    {o.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                  </p>
                  <p className="mt-1 text-xs text-ink-soft">
                    {fmtDate(o.createdAt)}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xl font-bold">{money(o.total)}</p>
                  <p
                    className={`text-xs font-semibold ${
                      o.payment.status === "paid"
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {o.payment.status === "paid"
                      ? "Paid"
                      : o.payment.status === "refunded"
                        ? "Refunded"
                        : "Unpaid"}
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <RequireAuth>
      <Orders />
    </RequireAuth>
  );
}
