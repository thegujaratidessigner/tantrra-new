import { cn } from '@/lib/utils';

export function SectionHeading({
  label,
  title,
  description,
  align = 'center',
  className,
}: {
  label?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {label && (
        <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold sm:text-xs">
          {label}
        </p>
      )}
      <h2 className="font-heading text-[clamp(1.75rem,3vw,2.75rem)] font-semibold leading-tight text-foreground">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
          {description}
        </p>
      )}
    </div>
  );
}
