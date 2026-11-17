'use client';

const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayFailureResponse {
  error: { code?: string; description?: string; reason?: string; metadata?: { order_id?: string; payment_id?: string } };
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void; escape?: boolean; confirm_close?: boolean };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: 'payment.failed', cb: (response: RazorpayFailureResponse) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

let loader: Promise<void> | null = null;

export function loadRazorpayCheckout(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Not in browser'));
  if (window.Razorpay) return Promise.resolve();
  if (!loader) {
    loader = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = CHECKOUT_SRC;
      script.async = true;
      script.onload = () => (window.Razorpay ? resolve() : reject(new Error('Razorpay failed to initialise')));
      script.onerror = () => {
        loader = null;
        script.remove();
        reject(new Error('Could not load Razorpay checkout'));
      };
      document.body.appendChild(script);
    });
  }
  return loader;
}

export function openRazorpayCheckout(
  options: RazorpayOptions,
  onFailed: (response: RazorpayFailureResponse) => void
): void {
  if (!window.Razorpay) throw new Error('Razorpay checkout is not loaded');
  const rzp = new window.Razorpay(options);
  rzp.on('payment.failed', onFailed);
  rzp.open();
}

const SESSION_KEY = 'tantrra-checkout-session';

export interface CheckoutSession {
  checkoutKey: string;
  orderNumber?: string;
  accessToken?: string;
}

function randomKey(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function getCheckoutSession(): CheckoutSession {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as CheckoutSession;
      if (typeof parsed.checkoutKey === 'string' && parsed.checkoutKey.length >= 16) return parsed;
    }
  } catch {}
  const session = { checkoutKey: randomKey() };
  saveCheckoutSession(session);
  return session;
}

export function saveCheckoutSession(session: CheckoutSession): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {}
}

export function clearCheckoutSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}
