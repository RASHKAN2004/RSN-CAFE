'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import RequireAuth from '@/components/RequireAuth';
import { api } from '@/lib/api';
import { fmtDate } from '@/lib/cafe';

function Notifications() {
  const [list, setList] = useState(null);
  const [unread, setUnread] = useState(0);

  const load = useCallback(() => api('/notifications').then((d) => { setList(d.notifications); setUnread(d.unreadCount); }).catch(() => setList([])), []);
  useEffect(() => { load(); }, [load]);

  async function markAll() { await api('/notifications/read-all', { method: 'PATCH' }); load(); }
  async function markOne(n) { if (!n.isRead) { await api(`/notifications/${n._id}/read`, { method: 'PATCH' }).catch(() => {}); load(); } }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-4xl font-extrabold">Notifications</h1>
        {unread > 0 && <button className="btn btn-ghost btn-sm" onClick={markAll}>Mark all as read</button>}
      </div>
      {!list && <p className="mt-6 text-soft">Loading…</p>}
      {list && !list.length && <p className="panel mt-6 p-8 text-center text-soft">Nothing here yet. Order updates and payment receipts will appear here.</p>}
      <ul className="mt-6 space-y-3">
        {list?.map((n) => {
          const inner = (
            <>
              <div className="flex items-start justify-between gap-3">
                <p className="font-bold">{!n.isRead && <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-chili" aria-label="Unread" />}{n.title}</p>
                <time className="whitespace-nowrap text-xs text-soft">{fmtDate(n.createdAt)}</time>
              </div>
              <p className="mt-1 text-sm text-soft">{n.message}</p>
            </>
          );
          return (
            <li key={n._id} onClick={() => markOne(n)} className={`panel p-4 ${n.isRead ? '' : 'border-ink'}`}>
              {n.order ? <Link href={`/orders/${n.order}`} className="block">{inner}</Link> : inner}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function NotificationsPage() {
  return <RequireAuth><Notifications /></RequireAuth>;
}
