import { Container } from './Container';

export function PageHero({
  label,
  title,
  description,
}: {
  label?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-foreground py-12 sm:py-16 lg:py-20">
      {/* Sacred pattern background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(185,144,69,0.1),transparent_55%)]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="page-hero-pattern" width="200" height="200" patternUnits="userSpaceOnUse">
              <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(185,144,69,1)" strokeWidth="0.4" />
              <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(185,144,69,1)" strokeWidth="0.4" />
              <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(185,144,69,1)" strokeWidth="0.3" />
              <path d="M100 10 Q130 50 100 100 Q70 50 100 10" fill="none" stroke="rgba(185,144,69,1)" strokeWidth="0.3" />
              <path d="M190 100 Q150 130 100 100 Q150 70 190 100" fill="none" stroke="rgba(185,144,69,1)" strokeWidth="0.3" />
              <path d="M100 190 Q70 150 100 100 Q130 150 100 190" fill="none" stroke="rgba(185,144,69,1)" strokeWidth="0.3" />
              <path d="M10 100 Q50 70 100 100 Q50 130 10 100" fill="none" stroke="rgba(185,144,69,1)" strokeWidth="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#page-hero-pattern)" />
        </svg>
      </div>

      <Container className="relative text-center">
        {label && (
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-light sm:text-xs">
            {label}
          </p>
        )}
        <h1 className="font-heading text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-tight text-white">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-white/55">
            {description}
          </p>
        )}
        <div className="mx-auto mt-4 h-[1px] w-16 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      </Container>
    </section>
  );
}
