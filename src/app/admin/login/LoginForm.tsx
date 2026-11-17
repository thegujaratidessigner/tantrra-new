'use client';

import { useActionState } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { signIn, type LoginState } from './actions';

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, { error: null });

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <div>
        <label htmlFor="email" className="block text-[13px] font-medium text-foreground">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="mt-1.5 w-full rounded-lg border border-[#E2DCCD] bg-white px-3.5 py-2.5 text-[14px] focus:border-[#1B3D2F] focus:outline-none focus:ring-2 focus:ring-[#1B3D2F]/15"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-[13px] font-medium text-foreground">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1.5 w-full rounded-lg border border-[#E2DCCD] bg-white px-3.5 py-2.5 text-[14px] focus:border-[#1B3D2F] focus:outline-none focus:ring-2 focus:ring-[#1B3D2F]/15"
        />
      </div>
      {state.error && (
        <p role="alert" className="rounded-lg bg-[#B5342E]/[0.07] px-3.5 py-2.5 text-[13px] text-[#B5342E]">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1B3D2F] px-4 py-3 text-[14px] font-semibold text-white transition hover:bg-[#16332A] disabled:opacity-70"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
