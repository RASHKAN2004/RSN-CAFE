import { CAFE, PAY_LABEL, fmtDate, money } from '@/lib/cafe';

/** Printable bill / receipt. Uses id="bill" so the print stylesheet isolates it. */
export default function Bill({ order }) {
  const paid = order.payment.status === 'paid';
  return (
    <div id="bill" className="panel mx-auto w-full max-w-md p-6 font-sans">
      <div className="text-center">
        <p className="font-display text-2xl font-extrabold">RSN CAFE</p>
        <p className="text-sm text-soft">{CAFE.address}</p>
        <p className="text-sm text-soft">{CAFE.phone}</p>
      </div>

      <div className="my-4 space-y-0.5 border-y-2 border-dashed border-mist py-3 text-sm">
        <p className="flex justify-between"><span>Order</span><strong>{order.orderNumber}</strong></p>
        <p className="flex justify-between"><span>Date</span><span>{fmtDate(order.createdAt)}</span></p>
        <p className="flex justify-between"><span>Customer</span><span>{order.customerName}</span></p>
        <p className="flex justify-between"><span>Type</span><span>{order.orderType === 'dine-in' ? `Dine in${order.tableNumber ? ` · Table ${order.tableNumber}` : ''}` : 'Takeaway'}</span></p>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-soft"><th className="pb-1 font-semibold">Item</th><th className="pb-1 text-center font-semibold">Qty</th><th className="pb-1 text-right font-semibold">Amount</th></tr>
        </thead>
        <tbody>
          {order.items.map((i) => (
            <tr key={i.menuItem + i.name}>
              <td className="py-1">{i.name}</td>
              <td className="py-1 text-center">{i.quantity}</td>
              <td className="py-1 text-right">{money(i.price * i.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="mt-3 space-y-1 border-t-2 border-dashed border-mist pt-3 text-sm">
        <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(order.subtotal)}</dd></div>
        {order.serviceCharge > 0 && <div className="flex justify-between"><dt>Service charge</dt><dd>{money(order.serviceCharge)}</dd></div>}
        {order.tax > 0 && <div className="flex justify-between"><dt>Tax</dt><dd>{money(order.tax)}</dd></div>}
        <div className="flex justify-between pt-1 text-lg font-extrabold"><dt>Total</dt><dd>{money(order.total)}</dd></div>
      </dl>

      <div className="mt-4 rounded-xl bg-mist/60 p-3 text-center text-sm">
        {paid ? (
          <>
            <p className="font-bold text-palm">PAID · {PAY_LABEL[order.payment.method]}</p>
            <p className="text-soft">Receipt {order.payment.receiptNumber} · {fmtDate(order.payment.paidAt)}</p>
          </>
        ) : order.payment.status === 'refunded' ? (
          <p className="font-bold text-chili">REFUNDED</p>
        ) : (
          <p className="font-bold">Payment due · {PAY_LABEL[order.payment.method]}</p>
        )}
      </div>
      <p className="mt-4 text-center text-xs text-soft">Thank you for visiting RSN CAFE, Kalpitiya.</p>
    </div>
  );
}
