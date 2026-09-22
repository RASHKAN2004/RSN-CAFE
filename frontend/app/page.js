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
            <div className="floaty relative overflow-hidden rounded-[2rem] border border-[#f3efe9]/60 bg-[#0d1d1b] p-4 shadow-[0_30px_80px_rgba(2,10,9,0.42)]">
              <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-[#c8a267]/25 blur-3xl" />
              <div className="absolute -right-8 bottom-0 h-40 w-40 rounded-full bg-[#4cc1b6]/20 blur-3xl" />

              <div className="relative overflow-hidden rounded-[1.75rem] border border-[#f3efe9]/40 bg-[linear-gradient(180deg,#1b3635_0%,#173532_18%,#2a4f4e_100%)] p-4 sm:p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-[0.26em] text-[#d8d3cc]">
                      Today’s pick
                    </p>
                    <h2 className="mt-2 text-4xl text-[#f3efe9] sm:text-[3rem]">
                      Lagoon Brew
                    </h2>
                  </div>
                  <div className="grid h-14 w-14 place-items-center rounded-full border border-[#e7dfd5]/40 bg-[#dfece8] text-[#1a6d6a] shadow-inner shadow-white/20">
                    <Coffee size={26} strokeWidth={1.8} />
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[1.5rem] bg-[radial-gradient(circle_at_top,_rgba(221,190,138,0.32),_rgba(255,255,255,0.08)_33%,_rgba(15,44,44,0.24)_100%)] px-2 pb-2 pt-4">
                  <div className="relative h-56 overflow-hidden rounded-[1.35rem] bg-[linear-gradient(180deg,rgba(31,82,82,0.36),rgba(15,43,42,0.08))]">
                    <div className="absolute left-5 top-4 h-12 w-12 rounded-full bg-[#d9d4cf]/20 backdrop-blur-sm" />
                    <div className="absolute right-10 top-8 h-14 w-14 rounded-full bg-[#d9d4cf]/20 backdrop-blur-sm" />
                    <div className="absolute left-14 bottom-10 h-9 w-9 rounded-full bg-[#78c9c0]/35" />
                    <div className="absolute right-14 bottom-8 h-12 w-12 rounded-full bg-[#55b9aa]/30" />

                    <div className="absolute inset-x-3 bottom-0 h-20 rounded-t-[3rem] bg-[linear-gradient(180deg,#1d6d6a_0%,#163a39_52%,#102d2d_100%)]" />
                    <div className="absolute inset-x-14 bottom-10 h-28 rounded-[48%] bg-[radial-gradient(circle_at_50%_22%,#f4d9a2_0%,#e8c57f_28%,#d7a15f_62%,#b48345_100%)] shadow-[0_0_28px_rgba(223,179,109,0.4)]" />
                    <div className="absolute inset-x-12 bottom-0 h-14 rounded-t-[2.5rem] bg-[linear-gradient(180deg,rgba(19,77,77,0.85),rgba(8,27,31,0.9))]" />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-[#f2efe9]/20 bg-[#c9d0cf]/10 p-3 backdrop-blur-sm">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#dfe0dd]">
                        Fresh
                      </p>
                      <p className="mt-2 text-xl font-bold text-[#f4f0ec]">
                        Hoppers
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[#f2efe9]/20 bg-[#c9d0cf]/10 p-3 backdrop-blur-sm">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#dfe0dd]">
                        Hot
                      </p>
                      <p className="mt-2 text-xl font-bold text-[#f4f0ec]">
                        Kottu
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[#f2efe9]/20 bg-[#c9d0cf]/10 p-3 backdrop-blur-sm">
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#dfe0dd]">
                        Cool
                      </p>
                      <p className="mt-2 text-xl font-bold text-[#f4f0ec]">
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
