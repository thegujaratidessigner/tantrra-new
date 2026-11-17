import Link from 'next/link';

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-heading text-[clamp(1.5rem,2.5vw,1.9rem)] font-semibold leading-tight text-[#1B3D2F]">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-[13.5px] text-foreground-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = '', title, actions }: { children: React.ReactNode; className?: string; title?: string; actions?: React.ReactNode }) {
  return (
    <section className={`rounded-2xl border border-[#E8E2D4] bg-white p-4 shadow-[0_1px_2px_rgba(27,61,47,0.04)] sm:p-5 ${className}`}>
      {(title || actions) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-[14px] font-semibold text-foreground">{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatCard({ label, value, hint, href, accent = 'green' }: { label: string; value: string; hint?: string; href?: string; accent?: 'green' | 'gold' | 'maroon' | 'slate' }) {
  const bar = { green: 'bg-[#1B3D2F]', gold: 'bg-[#B88A3B]', maroon: 'bg-[#B5342E]', slate: 'bg-[#7A9B68]' }[accent];
  const inner = (
    <div className="relative h-full overflow-hidden rounded-2xl border border-[#E8E2D4] bg-white p-4 transition hover:shadow-[0_6px_24px_rgba(27,61,47,0.08)]">
      <span className={`absolute inset-y-0 left-0 w-1 ${bar}`} />
      <p className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-foreground-subtle">{label}</p>
      <p className="mt-1.5 text-[22px] font-bold tabular-nums text-foreground">{value}</p>
      {hint && <p className="mt-0.5 text-[12px] text-foreground-muted">{hint}</p>}
    </div>
  );
  return href ? <Link href={href} className="block h-full">{inner}</Link> : inner;
}

const BADGE: Record<string, string> = {
  paid: 'bg-[#1B3D2F]/10 text-[#1B3D2F]',
  completed: 'bg-[#1B3D2F]/10 text-[#1B3D2F]',
  delivered: 'bg-[#1B3D2F]/10 text-[#1B3D2F]',
  active: 'bg-[#1B3D2F]/10 text-[#1B3D2F]',
  published: 'bg-[#1B3D2F]/10 text-[#1B3D2F]',
  pending: 'bg-[#B88A3B]/12 text-[#8A6420]',
  unfulfilled: 'bg-[#B88A3B]/12 text-[#8A6420]',
  scheduled: 'bg-[#7A9B68]/15 text-[#4C6B3D]',
  processing: 'bg-[#7A9B68]/15 text-[#4C6B3D]',
  in_progress: 'bg-[#7A9B68]/15 text-[#4C6B3D]',
  shipped: 'bg-[#7A9B68]/15 text-[#4C6B3D]',
  failed: 'bg-[#B5342E]/10 text-[#B5342E]',
  cancelled: 'bg-stone-200 text-stone-600',
  inactive: 'bg-stone-200 text-stone-600',
  draft: 'bg-stone-200 text-stone-600',
  refunded: 'bg-indigo-100 text-indigo-700',
  partially_refunded: 'bg-indigo-100 text-indigo-700',
  test: 'bg-sky-100 text-sky-700',
  live: 'bg-[#1B3D2F] text-white',
};

export function Badge({ value, label }: { value: string; label?: string }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold ${BADGE[value] ?? 'bg-stone-100 text-stone-600'}`}>
      {label ?? value.replace(/_/g, ' ')}
    </span>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#DDD5C3] bg-white/60 px-6 py-12 text-center">
      <p className="text-[14px] font-semibold text-foreground">{title}</p>
      {description && <p className="mt-1 max-w-md text-[13px] text-foreground-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export const table = {
  wrap: 'overflow-x-auto rounded-2xl border border-[#E8E2D4] bg-white',
  table: 'w-full min-w-[640px] text-left text-[13px]',
  th: 'whitespace-nowrap border-b border-[#EFEADF] bg-[#FAF7EF] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-foreground-subtle',
  td: 'border-b border-[#F3EFE6] px-4 py-3 align-top',
  row: 'transition-colors hover:bg-[#FCFAF5]',
};

export const field = {
  label: 'block text-[12.5px] font-medium text-foreground',
  input:
    'mt-1 w-full rounded-lg border border-[#DDD5C3] bg-white px-3 py-2 text-[13.5px] text-foreground placeholder:text-foreground-subtle/50 focus:border-[#1B3D2F] focus:outline-none focus:ring-2 focus:ring-[#1B3D2F]/12',
  help: 'mt-1 text-[11.5px] text-foreground-subtle',
};

export const inr = (paise: number) =>
  `₹${(paise / 100).toLocaleString('en-IN', { minimumFractionDigits: paise % 100 ? 2 : 0, maximumFractionDigits: 2 })}`;

export const inrRupees = (rupees: number) => `₹${rupees.toLocaleString('en-IN')}`;

export const dateTime = (d: Date | string) =>
  new Date(d).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export const dateOnly = (d: Date | string) =>
  new Date(d).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric' });
