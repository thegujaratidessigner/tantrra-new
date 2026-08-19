'use client';

import { MessageSquareQuote, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminTestimonialsPage() {
  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            Testimonials
          </h1>
          <p className="mt-1 text-sm text-foreground-muted">
            Manage customer testimonials and reviews.
          </p>
        </div>
        <Button variant="primary-green" size="sm">
          <Plus className="h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center rounded-sm border border-border bg-white py-16">
        <MessageSquareQuote className="h-12 w-12 text-foreground-subtle" />
        <h2 className="mt-4 font-heading text-lg font-semibold text-foreground">
          No Testimonials Yet
        </h2>
        <p className="mt-1 max-w-sm text-center text-sm text-foreground-muted">
          Add genuine customer testimonials here. They will be displayed
          on the homepage and relevant product pages. Only add real
          testimonials — never fabricate reviews.
        </p>
      </div>
    </div>
  );
}
