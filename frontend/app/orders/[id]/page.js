"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Check, Printer } from "lucide-react";
import RequireAuth from "@/components/RequireAuth";
import Bill from "@/components/Bill";
import { useAuth, useToast } from "@/components/Providers";
import { api } from "@/lib/api";
import { STATUS_LABEL, STATUS_STYLE, PAY_LABEL, money } from "@/lib/cafe";

const STEPS = ["pending", "preparing", "ready", "completed"];

function OrderView() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isStaff = user.role !== "customer";

  const load = useCallback(async () => {
    try {
      const d = await api(`/orders/${id}`);
      setOrder(d.order);
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }, [id]);

  useEffect(() => {
    load();
    const t = setInterval(load, 8000);
    return () => clearInterval(t);
  }, [load]);

  async function act(fn, okMsg) {
    setBusy(true);
    try {
      await fn();
      toast(okMsg);
      await load();
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setBusy(false);
    }
  }

  if (error && !order) {
    return (
      <div className="page-shell py-24 text-center">
        <p className="text-lg text-danger">{error}</p>
        <Link href="/orders" className="btn btn-ghost mt-5">
          Back to orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="grid min-h-[50vh] place-items-center text-ink-soft">
        Loading order details…
      </div>
    );
  }

  const cancelled = order.status === "cancelled";
  const stepIdx = STEPS.indexOf(order.status);
  const needsOnlinePay =
    !isStaff &&
    order.payment.status === "pending" &&
    order.payment.method !== "cash" &&
    !cancelled;
  const canCancel =
    !isStaff && order.status === "pending" && order.payment.status !== "paid";

  return (
    <div className="page-shell py-10 pb-24">
      <Link
        href={isStaff ? "/admin" : "/orders"}
        className="no-print text-sm font-semibold text-accent underline-offset-4 hover:underline"
      >
        {isStaff ? "Back to dashboard" : "All my orders"}
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-5xl">{order.orderNumber}</h1>
        <span className={`status-badge ${STATUS_STYLE[order.status]}`}>
          {STATUS_LABEL[order.status]}
        </span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="no-print space-y-6">
          {cancelled ? (
            <div className="panel border-danger/40 bg-danger/5 p-5 text-danger">
              <p className="font-semibold">This order was cancelled.</p>
            </div>
          ) : (
            <ol className="panel space-y-4 p-5" aria-label="Order progress">
              {STEPS.map((s, i) => {
                const done = i <= stepIdx;

                return (
                  <li key={s} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={`grid h-9 w-9 place-items-center rounded-full border-2 ${
                          done
                            ? "border-accent bg-accent text-white"
                            : "border-border bg-[color:var(--surface)] text-ink-soft"
                        }`}
                      >
                        {done && <Check size={16} />}
                      </span>
                      {i < STEPS.length - 1 && (
                        <span
                          className={`mt-2 h-8 w-px ${i < stepIdx ? "bg-accent" : "bg-border"}`}
                        />
                      )}
                    </div>

                    <div className="flex-1 pt-1">
                      <p
                        className={`text-base font-semibold ${
                          done ? "text-ink" : "text-ink-soft"
                        } ${i === stepIdx ? "text-lg" : ""}`}
                      >
                        {STATUS_LABEL[s]}
                      </p>

                      {i === stepIdx && s === "ready" && (
                        <p className="mt-1 text-sm text-ink-soft">
                          {order.orderType === "takeaway"
                            ? "Please collect it at the counter."
                            : "We are bringing it to your table."}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}

          {needsOnlinePay && (
            <div className="panel border border-accent/40 bg-accent-soft p-5">
              <h2 className="text-2xl">Pay {money(order.total)} now</h2>
              <p className="mt-2 text-sm text-ink-soft">
                Paying by {PAY_LABEL[order.payment.method].toLowerCase()}. This
                is a demo gateway. No real money is charged until you connect a
                live payment provider.
              </p>
              <button
                type="button"
                className="btn btn-accent mt-4 w-full"
                disabled={busy}
                onClick={() =>
                  act(
                    () =>
                      api(`/payments/${order._id}/online`, { method: "POST" }),
                    "Payment received. SMS receipt sent.",
                  )
                }
              >
                {busy ? "Processing…" : `Pay ${money(order.total)}`}
              </button>
            </div>
          )}

          {!isStaff &&
            order.payment.status === "pending" &&
            order.payment.method === "cash" &&
            !cancelled && (
              <div className="panel p-5 text-sm text-ink-soft">
                Please pay{" "}
                <strong className="text-ink">{money(order.total)}</strong> in
                cash at the counter.
              </div>
            )}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="btn btn-accent"
              onClick={() => window.print()}
            >
              <Printer size={18} />
              Print bill
            </button>

            {canCancel && (
              <button
                type="button"
                className="btn btn-danger"
                disabled={busy}
                onClick={() =>
                  confirm("Cancel this order?") &&
                  act(
                    () =>
                      api(`/orders/${order._id}/cancel`, { method: "PATCH" }),
                    "Order cancelled.",
                  )
                }
              >
                Cancel order
              </button>
            )}
          </div>

          {order.notes && (
            <p className="text-sm text-ink-soft">
              <strong className="text-ink">Your note:</strong> {order.notes}
            </p>
          )}
        </div>

        <Bill order={order} />
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <RequireAuth>
      <OrderView />
    </RequireAuth>
  );
}
