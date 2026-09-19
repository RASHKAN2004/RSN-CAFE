'use client';
import { useState } from 'react';
import RequireAuth from '@/components/RequireAuth';
import Overview from '@/components/admin/Overview';
import OrdersPanel from '@/components/admin/OrdersPanel';
import MenuManager from '@/components/admin/MenuManager';
import PosPanel from '@/components/admin/PosPanel';

const TABS = [
  ['orders', 'Orders', OrdersPanel],
  ['pos', 'Counter billing', PosPanel],
  ['menu', 'Menu', MenuManager],
  ['overview', 'Sales', Overview],
];

function Dashboard() {
  const [tab, setTab] = useState('orders');
  const Panel = TABS.find((t) => t[0] === tab)[2];
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-extrabold">Dashboard</h1>
      <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto border-b-2 border-mist px-4 pb-4" role="tablist">
        {TABS.map(([k, label]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
            className={`whitespace-nowrap rounded-xl border-2 border-ink px-5 py-2 font-semibold ${tab === k ? 'bg-ink text-salt' : 'hover:bg-mist'}`}>{label}</button>
        ))}
      </div>
      <div className="mt-6"><Panel /></div>
    </div>
  );
}

export default function AdminPage() {
  return <RequireAuth roles={['admin', 'staff']}><Dashboard /></RequireAuth>;
}
