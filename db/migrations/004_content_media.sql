-- Website content & media managed from the admin panel (additive).
BEGIN;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_rate_unconfirmed boolean NOT NULL DEFAULT false;

-- Banners are grouped by placement so each existing layout keeps its own design.
CREATE TABLE IF NOT EXISTS banners (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  placement               text NOT NULL CHECK (placement IN (
                            'home_hero', 'why_tantrra', 'page_hero_products', 'page_hero_consultations',
                            'page_hero_puja', 'page_hero_about', 'page_hero_contact')),
  eyebrow                 text,
  heading                 text,
  highlight               text,
  description             text,
  cta_primary_label       text,
  cta_primary_href        text,
  cta_secondary_label     text,
  cta_secondary_href      text,
  media_type              text NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  desktop_src             text,
  mobile_src              text,
  poster_src              text,
  object_position         text NOT NULL DEFAULT 'center',
  mobile_object_position  text,
  alt                     text NOT NULL DEFAULT '',
  is_active               boolean NOT NULL DEFAULT true,
  sort_order              integer NOT NULL DEFAULT 0,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS banners_placement_idx ON banners (placement, is_active, sort_order);

CREATE TABLE IF NOT EXISTS videos (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  placement    text NOT NULL CHECK (placement IN ('home_carousel', 'home_banner_row', 'home_floating', 'youtube')),
  title        text NOT NULL DEFAULT '',
  description  text,
  src          text,
  youtube_id   text,
  poster_src   text,
  link_url     text,
  link_label   text,
  is_active    boolean NOT NULL DEFAULT true,
  sort_order   integer NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT videos_source CHECK (src IS NOT NULL OR youtube_id IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS videos_placement_idx ON videos (placement, is_active, sort_order);

CREATE TABLE IF NOT EXISTS gallery_images (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  src           text NOT NULL UNIQUE,
  alt           text NOT NULL DEFAULT '',
  caption       text,
  show_on_home  boolean NOT NULL DEFAULT true,
  is_active     boolean NOT NULL DEFAULT true,
  sort_order    integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS gallery_images_order_idx ON gallery_images (is_active, sort_order);

CREATE TABLE IF NOT EXISTS testimonials (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  location      text,
  content       text NOT NULL,
  rating        smallint NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  service       text,
  is_published  boolean NOT NULL DEFAULT false,
  sort_order    integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS faqs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question    text NOT NULL UNIQUE,
  answer      text NOT NULL,
  is_active   boolean NOT NULL DEFAULT true,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Structured copy blocks (section headings, founder bio, footer, ...); defaults live in code.
CREATE TABLE IF NOT EXISTS content_blocks (
  key         text PRIMARY KEY,
  value       jsonb NOT NULL,
  updated_by  uuid,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS media_assets (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket         text NOT NULL,
  path           text NOT NULL,
  public_url     text NOT NULL UNIQUE,
  kind           text NOT NULL CHECK (kind IN ('image', 'video')),
  mime_type      text NOT NULL,
  size_bytes     bigint NOT NULL CHECK (size_bytes > 0),
  width          integer,
  height         integer,
  alt            text NOT NULL DEFAULT '',
  original_name  text,
  uploaded_by    uuid,
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (bucket, path)
);
CREATE INDEX IF NOT EXISTS media_assets_created_idx ON media_assets (kind, created_at DESC);

DO $$
DECLARE t text; r text;
BEGIN
  FOREACH t IN ARRAY ARRAY['banners', 'videos', 'gallery_images', 'testimonials', 'faqs', 'content_blocks'] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I', t || '_updated_at', t);
    EXECUTE format('CREATE TRIGGER %I BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at()', t || '_updated_at', t);
  END LOOP;
  FOREACH t IN ARRAY ARRAY['banners', 'videos', 'gallery_images', 'testimonials', 'faqs', 'content_blocks', 'media_assets'] LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    FOREACH r IN ARRAY ARRAY['anon', 'authenticated'] LOOP
      IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = r) THEN
        EXECUTE format('REVOKE ALL ON %I FROM %I', t, r);
      END IF;
    END LOOP;
  END LOOP;
END $$;

COMMIT;
