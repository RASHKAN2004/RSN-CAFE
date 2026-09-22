import { CAFE } from "@/lib/cafe";

export default function Footer() {
  return (
    <footer className="no-print mt-16 border-t border-border bg-[linear-gradient(180deg,#0d1817,#101b1a)] text-white">
      <div className="page-shell grid gap-8 py-10 sm:grid-cols-3">
        <div>
          <p className="font-display text-4xl font-semibold tracking-[-0.05em] text-[#f7efe8]">
            RSN CAFE
          </p>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Coffee and Sri Lankan comfort by the Kalpitiya lagoon.
          </p>
        </div>

        <div className="text-sm text-white/70">
          <p className="font-semibold text-white">Find us</p>
          <p className="mt-2 leading-6">{CAFE.address}</p>
        </div>

        <div className="text-sm text-white/70">
          <p className="font-semibold text-white">Open</p>
          <p className="mt-2 leading-6">{CAFE.hours}</p>
          <p className="mt-2 leading-6">Call {CAFE.phone}</p>
        </div>
      </div>

      <p className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} RSN CAFE, Kalpitiya
      </p>
    </footer>
  );
}
