"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { api } from "@/lib/api";
import { fmtDate } from "@/lib/cafe";

function Notifications() {
  const [list, setList] = useState(null);
  const [unread, setUnread] = useState(0);

  const load = useCallback(
    () =>
      api("/notifications")
        .then((d) => {
          setList(d.notifications);
          setUnread(d.unreadCount);
        })
        .catch(() => setList([])),
    [],
  );

  useEffect(() => {
    load();
  }, [load]);

  async function markAll() {
    await api("/notifications/read-all", { method: "PATCH" });
    load();
  }

  async function markOne(n) {
    if (!n.isRead) {
      await api(`/notifications/${n._id}/read`, { method: "PATCH" }).catch(
        () => {},
      );
      load();
    }
  }

  return (
    <div className="page-shell py-10 pb-24">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-ink-soft">
            Inbox
          </p>
          <h1 className="mt-2 text-5xl">Notifications</h1>
        </div>

        {unread > 0 && (
          <button type="button" className="btn btn-ghost" onClick={markAll}>
            Mark all as read
          </button>
        )}
      </div>

      {!list && <p className="mt-6 text-ink-soft">Loading notifications…</p>}

      {list && !list.length && (
        <div className="panel mt-6 p-8 text-center text-ink-soft">
          Nothing here yet. Order updates and payment receipts will appear here.
        </div>
      )}

      <ul className="mt-6 space-y-4">
        {list?.map((n) => {
          const inner = (
            <>
              <div className="flex items-start justify-between gap-3">
                <p className="font-bold">
                  {!n.isRead && (
                    <span
                      className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-coral"
                      aria-label="Unread"
                    />
                  )}
                  {n.title}
                </p>
                <time className="whitespace-nowrap text-xs text-ink-soft">
                  {fmtDate(n.createdAt)}
                </time>
              </div>
              <p className="mt-1 text-sm leading-6 text-ink-soft">
                {n.message}
              </p>
            </>
          );

          return (
            <li
              key={n._id}
              onClick={() => markOne(n)}
              className={`panel cursor-pointer p-4 transition-colors ${
                n.isRead ? "border-border" : "border-accent/40 bg-accent-soft"
              }`}
            >
              {n.order ? (
                <Link href={`/orders/${n.order}`} className="block">
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <RequireAuth>
      <Notifications />
    </RequireAuth>
  );
}
