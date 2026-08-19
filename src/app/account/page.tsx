'use client';

import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { User, Package, Sparkles, Flame, BookOpen, MapPin, LogIn } from 'lucide-react';
import Link from 'next/link';

const accountSections = [
  { title: 'Orders', description: 'View and track your orders', icon: Package, href: '/account/orders' },
  { title: 'Consultations', description: 'Your consultation bookings', icon: Sparkles, href: '/account/consultations' },
  { title: 'Puja Requests', description: 'Track your Puja requests', icon: Flame, href: '/account/pujas' },
  { title: 'Sadhana', description: 'Continue your spiritual practice', icon: BookOpen, href: '/sadhana' },
  { title: 'Addresses', description: 'Manage shipping addresses', icon: MapPin, href: '/account/addresses' },
  { title: 'Profile', description: 'Edit your personal details', icon: User, href: '/account/profile' },
];

export default function AccountPage() {
  const isLoggedIn = false;

  if (!isLoggedIn) {
    return (
      <section className="py-20">
        <Container>
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cream-dark">
              <LogIn className="h-8 w-8 text-foreground-subtle" />
            </div>
            <h1 className="mt-6 font-heading text-3xl font-semibold text-foreground">
              Welcome to TANTRRA
            </h1>
            <p className="mt-3 text-foreground-muted">
              Sign in to access your orders, consultations, Puja requests,
              and Sadhana content.
            </p>

            <div className="mt-8 space-y-4">
              <div>
                <label className="block text-left text-sm font-medium text-foreground">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="mt-1 w-full rounded-sm border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-foreground-subtle focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
                />
              </div>
              <div>
                <label className="block text-left text-sm font-medium text-foreground">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="mt-1 w-full rounded-sm border border-border bg-white px-4 py-3 text-sm text-foreground placeholder:text-foreground-subtle focus:border-green focus:outline-none focus:ring-1 focus:ring-green"
                />
              </div>
              <Button variant="primary-green" size="lg" className="w-full">
                Sign In
              </Button>
              <p className="text-sm text-foreground-muted">
                Don&apos;t have an account?{' '}
                <button className="font-medium text-green hover:underline">
                  Create Account
                </button>
              </p>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <h1 className="font-heading text-3xl font-semibold text-foreground">
          Namaste
        </h1>
        <p className="mt-1 text-foreground-muted">
          Manage your orders, consultations, and spiritual journey.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accountSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group flex items-start gap-4 rounded-sm border border-border bg-white p-5 transition-all hover:shadow-md hover:border-green/20"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-green-muted text-green">
                <section.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-heading text-base font-semibold text-foreground group-hover:text-green">
                  {section.title}
                </h3>
                <p className="mt-0.5 text-sm text-foreground-muted">
                  {section.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
