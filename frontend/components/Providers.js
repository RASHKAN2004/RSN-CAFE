'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, getToken, setToken } from '@/lib/api';

/* ---------- Toasts ---------- */
const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);

function ToastProvider({ children }) {
  const [list, setList] = useState([]);
  const toast = useCallback((message, type = 'ok') => {
    const id = Math.random().toString(36).slice(2);
    setList((l) => [...l, { id, message, type }]);
    setTimeout(() => setList((l) => l.filter((t) => t.id !== id)), 4000);
  }, []);
  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="no-print fixed bottom-4 left-1/2 z-50 flex w-[92vw] max-w-sm -translate-x-1/2 flex-col gap-2" role="status" aria-live="polite">
        {list.map((t) => (
          <div key={t.id} className={`rounded-xl border-2 px-4 py-3 text-sm font-semibold ${t.type === 'error' ? 'border-chili bg-paper text-chili' : 'border-ink bg-ink text-salt'}`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ---------- Auth ---------- */
const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) return setLoading(false);
    api('/auth/me')
      .then((d) => setUser(d.user))
      .catch((e) => e.status === 401 && setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback((token, u) => { setToken(token); setUser(u); }, []);
  const logout = useCallback(() => { setToken(null); setUser(null); }, []);
  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

/* ---------- Cart ---------- */
const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem('rsn_cart') || '[]')); } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem('rsn_cart', JSON.stringify(items)); }, [items, ready]);

  const add = useCallback((it) =>
    setItems((cur) => {
      const found = cur.find((c) => c.id === it._id);
      if (found) return cur.map((c) => (c.id === it._id ? { ...c, quantity: Math.min(c.quantity + 1, 20) } : c));
      return [...cur, { id: it._id, name: it.name, price: it.price, emoji: it.emoji, quantity: 1 }];
    }), []);
  const dec = useCallback((id) =>
    setItems((cur) => cur.flatMap((c) => (c.id !== id ? [c] : c.quantity > 1 ? [{ ...c, quantity: c.quantity - 1 }] : []))), []);
  const remove = useCallback((id) => setItems((cur) => cur.filter((c) => c.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const value = useMemo(() => ({ items, add, dec, remove, clear, count, subtotal }), [items, add, dec, remove, clear, count, subtotal]);
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export default function Providers({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
