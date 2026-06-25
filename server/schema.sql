-- Bioclinica MySQL Schema
-- Pokrenuti jednom pri deploymentu: mysql -u root -p bioclinica < schema.sql

CREATE DATABASE IF NOT EXISTS bioclinica CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bioclinica;

-- -----------------------------------------------
-- Admin korisnici
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -----------------------------------------------
-- Kategorije
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -----------------------------------------------
-- Proizvodi
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(100) PRIMARY KEY,
  category_id VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  short_description TEXT,
  packaging VARCHAR(100),
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_active TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Benefits kao posebna tablica (1:N)
CREATE TABLE IF NOT EXISTS product_benefits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id VARCHAR(100) NOT NULL,
  benefit VARCHAR(255) NOT NULL,
  sort_order INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Slike proizvoda (galerija)
CREATE TABLE IF NOT EXISTS product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id VARCHAR(100) NOT NULL,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  sort_order INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- -----------------------------------------------
-- Blog članci
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS blog_posts (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  excerpt TEXT,
  content LONGTEXT,
  image_url TEXT,
  slug VARCHAR(255) UNIQUE,
  is_published TINYINT(1) DEFAULT 0,
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -----------------------------------------------
-- Kontakt poruke / Narudžbe
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -----------------------------------------------
-- Newsletter pretplatnici
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  is_active TINYINT(1) DEFAULT 1,
  source ENUM('header', 'footer', 'popup') DEFAULT 'footer',
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP NULL
);

-- -----------------------------------------------
-- Hero slajdovi (naslovnica)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS hero_slides (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tagline VARCHAR(255),
  name1 VARCHAR(255) NOT NULL,
  name2 VARCHAR(255),
  name2b VARCHAR(255),
  sub TEXT,
  image_url TEXT,
  accent_color VARCHAR(20) DEFAULT '#d4600a',
  pictograms JSON,
  product_id VARCHAR(100),
  is_active TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -----------------------------------------------
-- SEO postavke (po stranici)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS seo_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_key VARCHAR(100) NOT NULL UNIQUE,
  page_label VARCHAR(255),
  meta_title VARCHAR(255),
  meta_description TEXT,
  og_title VARCHAR(255),
  og_description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -----------------------------------------------
-- Seed: Kategorije
-- -----------------------------------------------
INSERT IGNORE INTO categories (id, name, description, sort_order) VALUES
('zdravlje-prostate', 'Zdravlje prostate', 'Prirodni dodaci za zdravlje urološkog sustava i prostate.', 1),
('kosti-zglobovi-misici', 'Kosti, zglobovi i mišići', 'Kurkuma i drugi prirodni ekstrakti za zdravlje zglobova i mišića.', 2),
('mrsavljenje', 'Mršavljenje', 'Prirodni sagorijevači masti i dodaci koji podržavaju metabolizam.', 3);

-- -----------------------------------------------
-- Seed: Proizvodi
-- -----------------------------------------------
INSERT IGNORE INTO products (id, category_id, name, packaging, short_description, price, image_url, sort_order) VALUES
('urasan-forte-30', 'zdravlje-prostate', 'Urasan Forte', '30 kapsula', 'Zdravlje urološkog sustava.', 19.99, 'https://images.unsplash.com/photo-1550572017-edb7999742af?auto=format&fit=crop&q=80&w=400&h=400', 1),
('urasan-forte-60', 'zdravlje-prostate', 'Urasan Forte', '60 kapsula', 'Zdravlje urološkog sustava.', 34.99, 'https://images.unsplash.com/photo-1550572017-edb7999742af?auto=format&fit=crop&q=80&w=400&h=400', 2),
('kurkuma-forte-30', 'kosti-zglobovi-misici', 'Kurkuma Forte', '30 kapsula', 'Snažan antioksidans za vaše zglobove.', 18.99, 'https://images.unsplash.com/photo-1611078482436-11f8b4dc62f7?auto=format&fit=crop&q=80&w=400&h=400', 1),
('kurkuma-forte-60', 'kosti-zglobovi-misici', 'Kurkuma Forte', '60 kapsula', 'Snažan antioksidans za vaše zglobove.', 32.99, 'https://images.unsplash.com/photo-1611078482436-11f8b4dc62f7?auto=format&fit=crop&q=80&w=400&h=400', 2),
('kurkuma-cream-cold-100', 'kosti-zglobovi-misici', 'Kurkuma Cream Cold', '100 ml', 'Hladni gel za ublažavanje mišićne boli.', 14.99, 'https://images.unsplash.com/photo-1556228578-8d89f187a412?auto=format&fit=crop&q=80&w=400&h=400', 3),
('kurkuma-cream-cold-225', 'kosti-zglobovi-misici', 'Kurkuma Cream Cold', '225 ml', 'Hladni gel za ublažavanje mišićne boli.', 24.99, 'https://images.unsplash.com/photo-1556228578-8d89f187a412?auto=format&fit=crop&q=80&w=400&h=400', 4),
('kurkuma-cream-hot-100', 'kosti-zglobovi-misici', 'Kurkuma Cream Hot', '100 ml', 'Topla krema za opuštanje zglobova i mišića.', 14.99, 'https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?auto=format&fit=crop&q=80&w=400&h=400', 5),
('kurkuma-cream-hot-225', 'kosti-zglobovi-misici', 'Kurkuma Cream Hot', '225 ml', 'Topla krema za opuštanje zglobova i mišića.', 24.99, 'https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?auto=format&fit=crop&q=80&w=400&h=400', 6),
('citrax-forte-30', 'mrsavljenje', 'Citrax Forte', '30 kapsula', 'Prirodna pomoć pri mršavljenju.', 15.99, 'https://images.unsplash.com/photo-1584305581561-bd3d10072b21?auto=format&fit=crop&q=80&w=400&h=400', 1),
('citrax-forte-60', 'mrsavljenje', 'Citrax Forte', '60 kapsula', 'Prirodna pomoć pri mršavljenju.', 27.99, 'https://images.unsplash.com/photo-1584305581561-bd3d10072b21?auto=format&fit=crop&q=80&w=400&h=400', 2);

INSERT IGNORE INTO product_benefits (product_id, benefit, sort_order) VALUES
('urasan-forte-30', 'Podržava prostatu', 1), ('urasan-forte-30', 'Smanjuje tegobe', 2), ('urasan-forte-30', 'Prirodni ekstrakti', 3),
('urasan-forte-60', 'Podržava prostatu', 1), ('urasan-forte-60', 'Smanjuje tegobe', 2), ('urasan-forte-60', 'Prirodni ekstrakti', 3),
('kurkuma-forte-30', 'Smanjuje upale', 1), ('kurkuma-forte-30', 'Poboljšava fleksibilnost', 2), ('kurkuma-forte-30', 'Jak antioksidans', 3),
('kurkuma-forte-60', 'Smanjuje upale', 1), ('kurkuma-forte-60', 'Poboljšava fleksibilnost', 2), ('kurkuma-forte-60', 'Jak antioksidans', 3),
('kurkuma-cream-cold-100', 'Efekt hlađenja', 1), ('kurkuma-cream-cold-100', 'Osvježava mišiće', 2), ('kurkuma-cream-cold-100', 'Lako se upija', 3),
('kurkuma-cream-cold-225', 'Efekt hlađenja', 1), ('kurkuma-cream-cold-225', 'Osvježava mišiće', 2), ('kurkuma-cream-cold-225', 'Lako se upija', 3),
('kurkuma-cream-hot-100', 'Efekt zagrijavanja', 1), ('kurkuma-cream-hot-100', 'Opušta zglobove', 2), ('kurkuma-cream-hot-100', 'Umiruje napetost', 3),
('kurkuma-cream-hot-225', 'Efekt zagrijavanja', 1), ('kurkuma-cream-hot-225', 'Opušta zglobove', 2), ('kurkuma-cream-hot-225', 'Umiruje napetost', 3),
('citrax-forte-30', 'Ubrzava metabolizam', 1), ('citrax-forte-30', 'Podiže energiju', 2), ('citrax-forte-30', 'Sagorijeva masti', 3),
('citrax-forte-60', 'Ubrzava metabolizam', 1), ('citrax-forte-60', 'Podiže energiju', 2), ('citrax-forte-60', 'Sagorijeva masti', 3);

-- -----------------------------------------------
-- Seed: Blog članci
-- -----------------------------------------------
INSERT IGNORE INTO blog_posts (id, title, excerpt, content, image_url, slug, is_published, published_at) VALUES
('post-1', 'Kako kurkuma pomaže vašim zglobovima?',
 'Saznajte sve o nevjerojatnim protuupalnim svojstvima kurkume i kako može poboljšati vašu pokretljivost.',
 'Kurkuma, začin duboko žute boje koji se tradicionalno koristi u indijskoj kuhinji i ayurvedskoj medicini, dobiva sve više pažnje u suvremenoj znanosti zbog svojih moćnih protuupalnih svojstava.\n\nJedan od glavnih izazova kod kurkumina je njegova niska bioraspoloživost. Zbog toga se u kvalitetnim dodacima prehrani kurkumin često kombinira s ekstraktom crnog papra (piperinom), koji dokazano povećava apsorpciju kurkumina za čak 2000%.\n\nOsim što djeluje protuupalno, kurkumin je i snažan antioksidans koji neutralizira slobodne radikale, smanjujući oksidativni stres u tijelu.',
 'https://images.unsplash.com/photo-1615486171430-84358a9e1e32?auto=format&fit=crop&q=80&w=600&h=400',
 'kako-kurkuma-pomaze-vasim-zglobovima', 1, '2023-10-10 10:00:00'),
('post-2', '5 savjeta za prirodno mršavljenje',
 'Otkrijte kako na zdrav i prirodan način doći do željene težine uz pomoć pravih dodataka prehrani.',
 'Mršavljenje ne mora značiti rigorozne dijete i iscrpljujuće treninge. Ključ trajnog gubitka težine leži u postepenim promjenama životnih navika i pametnom korištenju prirodnih dodataka prehrani.\n\n1. Hidratacija je ključ\n2. Birajte cjelovite namirnice\n3. Uključite proteine u svaki obrok\n4. San je važniji nego što mislite\n5. Pametno koristite dodatke prehrani',
 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600&h=400',
 '5-savjeta-za-prirodno-mrsavljenje', 1, '2023-09-02 10:00:00'),
('post-3', 'Zašto je zdravlje prostate važno',
 'Preventiva je ključ. Pročitajte naše savjete za održavanje zdravog urološkog sustava.',
 'Prostata je mala žlijezda koja igra bitnu ulogu u muškom reproduktivnom sustavu, no mnogi muškarci ne obraćaju pažnju na njeno zdravlje sve dok se ne pojave prvi simptomi.\n\nRedoviti pregledi od iznimne su važnosti za rano otkrivanje problema, no postoje i brojni prirodni načini za proaktivnu brigu o zdravlju prostate.',
 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=600&h=400',
 'zasto-je-zdravlje-prostate-vazno', 1, '2023-08-15 10:00:00');

-- -----------------------------------------------
-- Seed: SEO postavke
-- -----------------------------------------------
INSERT IGNORE INTO seo_settings (page_key, page_label, meta_title, meta_description) VALUES
('home', 'Početna stranica', 'Bioclinica - Prirodni dodaci prehrani', 'Otkrijte Bioclinica liniju prirodnih dodataka prehrani za zdravlje zglobova, prostate i mršavljenje.'),
('about', 'O nama', 'O nama - Bioclinica', 'Saznajte više o Bioclinica brandu i našoj misiji prirodnog zdravlja.'),
('contact', 'Kontakt', 'Kontakt - Bioclinica', 'Kontaktirajte nas za sva pitanja o našim proizvodima.'),
('faq', 'FAQ', 'Često postavljana pitanja - Bioclinica', 'Odgovori na najčešća pitanja o Bioclinica dodacima prehrani.'),
('news', 'Novosti', 'Novosti i savjeti - Bioclinica', 'Čitajte naše savjete i novosti o zdravlju i prirodnim dodacima prehrani.');
