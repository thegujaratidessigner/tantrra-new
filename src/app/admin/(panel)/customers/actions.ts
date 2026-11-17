'use server';

import { revalidatePath } from 'next/cache';
import { audit, requireAdminAction } from '@/lib/server/admin-auth';
import { requireDb } from '@/lib/server/data';
import { fail, ok, type ActionResult } from '@/lib/server/admin-action-result';
import { cleanText } from '@/lib/content/schema';

export async function saveCustomerNotes(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdminAction('customers.manage').catch(() => null);
  if (!admin) return fail('You do not have permission to edit customers.');
  const id = String(formData.get('id') ?? '');
  if (!/^[0-9a-f-]{36}$/i.test(id)) return fail('Invalid request.');
  const notes = cleanText(formData.get('notes'), 4000);
  const rows = await requireDb()`UPDATE customers SET admin_notes = ${notes || null} WHERE id = ${id} RETURNING id`;
  if (!rows.length) return fail('Customer not found.');
  await audit(admin, 'update_notes', 'customer', id);
  revalidatePath(`/admin/customers/${id}`);
  return ok('Notes saved.');
}
