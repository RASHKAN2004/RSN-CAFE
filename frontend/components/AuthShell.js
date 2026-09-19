import Link from "next/link";

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="page-shell py-12">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="panel hidden overflow-hidden bg-[linear-gradient(160deg,#1a6d6a,#153d3b)] p-6 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/75">
              RSN CAFE
            </p>
            <h1 className="mt-4 font-display text-5xl leading-none">
              Lagoon coffee, uplifted.
            </h1>
          </div>

          <div className="mt-12 space-y-4">
            <div className="rounded-[1.4rem] border border-white/20 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-white/70">
                Today
              </p>
              <p className="mt-2 text-2xl font-bold">Hoppers & king coconut</p>
            </div>

            <div className="rounded-[1.4rem] border border-white/20 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-white/70">
                Kalpitiya
              </p>
              <p className="mt-2 text-lg">
                Slow brews, bold flavours, sea breeze.
              </p>
            </div>
          </div>
        </aside>

        <div className="panel p-5 sm:p-6 lg:p-7">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.22em] text-ink-soft">
              Account access
            </p>
            <h2 className="mt-2 text-4xl sm:text-5xl">{title}</h2>
            {subtitle && (
              <p className="mt-2 text-sm leading-6 text-ink-soft">{subtitle}</p>
            )}
          </div>

          {children}

          {footer && (
            <p className="mt-6 text-center text-sm text-ink-soft">{footer}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function FormError({ message }) {
  if (!message) return null;

  return (
    <p
      className="rounded-[1.1rem] border border-danger/30 bg-danger/5 px-4 py-3 text-sm font-semibold text-danger"
      role="alert"
    >
      {message}
    </p>
  );
}
