import Link from "next/link";
import {
  BellRing,
  Clock3,
  Coffee,
  MapPin,
  Navigation,
  Phone,
  Smartphone,
  Wallet,
} from "lucide-react";
import FeaturedItems from "@/components/FeaturedItems";
import { CAFE } from "@/lib/cafe";

export default function Home() {
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(CAFE.mapQuery)}&z=13&output=embed`;
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CAFE.mapQuery)}`;

  return (
    <>
      <section className="page-shell relative overflow-hidden pb-16 pt-8 sm:pt-10 lg:pb-20 lg:pt-12">
        <div className="absolute inset-x-0 top-16 -z-10 mx-auto h-72 w-72 rounded-full bg-gold/20 blur-[120px]" />
        <div className="absolute right-8 top-28 -z-10 h-52 w-52 rounded-full bg-accent/15 blur-[120px]" />

        <div className="grid items-center gap-8 lg:grid-cols-[1.04fr_0.96fr]">
          <div className="reveal relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-[color:var(--card)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-soft shadow-sm backdrop-blur-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-accent" />
              Coastal comfort, served daily
            </div>

            <h1 className="max-w-xl text-5xl leading-[0.9] sm:text-6xl lg:text-[5.2rem]">
              Slow mornings.
              <span className="mt-2 block text-accent">Warm brews.</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-ink-soft sm:text-lg">
              Coffee, Sri Lankan classics, and lagoon-side calm in Kalpitiya.
              From sizzling kottu to slow-brewed coffee, we make the coast feel
              like home.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/menu" className="btn btn-accent">
                Order now
              </Link>
              <a href="#find-us" className="btn btn-ghost">
                Find us
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="chip">Freshly brewed</span>
              <span className="chip">Hoppers & kottu</span>
              <span className="chip">King coconut</span>
            </div>
          </div>

          <div className="relative">
            <div className="floaty relative overflow-hidden rounded-[2.3rem] border border-[#f4efe8]/40 bg-[linear-gradient(140deg,#0f2020_0%,#183b38_45%,#1d5852_100%)] p-4 shadow-[0_30px_90px_rgba(8,13,12,0.45)]">
              <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-[#d7a15f]/25 blur-3xl" />
              <div className="absolute -right-8 bottom-4 h-36 w-36 rounded-full bg-[#7fd4c8]/20 blur-3xl" />

              <div className="relative overflow-hidden rounded-[1.9rem] border border-white/10 bg-[linear-gradient(180deg,#1e3a3c_0%,#163536_25%,#0f2324_100%)] p-4 sm:p-5">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[0.72rem] uppercase tracking-[0.28em] text-[#d7d4d1]">
                      Today’s pick
                    </p>
                    <h2 className="mt-2 text-4xl text-[#f8f4ef] sm:text-[3rem]">
                      Lagoon Brew
                    </h2>
                  </div>
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-[linear-gradient(135deg,#eef2ee,#dfece8)] text-[#1b6f6c] shadow-[inset_0_2px_8px_rgba(255,255,255,0.7)]">
                    <Coffee size={26} strokeWidth={1.8} />
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[1.65rem] bg-[radial-gradient(circle_at_top,_rgba(222,178,104,0.38),_rgba(255,255,255,0.06)_26%,_rgba(16,36,36,0.18)_100%)] px-2 pb-2 pt-4">
                  <div className="relative h-64 overflow-hidden rounded-[1.4rem] bg-[linear-gradient(180deg,rgba(26,86,83,0.4),rgba(14,34,34,0.12))]">
                    <div className="absolute left-4 top-5 h-12 w-12 rounded-full bg-white/18 backdrop-blur-sm" />
                    <div className="absolute right-8 top-8 h-14 w-14 rounded-full bg-white/14 backdrop-blur-sm" />
                    <div className="absolute left-16 bottom-10 h-8 w-8 rounded-full bg-[#79d7ca]/40" />
                    <div className="absolute right-16 bottom-8 h-12 w-12 rounded-full bg-[#7ad3c5]/30" />

                    <div className="absolute inset-x-4 bottom-0 h-20 rounded-t-[3.25rem] bg-[linear-gradient(180deg,#1d766f_0%,#133b3b_40%,#0d2324_100%)]" />
                    <div className="absolute inset-x-12 bottom-10 h-28 rounded-[48%] bg-[radial-gradient(circle_at_50%_20%,#f9e2b5_0%,#f1d49a_28%,#d8a15d_62%,#b98b4d_100%)] shadow-[0_0_30px_rgba(217,161,93,0.42)]" />
                    <div className="absolute inset-x-12 bottom-0 h-12 rounded-t-[2.5rem] bg-[linear-gradient(180deg,rgba(16,62,63,0.9),rgba(9,25,27,0.95))]" />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#eaeaeb]">
                        Fresh
                      </p>
                      <p className="mt-2 text-xl font-bold text-[#f9f4ee]">
                        Hoppers
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#eaeaeb]">
                        Hot
                      </p>
                      <p className="mt-2 text-xl font-bold text-[#f9f4ee]">
                        Kottu
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#eaeaeb]">
                        Cool
                      </p>
                      <p className="mt-2 text-xl font-bold text-[#f9f4ee]">
                        King Coconuts
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-10">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Smartphone,
              t: "Order in seconds",
              d: "Sign up with your phone and get a quick SMS-based verification. No app download required.",
            },
            {
              icon: Wallet,
              t: "Pay how you like",
              d: "Choose cash, card, or wallet when you place your order. We keep it flexible, quick, and clear.",
            },
            {
              icon: BellRing,
              t: "Stay in the loop",
              d: "Receive text updates when your coffee, breakfast, or meal is ready for pickup or delivery.",
            },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="panel p-5">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-accent">
                <Icon size={22} />
              </div>
              <h3 className="text-2xl">{t}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-shell py-12">
        <div className="mb-6 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-ink-soft">
              Signature picks
            </p>
            <h2 className="mt-2 text-4xl sm:text-5xl">Cafe favourites</h2>
          </div>
          <Link
            href="/menu"
            className="text-sm font-semibold text-accent underline-offset-4 hover:underline"
          >
            Full menu
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Fresh",
              title: "Hoppers",
              accent: "from-[#c7d9d4] to-[#7eaca7]",
            },
            {
              label: "Hot",
              title: "Kottu",
              accent: "from-[#d7a15f] to-[#bf7f4f]",
            },
            {
              label: "Cool",
              title: "King Coconuts",
              accent: "from-[#7dcfc2] to-[#4aa79d]",
            },
          ].map((item) => (
            <div key={item.title} className="panel overflow-hidden p-5">
              <div
                className={`mb-5 h-28 rounded-[1.4rem] bg-gradient-to-br ${item.accent} p-4`}
              >
                <div className="flex h-full items-end justify-between">
                  <span className="rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/90">
                    {item.label}
                  </span>
                  <div className="h-10 w-10 rounded-full border border-white/25 bg-white/15 backdrop-blur-sm" />
                </div>
              </div>
              <h3 className="text-3xl text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                Crafted for slow afternoons, coffee breaks, and easy island
                dining.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="find-us" className="page-shell scroll-mt-24 py-14">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.22em] text-ink-soft">
            Find us
          </p>
          <h2 className="mt-2 text-4xl sm:text-5xl">
            Lagoon-side in Kalpitiya
          </h2>
        </div>

        <div className="grid overflow-hidden rounded-[2rem] border border-border bg-[color:var(--surface)] shadow-[var(--shadow)] lg:grid-cols-[0.95fr_1.35fr]">
          <div className="flex flex-col gap-6 bg-[linear-gradient(180deg,#1a6d6a,#123b3a)] p-6 text-white lg:p-8">
            <div className="space-y-6">
              <div className="flex gap-3">
                <MapPin className="mt-1 shrink-0 text-gold" size={20} />
                <p className="text-sm leading-6 text-white/80">
                  {CAFE.address}
                </p>
              </div>
              <div className="flex gap-3">
                <Clock3 className="mt-1 shrink-0 text-gold" size={20} />
                <p className="text-sm leading-6 text-white/80">{CAFE.hours}</p>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-1 shrink-0 text-gold" size={20} />
                <a
                  href={`tel:${CAFE.phone.replace(/\s/g, "")}`}
                  className="text-sm leading-6 text-white/80 underline-offset-4 hover:underline"
                >
                  {CAFE.phone}
                </a>
              </div>
            </div>

            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className="btn mt-auto w-full bg-white text-ink hover:-translate-y-0.5 hover:bg-[#f7efe6]"
            >
              <Navigation size={18} />
              Get directions
            </a>
          </div>

          <iframe
            title="RSN CAFE location map"
            src={mapSrc}
            className="h-[320px] w-full lg:h-full lg:min-h-[420px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
