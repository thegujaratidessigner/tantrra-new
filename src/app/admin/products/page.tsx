'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/data/products';
import { formatPrice } from '@/lib/utils';
import { Plus, Search, Eye, EyeOff, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminProductsPage() {
  const [showInactive, setShowInactive] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = products
    .filter((p) => (showInactive ? true : p.isActive))
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

  const activeCount = products.filter((p) => p.isActive).length;
  const inactiveCount = products.filter((p) => !p.isActive).length;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            Products
          </h1>
          <p className="mt-1 text-sm text-foreground-muted">
            {activeCount} active, {inactiveCount} hidden
          </p>
        </div>
        <Button variant="primary-green" size="sm">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-sm border border-border bg-white py-2.5 pl-10 pr-4 text-sm focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
          />
        </div>
        <button
          onClick={() => setShowInactive(!showInactive)}
          className={`flex items-center gap-2 rounded-sm border px-4 py-2.5 text-sm font-medium transition-colors ${
            showInactive
              ? 'border-green bg-green-muted text-green'
              : 'border-border text-foreground-muted hover:border-foreground/30'
          }`}
        >
          {showInactive ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
          {showInactive ? 'Showing All' : 'Show Hidden'}
        </button>
      </div>

      {/* Product Table */}
      <div className="mt-4 overflow-x-auto rounded-sm border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-cream-dark">
            <tr>
              <th className="px-4 py-3 font-medium text-foreground-muted">
                Product
              </th>
              <th className="px-4 py-3 font-medium text-foreground-muted">
                Category
              </th>
              <th className="px-4 py-3 font-medium text-foreground-muted">
                Price
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
            {filtered.map((product) => (
              <tr key={product.id} className="bg-white hover:bg-cream/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {product.images[0] ? (
                      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-sm bg-cream-dark">
                        <Image
                          src={product.images[0].src}
                          alt={product.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 flex-shrink-0 rounded-sm bg-cream-dark" />
                    )}
                    <span className="font-medium text-foreground">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 capitalize text-foreground-muted">
                  {product.category.replace('-', ' ')}
                </td>
                <td className="px-4 py-3 font-medium">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      product.isActive
                        ? 'bg-green-muted text-green'
                        : 'bg-cream-dark text-foreground-subtle'
                    }`}
                  >
                    {product.isActive ? 'Active' : 'Hidden'}
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
    </div>
  );
}
