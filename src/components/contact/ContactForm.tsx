'use client';

import { Button } from '@/components/ui/Button';

const inputClasses =
  'mt-1.5 w-full rounded-md border border-border/80 bg-white px-4 py-2.5 text-[14px] text-foreground transition-colors placeholder:text-foreground-subtle/40 focus:border-green focus:outline-none focus:ring-1 focus:ring-green/30';

const labelClasses = 'block text-[13px] font-medium text-foreground';

export function ContactForm() {
  return (
    <div className="rounded-lg border border-border/60 bg-white p-6 sm:p-8">
      <h2 className="font-heading text-lg font-semibold text-foreground sm:text-xl">
        Send Us a Message
      </h2>
      <p className="mt-1 text-[13px] text-foreground-muted">
        Fill out the form below and we will get back to you as soon as possible.
      </p>

      <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClasses}>
              Name <span className="text-maroon">*</span>
            </label>
            <input type="text" required placeholder="Your name" className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>
              Email <span className="text-maroon">*</span>
            </label>
            <input type="email" required placeholder="your@email.com" className={inputClasses} />
          </div>
        </div>
        <div>
          <label className={labelClasses}>Phone / WhatsApp</label>
          <input type="tel" placeholder="+91 XXXXX XXXXX (optional)" className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>
            Subject <span className="text-maroon">*</span>
          </label>
          <input type="text" required placeholder="How can we help?" className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>
            Message <span className="text-maroon">*</span>
          </label>
          <textarea
            rows={5}
            required
            placeholder="Tell us more about your query..."
            className={inputClasses}
          />
        </div>
        <Button variant="primary-green" size="lg">
          Send Message
        </Button>
      </form>
    </div>
  );
}
