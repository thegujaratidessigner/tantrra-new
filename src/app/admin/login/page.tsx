import type { Metadata } from 'next';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/server/admin-auth';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'Sign in' };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getCurrentAdmin()) redirect('/admin');
  const { next } = await searchParams;

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image src="/logo-transparent.png" alt="TANTRRA" width={96} height={96} className="h-20 w-auto" unoptimized priority />
          <h1 className="mt-4 font-heading text-2xl font-semibold text-foreground">Admin Sign In</h1>
          <p className="mt-1 text-[13px] text-foreground-muted">Authorised TANTRRA team members only.</p>
        </div>
        <div className="rounded-2xl border border-[#E8E2D4] bg-white p-6 shadow-[0_10px_40px_rgba(27,61,47,0.08)]">
          <LoginForm next={next ?? '/admin'} />
        </div>
      </div>
    </main>
  );
}
