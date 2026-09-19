export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-12">
      <div className="w-full">
        <h1 className="text-4xl font-extrabold">{title}</h1>
        {subtitle && <p className="mt-2 text-soft">{subtitle}</p>}
        <div className="panel mt-6 p-6">{children}</div>
        {footer && <p className="mt-5 text-center text-sm text-soft">{footer}</p>}
      </div>
    </div>
  );
}

export function FormError({ message }) {
  if (!message) return null;
  return <p className="rounded-xl bg-chili/10 px-4 py-3 text-sm font-semibold text-chili" role="alert">{message}</p>;
}
