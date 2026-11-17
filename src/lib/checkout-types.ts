import type { CartItem } from './types';

export interface CheckoutCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface CheckoutShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CreateOrderRequest {
  checkoutKey: string;
  customer: CheckoutCustomer;
  shipping?: CheckoutShippingAddress;
  notes?: string;
  items: CartItem[];
  dakshinaAmount: number;
}

export interface CreateOrderResponse {
  orderNumber: string;
  accessToken: string;
  paymentStatus: OrderPaymentStatus;
  razorpayOrderId: string;
  amount: number;
  currency: 'INR';
  keyId: string;
  description: string;
  prefill: { name: string; email: string; contact: string };
}

export interface PriceUpdate {
  index: number;
  priceSnapshot: number;
}

export type CheckoutErrorCode =
  | 'payments_unavailable'
  | 'invalid_request'
  | 'invalid_items'
  | 'price_changed'
  | 'gateway_error'
  | 'server_error';

export interface CheckoutErrorResponse {
  error: CheckoutErrorCode;
  message: string;
  priceUpdates?: PriceUpdate[];
  invalidIndexes?: number[];
}

export type OrderPaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'partially_refunded';

export interface PublicOrderView {
  orderNumber: string;
  paymentStatus: OrderPaymentStatus;
  totalPaise: number;
  currency: 'INR';
  requiresShipping: boolean;
  createdAt: string;
  paidAt: string | null;
  items: { name: string; packageName: string | null; quantity: number; lineTotalPaise: number }[];
}
