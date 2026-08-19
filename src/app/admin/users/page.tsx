'use client';

import { Users } from 'lucide-react';

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        Users
      </h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Manage registered users and memberships.
      </p>

      <div className="mt-8 flex flex-col items-center justify-center rounded-sm border border-border bg-white py-16">
        <Users className="h-12 w-12 text-foreground-subtle" />
        <h2 className="mt-4 font-heading text-lg font-semibold text-foreground">
          No Users Yet
        </h2>
        <p className="mt-1 max-w-sm text-center text-sm text-foreground-muted">
          User accounts will appear here once Supabase authentication is
          configured. You will be able to manage roles, membership tiers,
          and access controls.
        </p>
      </div>
    </div>
  );
}
