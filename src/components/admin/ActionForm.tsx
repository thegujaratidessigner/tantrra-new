'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from './Toast';
import type { ActionResult } from '@/lib/server/admin-action-result';

interface Props {
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  children: React.ReactNode;
  className?: string;
  /** If set, asks for confirmation before submitting. */
  confirm?: string;
  resetOnSuccess?: boolean;
}

export function ActionForm({ action, children, className, confirm, resetOnSuccess }: Props) {
  const [state, formAction, pending] = useActionState(action, { ok: true, message: '', at: 0 });
  const toast = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [asking, setAsking] = useState(false);
  const confirmed = useRef(false);

  useEffect(() => {
    if (!state.at) return;
    if (state.message) toast(state.ok ? 'success' : 'error', state.message);
    if (state.ok && resetOnSuccess) formRef.current?.reset();
  }, [state, toast, resetOnSuccess]);

  return (
    <>
      <form
        ref={formRef}
        action={formAction}
        className={className}
        aria-busy={pending}
        onSubmit={(e) => {
          if (confirm && !confirmed.current) {
            e.preventDefault();
            setAsking(true);
          }
          confirmed.current = false;
        }}
      >
        <fieldset disabled={pending} className="contents">{children}</fieldset>
        {pending && <Loader2 className="sr-only" aria-label="Saving" />}
      </form>
      {asking && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="alertdialog" aria-modal="true">
          <button className="absolute inset-0 bg-black/40" aria-label="Cancel" onClick={() => setAsking(false)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
            <p className="text-[14px] text-foreground">{confirm}</p>
            <div className="mt-5 flex justify-end gap-2">
              <button className={btn.secondary} onClick={() => setAsking(false)} autoFocus>Cancel</button>
              <button
                className={btn.danger}
                onClick={() => {
                  setAsking(false);
                  confirmed.current = true;
                  formRef.current?.requestSubmit();
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export const btn = {
  primary:
    'inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#1B3D2F] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#16332A] disabled:opacity-60',
  secondary:
    'inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#DDD5C3] bg-white px-4 py-2 text-[13px] font-medium text-foreground transition hover:bg-[#FAF7EF] disabled:opacity-60',
  danger:
    'inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#B5342E] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#9C2B26] disabled:opacity-60',
  ghost:
    'inline-flex items-center justify-center gap-1 rounded-md px-2 py-1 text-[12.5px] font-medium text-[#1B3D2F] transition hover:bg-[#1B3D2F]/8 disabled:opacity-50',
};

export function SubmitButton({ children, variant = 'primary' }: { children: React.ReactNode; variant?: keyof typeof btn }) {
  return (
    <button type="submit" className={btn[variant]}>
      {children}
    </button>
  );
}
