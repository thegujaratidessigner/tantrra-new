-- Hidden test-only products that only signed-in admins can buy through the normal
-- checkout, and a flag on the resulting orders so they never count as sales.
BEGIN;

ALTER TABLE products ADD COLUMN IF NOT EXISTS test_only boolean NOT NULL DEFAULT false;
DO $$ BEGIN
  -- A test product can never be live in the public store.
  ALTER TABLE products ADD CONSTRAINT products_test_only_hidden CHECK (NOT (test_only AND (is_active OR featured)));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS internal_test boolean NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS orders_internal_test_idx ON orders (internal_test) WHERE internal_test;

COMMIT;
