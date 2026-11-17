-- TANTRRA orders & Razorpay payments schema.
-- Target: PostgreSQL 14+ (Supabase, Neon, Vercel Postgres). Run once, in order.
-- All tables are server-only: RLS is enabled with no policies, and the public
-- API roles (Supabase anon/authenticated) are revoked. The app connects with a
-- server-side DATABASE_URL that bypasses RLS as the table owner.

BEGIN;

CREATE TABLE IF NOT EXISTS orders (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number         text NOT NULL UNIQUE,
  access_token_hash    text NOT NULL,
  checkout_key         text NOT NULL,
  cart_hash            text NOT NULL,

  customer_name        text NOT NULL,
  customer_email       text NOT NULL,
  customer_phone       text NOT NULL,
  customer_notes       text,

  order_type           text NOT NULL CHECK (order_type IN ('product', 'service', 'mixed')),
  requires_shipping    boolean NOT NULL,
  shipping_address     jsonb,

  subtotal_paise       integer NOT NULL CHECK (subtotal_paise >= 0),
  energization_paise   integer NOT NULL DEFAULT 0 CHECK (energization_paise >= 0),
  dakshina_paise       integer NOT NULL DEFAULT 0 CHECK (dakshina_paise >= 0),
  shipping_paise       integer NOT NULL DEFAULT 0 CHECK (shipping_paise >= 0),
  total_paise          integer NOT NULL CHECK (total_paise >= 100),
  currency             text NOT NULL DEFAULT 'INR' CHECK (currency = 'INR'),

  payment_status       text NOT NULL DEFAULT 'pending'
                       CHECK (payment_status IN ('pending', 'paid', 'failed', 'cancelled', 'refunded', 'partially_refunded')),
  fulfilment_status    text NOT NULL DEFAULT 'unfulfilled'
                       CHECK (fulfilment_status IN ('unfulfilled', 'processing', 'scheduled', 'shipped', 'delivered', 'completed', 'cancelled')),

  razorpay_order_id    text UNIQUE,
  paid_at              timestamptz,
  last_reconciled_at   timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT orders_shipping_required CHECK (NOT requires_shipping OR shipping_address IS NOT NULL),
  CONSTRAINT orders_checkout_attempt UNIQUE (checkout_key, cart_hash)
);

CREATE INDEX IF NOT EXISTS orders_payment_status_idx ON orders (payment_status, created_at DESC);
CREATE INDEX IF NOT EXISTS orders_customer_email_idx ON orders (lower(customer_email));

CREATE TABLE IF NOT EXISTS order_items (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          uuid NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  line_no           integer NOT NULL,
  item_type         text NOT NULL CHECK (item_type IN ('product', 'service')),
  service_type      text,
  ref_id            text NOT NULL,
  variant_id        text,
  name              text NOT NULL,
  package_name      text,
  quantity          integer NOT NULL CHECK (quantity BETWEEN 1 AND 100),
  unit_price_paise  integer NOT NULL CHECK (unit_price_paise > 0),
  energization      boolean NOT NULL DEFAULT false,
  energization_unit_paise integer NOT NULL DEFAULT 0 CHECK (energization_unit_paise >= 0),
  line_total_paise  integer NOT NULL CHECK (line_total_paise > 0),
  devotee_details   jsonb,
  booking_metadata  jsonb,
  created_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (order_id, line_no)
);

CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items (order_id);

CREATE TABLE IF NOT EXISTS payments (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id              uuid NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  razorpay_order_id     text NOT NULL,
  razorpay_payment_id   text NOT NULL UNIQUE,
  status                text NOT NULL CHECK (status IN ('created', 'authorized', 'captured', 'failed', 'refunded')),
  amount_paise          integer NOT NULL,
  currency              text NOT NULL,
  method                text,
  error_code            text,
  error_description     text,
  error_reason          text,
  signature_verified    boolean NOT NULL DEFAULT false,
  verified_via          text CHECK (verified_via IN ('client_callback', 'webhook', 'reconcile')),
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payments_order_idx ON payments (order_id);
CREATE INDEX IF NOT EXISTS payments_rzp_order_idx ON payments (razorpay_order_id);

CREATE TABLE IF NOT EXISTS webhook_events (
  event_id              text PRIMARY KEY,
  event_type            text NOT NULL,
  razorpay_order_id     text,
  razorpay_payment_id   text,
  received_at           timestamptz NOT NULL DEFAULT now(),
  processed_at          timestamptz,
  processing_error      text
);

-- Prepared for the upcoming courier integration; not written to yet.
CREATE TABLE IF NOT EXISTS shipments (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id               uuid NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  provider               text,
  provider_shipment_id   text,
  provider_order_ref     text,
  awb_number             text,
  courier_name           text,
  tracking_url           text,
  status                 text NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending', 'created', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'rto', 'cancelled')),
  shipped_at             timestamptz,
  delivered_at           timestamptz,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_shipment_id)
);

CREATE INDEX IF NOT EXISTS shipments_order_idx ON shipments (order_id);

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS payments_updated_at ON payments;
CREATE TRIGGER payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS shipments_updated_at ON shipments;
CREATE TRIGGER shipments_updated_at BEFORE UPDATE ON shipments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE orders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments      ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE r text;
BEGIN
  FOREACH r IN ARRAY ARRAY['anon', 'authenticated'] LOOP
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = r) THEN
      EXECUTE format('REVOKE ALL ON orders, order_items, payments, webhook_events, shipments FROM %I', r);
    END IF;
  END LOOP;
END $$;

COMMIT;
