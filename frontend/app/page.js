import Link from "next/link";
import {
  BellRing,
  Clock3,
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
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="reveal relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-[color:var(--card)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft shadow-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-accent" />
              Coastal comfort, served daily
            </div>

            <h1 className="max-w-xl text-5xl leading-[0.9] sm:text-6xl lg:text-[5.5rem]">
              RSN
              <span className="mt-2 block text-accent">CAFE</span>
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

            <div className="mt-8 flex flex-wrap gap-3 text-sm text-ink-soft">
              <span className="chip">Freshly brewed</span>
              <span className="chip">Hoppers & kottu</span>
              <span className="chip">King coconut</span>
            </div>
          </div>

          <div className="relative">
            <div className="floaty relative overflow-hidden rounded-[2rem] border border-border bg-[linear-gradient(135deg,rgba(26,109,106,0.16),rgba(255,250,245,0.6),rgba(215,161,95,0.16))] p-4 shadow-[var(--shadow)]">
              <div className="absolute -left-12 top-12 h-32 w-32 rounded-full bg-gold/30 blur-3xl" />
              <div className="absolute -right-10 bottom-0 h-44 w-44 rounded-full bg-accent/20 blur-3xl" />

              <div className="relative overflow-hidden rounded-[1.5rem] border border-border bg-[color:var(--surface)] p-4 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-ink-soft">
                      Today’s pick
                    </p>
                    <h2 className="mt-2 text-3xl text-ink">Lagoon Brew</h2>
                  </div>
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-accent-soft text-accent">
                    <span className="text-2xl">☕</span>
                  </div>
                </div>

                <div className="relative">
                  <div className="relative h-64 overflow-hidden rounded-[1.4rem] bg-[radial-gradient(circle_at_top,_rgba(215,161,95,0.3),_rgba(255,250,245,0.2)_30%,_rgba(26,109,106,0.18)_100%)]">
                    <div className="absolute inset-x-8 bottom-0 h-28 rounded-t-[3rem] bg-[linear-gradient(180deg,#1a6d6a,#0f2e2d)]" />
                    <div className="absolute inset-x-14 bottom-20 h-28 rounded-[50%] bg-[radial-gradient(circle_at_50%_20%,#f4d59b,#d7a15f_60%,#b87d36)]" />
                    <div className="absolute left-6 top-8 h-14 w-14 rounded-full border border-border bg-white/25 backdrop-blur-sm" />
                    <div className="absolute right-10 top-12 h-16 w-16 rounded-full border border-border bg-white/20" />
                    <div className="absolute bottom-14 left-10 h-10 w-10 rounded-full bg-accent/20" />
                    <div className="absolute bottom-10 right-16 h-14 w-14 rounded-full bg-gold/20" />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-border bg-[color:var(--surface-strong)] p-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">
                        Fresh
                      </p>
                      <p className="mt-2 text-xl font-bold">Hoppers</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-[color:var(--surface-strong)] p-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">
                        Hot
                      </p>
                      <p className="mt-2 text-xl font-bold">Kottu</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-[color:var(--surface-strong)] p-3">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">
                        Cool
                      </p>
                      <p className="mt-2 text-xl font-bold">King Coconuts</p>
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
              Most loved
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
        <FeaturedItems />
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
