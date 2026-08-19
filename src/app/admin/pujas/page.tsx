'use client';

import { pujas, sevaCategories } from '@/data/pujas';
import { formatPrice } from '@/lib/utils';
import { Pencil, Flame } from 'lucide-react';

export default function AdminPujasPage() {
  const activePujas = pujas.filter((p) => p.isActive);
  const featuredPujas = pujas.filter((p) => p.featured);

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        Puja & Seva
      </h1>
      <p className="mt-1 text-sm text-foreground-muted">
        {activePujas.length} active pujas, {sevaCategories.length} seva
        categories
      </p>

      {/* Pujas Table */}
      <div className="mt-6 overflow-x-auto rounded-sm border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-cream-dark">
            <tr>
              <th className="px-4 py-3 font-medium text-foreground-muted">
                Puja
              </th>
              <th className="px-4 py-3 font-medium text-foreground-muted">
                Purpose
              </th>
              <th className="px-4 py-3 font-medium text-foreground-muted">
                Featured
              </th>
              <th className="px-4 py-3 font-medium text-foreground-muted">
                Status
              </th>
              <th className="px-4 py-3 font-medium text-foreground-muted">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pujas.map((puja) => (
              <tr key={puja.id} className="bg-white hover:bg-cream/50">
                <td className="px-4 py-3 font-medium text-foreground">
                  {puja.name}
                </td>
                <td className="px-4 py-3 text-foreground-muted">
                  {puja.purpose || '—'}
                </td>
                <td className="px-4 py-3">
                  {puja.featured && (
                    <Flame className="h-4 w-4 text-gold" />
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      puja.isActive
                        ? 'bg-green-muted text-green'
                        : 'bg-cream-dark text-foreground-subtle'
                    }`}
                  >
                    {puja.isActive ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="rounded-sm p-1.5 text-foreground-subtle transition-colors hover:bg-cream-dark hover:text-foreground">
                    <Pencil className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Seva Categories */}
      <div className="mt-8">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Seva Categories
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sevaCategories.map((seva) => (
            <div
              key={seva.id}
              className="rounded-sm border border-border bg-white p-4"
            >
              <h3 className="font-heading text-base font-semibold text-foreground">
                {seva.name}
              </h3>
              <p className="mt-1 text-xs text-foreground-muted">
                {seva.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {seva.amounts.map((amt) => (
                  <span
                    key={amt}
                    className="rounded-full bg-gold-muted px-2.5 py-0.5 text-xs font-medium text-gold-dark"
                  >
                    {formatPrice(amt)}
                  </span>
                ))}
                {seva.allowCustom && (
                  <span className="rounded-full bg-cream-dark px-2.5 py-0.5 text-xs font-medium text-foreground-subtle">
                    Custom
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
