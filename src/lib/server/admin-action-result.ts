export interface ActionResult {
  ok: boolean;
  message: string;
  /** Timestamp so repeated identical results still trigger a toast. */
  at: number;
}

export const ok = (message: string): ActionResult => ({ ok: true, message, at: Date.now() });
export const fail = (message: string): ActionResult => ({ ok: false, message, at: Date.now() });
