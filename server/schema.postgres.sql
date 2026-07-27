-- Bioclinica — PostgreSQL šema (migrirano s MariaDB/MySQL)
-- tinyint(1) kolone su INTEGER (0/1) da API upiti "is_active = 1" rade bez izmjena

-- updated_at auto-refresh (zamjena za MySQL ON UPDATE current_timestamp())
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── admin_users ──
DROP TABLE IF EXISTS admin_users CASCADE;
CREATE TABLE admin_users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(100) NOT NULL UNIQUE,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT now(),
  updated_at    TIMESTAMP DEFAULT now()
);
CREATE TRIGGER trg_admin_users_updated BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── categories ──
DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories (
  id          VARCHAR(100) PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMP DEFAULT now(),
  updated_at  TIMESTAMP DEFAULT now()
);
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── products ──
DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (
  id                 VARCHAR(100) PRIMARY KEY,
  category_id        VARCHAR(100) NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name               VARCHAR(255) NOT NULL,
  tagline            VARCHAR(255),
  short_description  TEXT,
  usage_instructions TEXT,
  composition        TEXT,
  warnings           TEXT,
  storage_temp       VARCHAR(255),
  country_of_origin  VARCHAR(100),
  packaging          VARCHAR(100),
  price              NUMERIC(10,2) NOT NULL,
  image_url          TEXT,
  is_active          INTEGER DEFAULT 1,
  sort_order         INTEGER DEFAULT 0,
  created_at         TIMESTAMP DEFAULT now(),
  updated_at         TIMESTAMP DEFAULT now()
);
CREATE INDEX idx_products_category ON products(category_id);
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── product_benefits ──
DROP TABLE IF EXISTS product_benefits CASCADE;
CREATE TABLE product_benefits (
  id         SERIAL PRIMARY KEY,
  product_id VARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  benefit    VARCHAR(255) NOT NULL,
  sort_order INTEGER DEFAULT 0
);
CREATE INDEX idx_product_benefits_product ON product_benefits(product_id);

-- ── product_images ──
DROP TABLE IF EXISTS product_images CASCADE;
CREATE TABLE product_images (
  id         SERIAL PRIMARY KEY,
  product_id VARCHAR(100) NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url  TEXT NOT NULL,
  alt_text   VARCHAR(255),
  sort_order INTEGER DEFAULT 0
);
CREATE INDEX idx_product_images_product ON product_images(product_id);

-- ── blog_posts ──
DROP TABLE IF EXISTS blog_posts CASCADE;
CREATE TABLE blog_posts (
  id           VARCHAR(100) PRIMARY KEY,
  title        VARCHAR(500) NOT NULL,
  excerpt      TEXT,
  content      TEXT,
  image_url    TEXT,
  slug         VARCHAR(255) UNIQUE,
  is_published INTEGER DEFAULT 0,
  published_at TIMESTAMP,
  created_at   TIMESTAMP DEFAULT now(),
  updated_at   TIMESTAMP DEFAULT now()
);
CREATE TRIGGER trg_blog_posts_updated BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── hero_slides ──
DROP TABLE IF EXISTS hero_slides CASCADE;
CREATE TABLE hero_slides (
  id           SERIAL PRIMARY KEY,
  tagline      VARCHAR(255),
  name1        VARCHAR(255) NOT NULL,
  name2        VARCHAR(255),
  name2b       VARCHAR(255),
  sub          TEXT,
  image_url    TEXT,
  accent_color VARCHAR(20) DEFAULT '#d4600a',
  pictograms   TEXT,
  product_id   VARCHAR(100),
  is_active    INTEGER DEFAULT 1,
  sort_order   INTEGER DEFAULT 0,
  created_at   TIMESTAMP DEFAULT now(),
  updated_at   TIMESTAMP DEFAULT now()
);
CREATE TRIGGER trg_hero_slides_updated BEFORE UPDATE ON hero_slides
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── contact_messages ──
DROP TABLE IF EXISTS contact_messages CASCADE;
CREATE TABLE contact_messages (
  id         SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name  VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  subject    VARCHAR(255),
  message    TEXT NOT NULL,
  status     VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new','read','replied','archived')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
CREATE TRIGGER trg_contact_messages_updated BEFORE UPDATE ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── newsletter_subscribers ──
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
CREATE TABLE newsletter_subscribers (
  id              SERIAL PRIMARY KEY,
  email           VARCHAR(255) NOT NULL UNIQUE,
  is_active       INTEGER DEFAULT 1,
  source          VARCHAR(20) DEFAULT 'footer' CHECK (source IN ('header','footer','popup')),
  subscribed_at   TIMESTAMP DEFAULT now(),
  unsubscribed_at TIMESTAMP
);

-- ── seo_settings ──
DROP TABLE IF EXISTS seo_settings CASCADE;
CREATE TABLE seo_settings (
  id               SERIAL PRIMARY KEY,
  page_key         VARCHAR(100) NOT NULL UNIQUE,
  page_label       VARCHAR(255),
  meta_title       VARCHAR(255),
  meta_description TEXT,
  og_title         VARCHAR(255),
  og_description   TEXT,
  og_image         TEXT,
  canonical_url    TEXT,
  updated_at       TIMESTAMP DEFAULT now()
);
CREATE TRIGGER trg_seo_settings_updated BEFORE UPDATE ON seo_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
