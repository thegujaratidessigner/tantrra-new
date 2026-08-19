'use client';

import { ShoppingCart } from 'lucide-react';

export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        Orders
      </h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Manage and track customer orders.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center rounded-sm border border-border bg-white py-16">
        <ShoppingCart className="h-12 w-12 text-foreground-subtle" />
        <h2 className="mt-4 font-heading text-lg font-semibold text-foreground">
          No Orders Yet
        </h2>
        <p className="mt-1 max-w-sm text-center text-sm text-foreground-muted">
          Orders will appear here once the payment gateway is connected and
          customers start placing orders. Connect Supabase to enable order
          management.
        </p>
      </div>
    </div>
  );
}
