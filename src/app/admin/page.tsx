'use client';

import {
  Package,
  ShoppingCart,
  Sparkles,
  Flame,
  Users,
  IndianRupee,
  TrendingUp,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Total Products', value: '5 active', icon: Package, href: '/admin/products', color: 'text-green' },
  { label: 'Pending Orders', value: '—', icon: ShoppingCart, href: '/admin/orders', color: 'text-gold' },
  { label: 'Consultations', value: '—', icon: Sparkles, href: '/admin/consultations', color: 'text-maroon' },
  { label: 'Puja Requests', value: '—', icon: Flame, href: '/admin/pujas', color: 'text-gold' },
  { label: 'Registered Users', value: '—', icon: Users, href: '/admin/users', color: 'text-green' },
  { label: 'Revenue (Month)', value: '—', icon: IndianRupee, href: '/admin/orders', color: 'text-gold' },
];

const recentActivity = [
  { text: 'Admin panel created', time: 'Just now', icon: TrendingUp },
  { text: 'Connect Supabase to enable live data', time: 'Setup required', icon: Clock },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Overview of your TANTRRA platform.
      </p>

      {/* Stats Grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group flex items-start gap-4 rounded-sm border border-border bg-white p-5 transition-all hover:shadow-md"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-sm bg-cream-dark ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-foreground-muted">{stat.label}</p>
              <p className="mt-0.5 font-heading text-xl font-semibold text-foreground">
                {stat.value}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Recent Activity
        </h2>
        <div className="mt-3 space-y-3">
          {recentActivity.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-sm border border-border bg-white p-4"
            >
              <item.icon className="h-4 w-4 text-foreground-subtle" />
              <span className="flex-1 text-sm text-foreground">
                {item.text}
              </span>
              <span className="text-xs text-foreground-subtle">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Setup Notice */}
      <div className="mt-8 rounded-sm border border-gold/20 bg-gold-muted/20 p-5">
        <h3 className="font-heading text-base font-semibold text-foreground">
          Setup Required
        </h3>
        <p className="mt-1 text-sm text-foreground-muted">
          This admin panel displays static data. Connect Supabase and
          configure environment variables to enable live data, order
          management, and user authentication.
        </p>
      </div>
    </div>
  );
}
