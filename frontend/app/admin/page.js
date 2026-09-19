"use client";

import { useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import Overview from "@/components/admin/Overview";
import OrdersPanel from "@/components/admin/OrdersPanel";
import MenuManager from "@/components/admin/MenuManager";
import PosPanel from "@/components/admin/PosPanel";

const TABS = [
  ["orders", "Orders", OrdersPanel],
  ["pos", "Counter billing", PosPanel],
  ["menu", "Menu", MenuManager],
  ["overview", "Sales", Overview],
];

function Dashboard() {
  const [tab, setTab] = useState("orders");
  const Panel = TABS.find((t) => t[0] === tab)[2];

  return (
    <div className="page-shell py-10 pb-24">
      <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-ink-soft">
            Operations
          </p>
          <h1 className="mt-2 text-5xl">Dashboard</h1>
        </div>

        <div className="chip">Live service overview</div>
      </div>

      <div className="panel p-2">
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Admin sections"
        >
          {TABS.map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                tab === key
                  ? "bg-ink text-bg"
                  : "text-ink-soft hover:bg-[color:var(--surface-strong)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7">
        <Panel />
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <RequireAuth roles={["admin", "staff"]}>
      <Dashboard />
    </RequireAuth>
  );
}
