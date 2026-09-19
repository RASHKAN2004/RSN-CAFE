"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, LogOut, Menu, ShoppingBag, X } from "lucide-react";
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

  useEffect(() => setOpen(false), [pathname]);

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
  const active = (h) => (h === "/" ? pathname === "/" : pathname.startsWith(h));

  return (
    <header className="no-print sticky top-0 z-40 border-b border-[#c7cacf] bg-[#dfe1e2] shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-[1600px] items-center gap-4 px-4 py-3 md:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-3xl font-extrabold tracking-tight"
          aria-label={`${CAFE.name} home`}
        >
          <span className="text-[#143a40]">RSN</span>
          <span className="text-[#0d5660]">CAFE</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-xl px-4 py-2.5 text-[1.02rem] font-semibold transition ${active(l.href) ? "bg-[#111b22] text-white shadow-sm" : "text-[#1b2a2f] hover:bg-white/50"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {user && (
            <Link
              href="/notifications"
              className="relative rounded-xl p-2 text-[#1d2d31] transition hover:bg-white/40"
              aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
            >
              <Bell size={22} />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#e94a3d] px-1 text-[10px] font-bold text-white">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Link>
          )}
          <Link
            href="/cart"
            className="relative rounded-xl p-2 text-[#1d2d31] transition hover:bg-white/40"
            aria-label={`Cart, ${count} items`}
          >
            <ShoppingBag size={22} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#f3c45d] px-1 text-[10px] font-bold text-[#1a2228]">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <button
              className="hidden items-center gap-2 rounded-xl border border-[#1d3035] bg-[#111b22] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d2a31] md:inline-flex"
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
              className="hidden items-center justify-center rounded-xl border border-[#1d3035] bg-[#111b22] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d2a31] md:inline-flex"
            >
              Log in
            </Link>
          )}

          <button
            className="rounded-xl p-2 text-[#1d2d31] hover:bg-white/40 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[#c7cacf] bg-[#dfe1e2] px-4 pb-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`mt-2 block rounded-xl px-3 py-3 text-base font-semibold ${active(l.href) ? "bg-[#111b22] text-white" : "text-[#1b2a2f]"}`}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <button
              className="mt-2 w-full rounded-xl border border-[#1d3035] bg-[#111b22] px-3 py-3 text-left text-base font-semibold text-white"
              onClick={() => {
                logout();
                router.push("/");
              }}
            >
              Log out ({user.name})
            </button>
          ) : (
            <Link
              href="/login"
              className="mt-2 block rounded-xl border border-[#1d3035] bg-[#111b22] px-3 py-3 text-center text-base font-semibold text-white"
            >
              Log in
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
