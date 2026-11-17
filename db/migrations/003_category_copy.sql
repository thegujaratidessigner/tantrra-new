-- Category hero copy shown on /products?category=... (additive).
BEGIN;
ALTER TABLE product_categories ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE product_categories ADD COLUMN IF NOT EXISTS description text;
COMMIT;
