import { CAFE } from '@/lib/cafe';

export default function Footer() {
  return (
    <footer className="no-print mt-16 bg-ink text-salt">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-extrabold">RSN CAFE</p>
          <p className="mt-2 text-sm text-salt/70">Coffee and bites by the Kalpitiya lagoon.</p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Find us</p>
          <p className="mt-1 text-salt/70">{CAFE.address}</p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Open</p>
          <p className="mt-1 text-salt/70">{CAFE.hours}</p>
          <p className="mt-1 text-salt/70">Call {CAFE.phone}</p>
        </div>
      </div>
      <p className="border-t border-salt/15 py-4 text-center text-xs text-salt/60">© {new Date().getFullYear()} RSN CAFE, Kalpitiya</p>
    </footer>
  );
}
