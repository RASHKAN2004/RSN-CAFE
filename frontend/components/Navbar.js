"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  LogOut,
  Menu,
  Moon,
  ShoppingBag,
  SunMedium,
  X,
} from "lucide-react";
import { useAuth, useCart } from "@/components/Providers";
import { api } from "@/lib/api";
import { CAFE } from "@/lib/cafe";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("rsn-theme");
    const next = saved || "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("rsn-theme", theme);
  }, [theme]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!user) return setUnread(0);

    const load = () =>
      api("/notifications/unread-count")
        .then((d) => setUnread(d.unreadCount))
        .catch(() => {});

    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [user, pathname]);

  const isStaff = user && (user.role === "admin" || user.role === "staff");

  const links = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Menu" },
    ...(user ? [{ href: "/orders", label: "My orders" }] : []),
    ...(isStaff ? [{ href: "/admin", label: "Dashboard" }] : []),
  ];

  const active = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="no-print sticky top-0 z-40 border-b border-border bg-[color:var(--bg)]/80 backdrop-blur-xl">
      <div className="page-shell flex items-center gap-3 py-3">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3"
          aria-label={`${CAFE.name} home`}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1b5b58,#0f3735)] text-sm font-black text-white shadow-[0_10px_22px_rgba(28,95,92,0.28)]">
            RS
          </span>
          <span className="font-display text-[1.7rem] font-semibold tracking-[-0.05em] text-ink">
            RSN CAFE
          </span>
        </Link>

        <nav
          className="ml-auto hidden items-center gap-2 md:flex"
          aria-label="Main navigation"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
                active(l.href)
                  ? "bg-ink text-bg"
                  : "text-ink-soft hover:bg-[color:var(--surface-strong)] hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <button
            type="button"
            onClick={() =>
              setTheme((current) => (current === "dark" ? "light" : "dark"))
            }
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-[color:var(--card)] text-ink hover:border-accent"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <SunMedium size={18} /> : <Moon size={18} />}
          </button>

          {user && (
            <Link
              href="/notifications"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-[color:var(--card)] text-ink hover:border-accent"
              aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
            >
              <Bell size={18} />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Link>
          )}

          <Link
            href="/cart"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-[color:var(--card)] text-ink hover:border-accent"
            aria-label={`Cart, ${count} items`}
          >
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <button
              type="button"
              className="hidden items-center gap-2 rounded-full border border-border bg-[color:var(--card)] px-4 py-2 text-sm font-semibold md:inline-flex"
              onClick={() => {
                logout();
                router.push("/");
              }}
            >
              <LogOut size={16} />
              Log out
            </button>
          ) : (
            <Link
              href="/login"
              className="btn btn-accent hidden md:inline-flex"
            >
              Log in
            </Link>
          )}

          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-[color:var(--card)] text-ink md:hidden"
            onClick={() => setOpen((current) => !current)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border px-4 pb-4 pt-2 md:hidden">
          <div className="space-y-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`block rounded-full px-4 py-3 text-sm font-semibold ${
                  active(l.href)
                    ? "bg-ink text-bg"
                    : "bg-[color:var(--card)] text-ink"
                }`}
              >
                {l.label}
              </Link>
            ))}

            {user ? (
              <button
                type="button"
                className="mt-2 w-full rounded-full border border-danger/30 bg-danger/5 px-4 py-3 text-left text-sm font-semibold text-danger"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >
                Log out ({user.name})
              </button>
            ) : (
              <Link href="/login" className="btn btn-accent mt-2 w-full">
                Log in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
