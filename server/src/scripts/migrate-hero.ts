/**
 * Migracija hero_slides tabele na novi format (tagline, name1/2/2b, accent_color, pictograms JSON).
 * Pokreni:  npx tsx src/scripts/migrate-hero.ts   (iz server/ foldera)
 *
 * NAPOMENA: briše postojeću hero_slides tabelu (stari format) i kreira novu sa seed podacima.
 */
import { pool, query } from '../db/connection.js';

const SLIDES = [
  {
    tagline: 'TOPLINA KOJA PRUŽA OLAKŠANJE',
    name1: 'KURKUMA', name2: 'CREAM', name2b: 'HOT',
    sub: 'Pruža osjećaj ugodnosti i prijatne topline uz 11 pažljivo odabranih biljnih ekstrakata.',
    image_url: '/slike/Kurkuma hot cream.png',
    accent_color: '#d4600a',
    product_id: 'kurkuma-cream-hot-225',
    pictograms: [
      { src: '/slike/Pictograms_Warming effect .png', label: '11 pažljivo odabranih biljnih ekstrakata' },
      { src: '/slike/Pictograms_Application zone .png', label: 'Dermatološki testirano' },
      { src: '/slike/Pictograms_Joint zone (rheumatic) .png', label: 'Quality guarantee' },
    ],
  },
  {
    tagline: 'PODRŠKA ZDRAVLJU PROSTATE',
    name1: 'URASAN', name2: '', name2b: 'FORTE',
    sub: 'Prirodni ekstrakti koji podržavaju zdravlje urološkog sustava i kvalitetu svakodnevnog života.',
    image_url: '/slike/Urasan Forte.png',
    accent_color: '#7c3aed',
    product_id: 'urasan-forte-30',
    pictograms: [
      { src: "/slike/Pictograms_Men's health .png", label: 'Muško zdravlje' },
      { src: '/slike/Pictograms_Urinary function .png', label: 'Urinarni sustav' },
      { src: '/slike/Pictograms_Zinc.png', label: 'Cink' },
    ],
  },
  {
    tagline: 'PRIRODAN PUT DO VITKE LINIJE',
    name1: 'CITRAX', name2: '', name2b: 'FORTE',
    sub: 'Podržava metabolizam i kontrolu tjelesne težine uz prirodne, klinički provjerene sastojke.',
    image_url: '/slike/Citrax Forte.png',
    accent_color: '#16a34a',
    product_id: 'citrax-forte-30',
    pictograms: [
      { src: '/slike/Pictograms_Weight loss .png', label: 'Gubitak težine' },
      { src: '/slike/Pictograms_Appetite control .png', label: 'Kontrola apetita' },
      { src: '/slike/Pictograms_Fat breakdown .png', label: 'Razgradnja masti' },
    ],
  },
  {
    tagline: 'SNAGA PRIRODE ZA VAŠE ZGLOBOVE',
    name1: 'KURKUMA', name2: '', name2b: 'FORTE',
    sub: 'Kurkumin i prirodni antioksidansi za zdrave zglobove, smanjenje upala i slobodu pokreta.',
    image_url: '/slike/Kurkuma Forte.png',
    accent_color: '#ca8a04',
    product_id: 'kurkuma-forte-30',
    pictograms: [
      { src: '/slike/Pictograms_Joints_ bones _ muscles .png', label: 'Zglobovi, kosti i mišići' },
      { src: '/slike/Pictograms_Connective tissue .png', label: 'Vezivno tkivo' },
      { src: '/slike/Pictograms_After-sport relaxation .png', label: 'Oporavak nakon sporta' },
    ],
  },
];

async function run() {
  console.log('→ Brišem staru hero_slides tabelu (ako postoji)...');
  await query('DROP TABLE IF EXISTS hero_slides');

  console.log('→ Kreiram novu hero_slides tabelu...');
  await query(`
    CREATE TABLE hero_slides (
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
    )
  `);

  console.log('→ Ubacujem seed slajdove...');
  for (let i = 0; i < SLIDES.length; i++) {
    const s = SLIDES[i];
    await query(
      `INSERT INTO hero_slides
        (tagline, name1, name2, name2b, sub, image_url, accent_color, pictograms, product_id, is_active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      [s.tagline, s.name1, s.name2, s.name2b, s.sub, s.image_url, s.accent_color, JSON.stringify(s.pictograms), s.product_id, i]
    );
    console.log(`   ✓ ${s.name1} ${s.name2b}`);
  }

  console.log('✅ Migracija završena.');
  await pool.end();
}

run().catch(err => { console.error('❌ Greška:', err); process.exit(1); });
