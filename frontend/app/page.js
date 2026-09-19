import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  ChefHat,
  Clock3,
  Coffee,
  MapPin,
  Navigation,
  Phone,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { CAFE } from "@/lib/cafe";

const quickActions = [
  "Operational Team",
  "Marketing Team",
  "Chef Team",
  "Design Team",
];

const featureCards = [
  {
    title: "Staff Management",
    description:
      "Assign roles and responsibilities, track working hours, and manage payroll.",
    accent: "from-[#d9a441] to-[#f8d26d]",
    icon: Users,
  },
  {
    title: "Inventory Management",
    description:
      "Track ingredient levels, automate restocks, and monitor kitchen demand.",
    accent: "from-[#2d7a74] to-[#6ec3b7]",
    icon: ShoppingBag,
  },
  {
    title: "Order Management",
    description:
      "Process orders faster, monitor delivery queues, and keep service seamless.",
    accent: "from-[#3d536f] to-[#7ba4d9]",
    icon: BellRing,
  },
  {
    title: "Integration",
    description:
      "Connect POS systems, online ordering, and SMS notifications in one dashboard.",
    accent: "from-[#7d4058] to-[#d889a2]",
    icon: Sparkles,
  },
];

export default function Home() {
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(CAFE.mapQuery)}&z=13&output=embed`;
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CAFE.mapQuery)}`;

  return (
    <main className="min-h-screen bg-[#0a0d12] px-4 py-6 text-white md:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-white/10 bg-[#111821] shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <div className="grid min-h-[860px] xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="relative flex flex-col justify-between border-b border-white/10 bg-[#121a24] p-5 xl:border-b-0 xl:border-r">
            <div className="mb-6">
              <div className="mb-6 flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#f7d05e] via-[#f0b84c] to-[#e09636] text-2xl font-black text-[#0e1720] shadow-lg shadow-[#f0b84c]/25">
                  KS
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight">
                    Sun Palace Restaurant
                  </h1>
                  <p className="text-xs text-slate-400">
                    Bistro • Lounge • Culinary Studio
                  </p>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-[#1a2330] p-4 shadow-inner shadow-black/20">
                <p className="text-sm font-medium text-slate-300">
                  Chef of the month
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#f4d29d] via-[#e9b36d] to-[#c57339] font-black text-lg text-[#1d1d1b]">
                      KS
                    </div>
                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#ffc857] text-[10px] text-[#0d1117]">
                      ★
                    </span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">
                      Chef Syrial
                    </p>
                    <p className="text-xs text-slate-400">
                      Signature plates • Grill
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button className="w-full rounded-xl bg-[#8d5bfe] px-4 py-3 text-left text-sm font-semibold text-white transition hover:bg-[#7c4df0]">
                  Edit Profile
                </button>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="rounded-xl border border-white/10 bg-[#18232d] px-3 py-2.5">
                    <p className="text-slate-400">Email</p>
                    <p className="mt-1 font-medium">sunpalace.com</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-[#18232d] px-3 py-2.5">
                    <p className="text-slate-400">North</p>
                    <p className="mt-1 font-medium">United</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Teams
              </p>
              {quickActions.map((team, index) => (
                <button
                  key={team}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition ${
                    index === 0
                      ? "border-[#3a4d5d] bg-[#1d2a36] text-white"
                      : "border-transparent bg-[#101821] text-slate-300 hover:border-white/10 hover:bg-[#18232d]"
                  }`}
                >
                  <span>{team}</span>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/5 text-[10px]">
                    ›
                  </span>
                </button>
              ))}
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-transparent px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/30 hover:text-white">
                <span className="text-lg">+</span>
                Create a team
              </button>
            </div>
          </aside>

          <div className="relative overflow-hidden bg-[#0e141b] p-4 md:p-6 xl:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(246,180,57,0.18),transparent_30%),radial-gradient(circle_at_left,_rgba(125,91,254,0.14),transparent_25%)]" />
            <div className="relative z-10">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                    Dashboard overview
                  </p>
                  <h2 className="mt-2 text-4xl font-black tracking-tight text-white md:text-5xl">
                    Chef of the month
                  </h2>
                </div>
                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 backdrop-blur-sm">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  Live updates
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {featureCards.map(
                  ({ title, description, accent, icon: Icon }) => (
                    <article
                      key={title}
                      className="group rounded-[26px] border border-white/10 bg-[#121b25] p-4 shadow-[0_15px_35px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:-translate-y-1"
                    >
                      <div
                        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent}`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{title}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-300">
                        {description}
                      </p>
                    </article>
                  ),
                )}
              </div>

              <div className="mt-6 grid gap-5 xl:grid-cols-[1.4fr_0.9fr]">
                <section className="rounded-[30px] border border-white/10 bg-[#111a22] p-5 md:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Total Orders</p>
                      <div className="mt-2 flex items-end gap-3">
                        <span className="text-5xl font-black tracking-tight text-white">
                          1178
                        </span>
                        <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-300">
                          <TrendingUp className="h-3.5 w-3.5" />
                          14.2%
                        </span>
                      </div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d2c35] text-[#f4c95d]">
                      <Coffee className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-[#101821] p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        Average Order
                      </p>
                      <p className="mt-3 text-3xl font-black text-white">
                        22.6
                      </p>
                      <p className="mt-1 text-sm text-slate-400">per hour</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-[#101821] p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        Average Revenue
                      </p>
                      <p className="mt-3 text-3xl font-black text-white">
                        32542.7
                      </p>
                      <p className="mt-1 text-sm text-slate-400">per day</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-[#101821] p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        Conversion
                      </p>
                      <p className="mt-3 text-3xl font-black text-white">82%</p>
                      <p className="mt-1 text-sm text-slate-400">
                        customer flow
                      </p>
                    </div>
                  </div>
                </section>

                <section className="rounded-[30px] border border-white/10 bg-[#111a22] p-5 md:p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-400">This week</p>
                      <h3 className="mt-1 text-2xl font-bold text-white">
                        Overview
                      </h3>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e2a32] text-[#f4c95d]">
                      <ChefHat className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-[#0f171e] p-4">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>North Indian</span>
                      <span>21.7%</span>
                    </div>
                    <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/5">
                      <div className="h-full w-[21.7%] rounded-full bg-gradient-to-r from-[#f7d96d] to-[#f2b84d]" />
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
                      <span>South Indian</span>
                      <span>26.4%</span>
                    </div>
                    <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/5">
                      <div className="h-full w-[26.4%] rounded-full bg-gradient-to-r from-[#7d5bfe] to-[#8db7ff]" />
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
                      <span>Chinese</span>
                      <span>18.9%</span>
                    </div>
                    <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/5">
                      <div className="h-full w-[18.9%] rounded-full bg-gradient-to-r from-[#4ec5ab] to-[#7ad9c2]" />
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between rounded-2xl border border-[#f4c95d]/20 bg-[#1b2430] p-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                        Location
                      </p>
                      <p className="mt-1 text-sm font-medium text-white">
                        Kalpitiya Bay
                      </p>
                    </div>
                    <MapPin className="h-4 w-4 text-[#f4c95d]" />
                  </div>
                </section>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <section className="rounded-[28px] border border-white/10 bg-[#111a22] p-5 md:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Service flow</p>
                      <h3 className="mt-1 text-2xl font-bold text-white">
                        Popular picks
                      </h3>
                    </div>
                    <Link
                      href="/menu"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#f4c95d] hover:text-[#ffd978]"
                    >
                      Full menu <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-3">
                    {[
                      {
                        name: "Grilled sandwich",
                        price: "$12",
                        tag: "Best seller",
                      },
                      { name: "Ceylon coffee", price: "$6", tag: "Most loved" },
                      {
                        name: "Seafood platter",
                        price: "$18",
                        tag: "Chef special",
                      },
                    ].map((item) => (
                      <div
                        key={item.name}
                        className="rounded-2xl border border-white/10 bg-[#0f171e] p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-base font-semibold text-white">
                              {item.name}
                            </p>
                            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#f4c95d]">
                              {item.tag}
                            </p>
                          </div>
                          <span className="rounded-full bg-white/5 px-2 py-1 text-xs font-medium text-slate-200">
                            {item.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-[28px] border border-white/10 bg-gradient-to-br from-[#1d2a35] via-[#101821] to-[#111a22] p-5 md:p-6">
                  <p className="text-sm text-slate-400">Visit us</p>
                  <div className="mt-4 space-y-4 text-sm text-slate-200">
                    <p className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 text-[#f4c95d]" />
                      <span>{CAFE.address}</span>
                    </p>
                    <p className="flex items-center gap-3">
                      <Clock3 className="h-4 w-4 text-[#f4c95d]" />
                      <span>{CAFE.hours}</span>
                    </p>
                    <p className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-[#f4c95d]" />
                      <a
                        href={`tel:${CAFE.phone.replace(/\s/g, "")}`}
                        className="underline decoration-[#f4c95d]/70 underline-offset-4"
                      >
                        {CAFE.phone}
                      </a>
                    </p>
                    <p className="flex items-center gap-3">
                      <Wallet className="h-4 w-4 text-[#f4c95d]" />
                      <span>Card, cash, digital wallets</span>
                    </p>
                  </div>
                  <a
                    href={directions}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#f4c95d] px-4 py-3 font-semibold text-[#111821] transition hover:bg-[#ffd978]"
                  >
                    <Navigation className="h-4 w-4" /> Get directions
                  </a>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
