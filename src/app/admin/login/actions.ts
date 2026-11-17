'use server';

import crypto from 'node:crypto';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient, supabaseConfigured } from '@/lib/supabase/server';
import { getDbOrNull } from '@/lib/server/data';
import { withinRateLimit } from '@/lib/server/rate-limit';

export interface LoginState {
  error: string | null;
}

const safeNext = (v: FormDataEntryValue | null) => {
  const s = typeof v === 'string' ? v : '';
  return s.startsWith('/admin') && !s.startsWith('//') && !s.startsWith('/admin/login') ? s : '/admin';
};

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const sql = getDbOrNull();
  if (!supabaseConfigured() || !sql) return { error: 'Admin sign-in is not configured on this deployment.' };

  const email = String(formData.get('email') ?? '').trim().toLowerCase().slice(0, 254);
  const password = String(formData.get('password') ?? '');
  if (!email || !password) return { error: 'Enter your email and password.' };

  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown';
  const ipKey = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 24);
  const emailKey = crypto.createHash('sha256').update(email).digest('hex').slice(0, 24);
  const [ipOk, emailOk] = await Promise.all([
    withinRateLimit(sql, `admin-login-ip:${ipKey}`, 20, 900),
    withinRateLimit(sql, `admin-login-email:${emailKey}`, 8, 900),
  ]);
  if (!ipOk || !emailOk) return { error: 'Too many sign-in attempts. Please wait 15 minutes and try again.' };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: 'Incorrect email or password.' };

  const [admin] = await sql<{ role: string }[]>`
    SELECT role FROM admin_users WHERE user_id = ${data.user.id} AND is_active`;
  if (!admin) {
    await supabase.auth.signOut();
    return { error: 'This account does not have admin access.' };
  }

  redirect(safeNext(formData.get('next')));
}

export async function signOut() {
  if (supabaseConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect('/admin/login');
}
