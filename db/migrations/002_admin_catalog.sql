-- Admin roles, customers, order bookkeeping, catalog and settings.
-- Additive only: no existing column or row is dropped or rewritten.
-- All tables are server-only (RLS on, no policies, API roles revoked);
-- the app reads/writes them through the server-side DATABASE_URL connection.

BEGIN;

-- ── Admin users (identity lives in Supabase Auth; role lives here) ─────────
CREATE TABLE IF NOT EXISTS admin_users (
  user_id       uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email         text NOT NULL,
  role          text NOT NULL CHECK (role IN ('super_admin', 'admin', 'editor')),
  display_name  text,
  is_active     boolean NOT NULL DEFAULT true,
  created_by    uuid,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS admin_users_email_idx ON admin_users (lower(email));

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_id     uuid,
  actor_email  text,
  action       text NOT NULL,
  entity       text NOT NULL,
  entity_id    text,
  details      jsonb,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS admin_audit_log_entity_idx ON admin_audit_log (entity, entity_id, created_at DESC);

-- ── Customers (one row per email, linked from orders) ───────────────────────
CREATE TABLE IF NOT EXISTS customers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email           text NOT NULL,
  name            text NOT NULL,
  phone           text,
  admin_notes     text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS customers_email_idx ON customers (lower(email));

ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES customers (id) ON DELETE RESTRICT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_mode text NOT NULL DEFAULT 'test';
DO $$ BEGIN
  ALTER TABLE orders ADD CONSTRAINT orders_payment_mode_check CHECK (payment_mode IN ('test', 'live'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS orders_customer_idx ON orders (customer_id);
CREATE INDEX IF NOT EXISTS orders_created_idx ON orders (created_at DESC);

INSERT INTO customers (email, name, phone)
SELECT DISTINCT ON (lower(customer_email)) lower(customer_email), customer_name, customer_phone
FROM orders ORDER BY lower(customer_email), created_at DESC
ON CONFLICT DO NOTHING;
UPDATE orders o SET customer_id = c.id FROM customers c
WHERE o.customer_id IS NULL AND lower(o.customer_email) = lower(c.email);

-- Per-booking fulfilment (a mixed cart can hold a Puja and a product).
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS fulfilment_status text NOT NULL DEFAULT 'pending';
DO $$ BEGIN
  ALTER TABLE order_items ADD CONSTRAINT order_items_fulfilment_check
    CHECK (fulfilment_status IN ('pending', 'scheduled', 'in_progress', 'completed', 'shipped', 'delivered', 'cancelled'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
CREATE INDEX IF NOT EXISTS order_items_service_type_idx ON order_items (service_type, fulfilment_status);

ALTER TABLE payments ADD COLUMN IF NOT EXISTS amount_refunded_paise integer NOT NULL DEFAULT 0;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS refund_status text;

-- Fulfilment history + internal notes, append-only.
CREATE TABLE IF NOT EXISTS order_events (
  id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id      uuid NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  order_item_id uuid REFERENCES order_items (id) ON DELETE CASCADE,
  kind          text NOT NULL CHECK (kind IN ('fulfilment', 'item_fulfilment', 'note', 'payment')),
  from_status   text,
  to_status     text,
  body          text,
  actor_id      uuid,
  actor_email   text,
  created_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS order_events_order_idx ON order_events (order_id, created_at);

-- ── Catalog: products ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_categories (
  slug        text PRIMARY KEY,
  name        text NOT NULL,
  sort_order  integer NOT NULL DEFAULT 0,
  is_active   boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS products (
  id                      text PRIMARY KEY,
  slug                    text NOT NULL UNIQUE,
  name                    text NOT NULL,
  category_slug           text NOT NULL REFERENCES product_categories (slug) ON UPDATE CASCADE,
  short_description       text NOT NULL DEFAULT '',
  long_description        text NOT NULL DEFAULT '',
  purpose                 text NOT NULL DEFAULT '',
  price                   integer NOT NULL CHECK (price > 0),
  compare_price           integer CHECK (compare_price IS NULL OR compare_price > 0),
  sku                     text,
  weight                  text,
  preparation_info        text,
  how_to_use              text,
  care_instructions       text,
  benefits                text[] NOT NULL DEFAULT '{}',
  recommended_for         text[] NOT NULL DEFAULT '{}',
  kit_includes            text[] NOT NULL DEFAULT '{}',
  videos                  text[] NOT NULL DEFAULT '{}',
  related_products        text[] NOT NULL DEFAULT '{}',
  related_puja            text[] NOT NULL DEFAULT '{}',
  related_consultation    text[] NOT NULL DEFAULT '{}',
  badge                   text,
  whatsapp_customization  boolean NOT NULL DEFAULT false,
  featured                boolean NOT NULL DEFAULT false,
  is_active               boolean NOT NULL DEFAULT true,
  in_stock                boolean NOT NULL DEFAULT true,
  stock_quantity          integer CHECK (stock_quantity IS NULL OR stock_quantity >= 0),
  energization_available  boolean NOT NULL DEFAULT false,
  seo_title               text,
  seo_description         text,
  sort_order              integer NOT NULL DEFAULT 0,
  archived_at             timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS products_listing_idx ON products (is_active, sort_order) WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS product_images (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  text NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  src         text NOT NULL,
  alt         text NOT NULL DEFAULT '',
  kind        text NOT NULL DEFAULT 'gallery' CHECK (kind IN ('hero', 'info', 'preparation', 'gallery')),
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, src)
);
CREATE INDEX IF NOT EXISTS product_images_product_idx ON product_images (product_id, sort_order);

CREATE TABLE IF NOT EXISTS product_variants (
  id          text PRIMARY KEY,
  product_id  text NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  name        text NOT NULL,
  color       text,
  price       integer CHECK (price IS NULL OR price > 0),
  sku         text,
  in_stock    boolean NOT NULL DEFAULT true,
  sort_order  integer NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS product_variants_product_idx ON product_variants (product_id, sort_order);

-- ── Catalog: services (consultations, puja, chadava, daan) ──────────────────
-- service_offerings.id is exactly the serviceId the cart sends, so existing
-- carts and the checkout pricing engine resolve directly against this table.
CREATE TABLE IF NOT EXISTS service_groups (
  id                 text PRIMARY KEY,
  kind               text NOT NULL CHECK (kind IN ('consultation', 'navagraha-day')),
  slug               text UNIQUE,
  name               text NOT NULL,
  name_alt           text,
  short_description  text NOT NULL DEFAULT '',
  long_description   text NOT NULL DEFAULT '',
  icon               text,
  image_url          text,
  turnaround_days    text,
  seo_title          text,
  seo_description    text,
  featured           boolean NOT NULL DEFAULT false,
  is_active          boolean NOT NULL DEFAULT true,
  sort_order         integer NOT NULL DEFAULT 0,
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS service_offerings (
  id                 text PRIMARY KEY,
  kind               text NOT NULL CHECK (kind IN ('consultation', 'puja', 'chadava-deity', 'chadava-navagraha', 'chadava-tithi', 'daan-seva')),
  source_id          text NOT NULL,
  group_id           text REFERENCES service_groups (id) ON DELETE RESTRICT,
  slug               text,
  name               text NOT NULL,
  name_alt           text,
  short_description  text NOT NULL DEFAULT '',
  long_description   text NOT NULL DEFAULT '',
  includes           text[] NOT NULL DEFAULT '{}',
  image_url          text,
  price              integer CHECK (price IS NULL OR price > 0),
  preset_amounts     integer[] NOT NULL DEFAULT '{}',
  allow_custom       boolean NOT NULL DEFAULT false,
  duration           text,
  metadata           jsonb NOT NULL DEFAULT '{}',
  featured           boolean NOT NULL DEFAULT false,
  is_active          boolean NOT NULL DEFAULT true,
  sort_order         integer NOT NULL DEFAULT 0,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT service_offerings_price_required CHECK (
    price IS NOT NULL OR kind = 'daan-seva' OR NOT is_active
  ),
  UNIQUE (kind, source_id)
);
CREATE INDEX IF NOT EXISTS service_offerings_kind_idx ON service_offerings (kind, is_active, sort_order);

-- ── Site settings (typed JSON per key, validated in the app) ────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  key         text PRIMARY KEY,
  value       jsonb NOT NULL,
  updated_by  uuid,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ── Fixed-window rate limiting for public endpoints ─────────────────────────
CREATE TABLE IF NOT EXISTS rate_limits (
  bucket        text NOT NULL,
  window_start  timestamptz NOT NULL,
  hits          integer NOT NULL DEFAULT 0,
  PRIMARY KEY (bucket, window_start)
);

-- ── updated_at triggers ─────────────────────────────────────────────────────
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['admin_users', 'customers', 'products', 'service_groups', 'service_offerings', 'site_settings'] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I', t || '_updated_at', t);
    EXECUTE format('CREATE TRIGGER %I BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at()', t || '_updated_at', t);
  END LOOP;
END $$;

-- ── Lock down: server-only access ───────────────────────────────────────────
DO $$
DECLARE t text; r text;
BEGIN
  FOREACH t IN ARRAY ARRAY['admin_users', 'admin_audit_log', 'customers', 'order_events', 'product_categories', 'products',
                           'product_images', 'product_variants', 'service_groups', 'service_offerings', 'site_settings', 'rate_limits'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    FOREACH r IN ARRAY ARRAY['anon', 'authenticated'] LOOP
      IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = r) THEN
        EXECUTE format('REVOKE ALL ON %I FROM %I', t, r);
      END IF;
    END LOOP;
  END LOOP;
END $$;

COMMIT;
