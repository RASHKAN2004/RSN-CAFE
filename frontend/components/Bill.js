import { CAFE, PAY_LABEL, fmtDate, money } from "@/lib/cafe";

export default function Bill({ order }) {
  const paid = order.payment.status === "paid";

  return (
    <div id="bill" className="panel mx-auto w-full max-w-xl p-5 sm:p-6">
      <div className="text-center">
        <p className="font-display text-4xl font-bold tracking-tight">
          RSN CAFE
        </p>
        <p className="mt-2 text-sm text-ink-soft">{CAFE.address}</p>
        <p className="text-sm text-ink-soft">{CAFE.phone}</p>
      </div>

      <div className="my-5 border-y border-dashed border-border py-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-ink-soft">Order</span>
          <strong>{order.orderNumber}</strong>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-ink-soft">Date</span>
          <span>{fmtDate(order.createdAt)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-ink-soft">Customer</span>
          <span>{order.customerName}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-ink-soft">Type</span>
          <span>
            {order.orderType === "dine-in"
              ? `Dine in${order.tableNumber ? ` · Table ${order.tableNumber}` : ""}`
              : "Takeaway"}
          </span>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-ink-soft">
            <th className="pb-2 font-semibold">Item</th>
            <th className="pb-2 text-center font-semibold">Qty</th>
            <th className="pb-2 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((i) => (
            <tr
              key={`${i.menuItem}-${i.name}`}
              className="border-b border-dashed border-border/60"
            >
              <td className="py-2 pr-2">{i.name}</td>
              <td className="py-2 text-center">{i.quantity}</td>
              <td className="py-2 text-right">{money(i.price * i.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between text-ink-soft">
          <dt>Subtotal</dt>
          <dd>{money(order.subtotal)}</dd>
        </div>
        {order.serviceCharge > 0 && (
          <div className="flex items-center justify-between text-ink-soft">
            <dt>Service charge</dt>
            <dd>{money(order.serviceCharge)}</dd>
          </div>
        )}
        {order.tax > 0 && (
          <div className="flex items-center justify-between text-ink-soft">
            <dt>Tax</dt>
            <dd>{money(order.tax)}</dd>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-dashed border-border pt-3 text-lg font-bold">
          <dt>Total</dt>
          <dd>{money(order.total)}</dd>
        </div>
      </dl>

      <div className="mt-5 rounded-[1.2rem] bg-[color:var(--surface-strong)] p-3 text-center text-sm">
        {paid ? (
          <>
            <p className="font-bold text-success">
              PAID · {PAY_LABEL[order.payment.method]}
            </p>
            <p className="mt-1 text-ink-soft">
              Receipt {order.payment.receiptNumber} ·{" "}
              {fmtDate(order.payment.paidAt)}
            </p>
          </>
        ) : order.payment.status === "refunded" ? (
          <p className="font-bold text-danger">REFUNDED</p>
        ) : (
          <p className="font-bold">
            Payment due · {PAY_LABEL[order.payment.method]}
          </p>
        )}
      </div>

      <p className="mt-5 text-center text-xs text-ink-soft">
        Thank you for visiting RSN CAFE, Kalpitiya.
      </p>
    </div>
  );
}
