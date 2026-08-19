'use client';

import { consultationServices } from '@/data/consultations';
import { formatPrice } from '@/lib/utils';
import { Pencil } from 'lucide-react';

export default function AdminConsultationsPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        Consultations
      </h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Manage consultation services and view bookings.
      </p>

      {/* Services List */}
      <div className="mt-6 overflow-x-auto rounded-sm border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-cream-dark">
            <tr>
              <th className="px-4 py-3 font-medium text-foreground-muted">
                Service
              </th>
              <th className="px-4 py-3 font-medium text-foreground-muted">
                Packages
              </th>
              <th className="px-4 py-3 font-medium text-foreground-muted">
                Price Range
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
            {consultationServices.map((service) => {
              const prices = service.packages.map((p) => p.price).filter(Boolean);
              const minPrice = prices.length > 0 ? Math.min(...prices) : null;
              const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

              return (
                <tr key={service.id} className="bg-white hover:bg-cream/50">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {service.name}
                  </td>
                  <td className="px-4 py-3 text-foreground-muted">
                    {service.packages.length > 0
                      ? `${service.packages.length} packages`
                      : 'Enquiry only'}
                  </td>
                  <td className="px-4 py-3">
                    {minPrice !== null ? (
                      <span className="font-medium">
                        {minPrice === maxPrice
                          ? formatPrice(minPrice)
                          : `${formatPrice(minPrice)} – ${formatPrice(maxPrice!)}`}
                      </span>
                    ) : (
                      <span className="text-foreground-subtle">On enquiry</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        service.isActive
                          ? 'bg-green-muted text-green'
                          : 'bg-cream-dark text-foreground-subtle'
                      }`}
                    >
                      {service.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="rounded-sm p-1.5 text-foreground-subtle transition-colors hover:bg-cream-dark hover:text-foreground">
                      <Pencil className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bookings */}
      <div className="mt-8">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Recent Bookings
        </h2>
        <div className="mt-3 flex flex-col items-center justify-center rounded-sm border border-border bg-white py-12">
          <p className="text-sm text-foreground-muted">
            Bookings will appear here once users start requesting
            consultations.
          </p>
        </div>
      </div>
    </div>
  );
}
