import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

// ── Sadržaj po proizvodu ──────────────────────────────────────────────────────

const CONTENT: Record<string, { tagline: string; description: string; benefits: string[] }> = {
  citrax: {
    tagline: 'Kada želite smršati',
    description: 'Citrax Forte je dijetetski suplement na bazi gorke narandže, sa vitaminom C i cinkom, koji pomaže u gubitku kilograma.',
    benefits: [
      'Pomaže u gubitku kilograma',
      'Podržava kontrolu apetita',
      'Podstiče metabolizam',
      'Doprinosi razgradnji masti',
    ],
  },
  kurkuma_forte: {
    tagline: 'Za zdrave kosti i pokretljive zglobove',
    description: 'Kurkuma forte je dijetetski suplement na bazi kurkume, sa vitaminom C, vitaminom E i cinkom, koji pomaže u očuvanju zdravlja kostiju i zglobova.',
    benefits: [
      'Doprinosi održavanju zdravlja zglobova, kostiju i mišića',
      'Doprinosi smanjenju bola, upala, otoka i ukočenosti zglobova',
      'Podržava elastičnost tetiva i ligamenata',
      'Pomaže kod reumatskih oboljenja – artritisa i osteoartritisa',
      'Pomaže kod poremećaja vezivnog tkiva',
    ],
  },
  urasan: {
    tagline: 'Za zdravlje prostate kod odraslih muškaraca',
    description: 'Urasan Forte je dijetetski suplement namijenjen muškarcima koji imaju probleme sa mokrenjem usljed uvećane prostate (benigna hiperplazija prostate – BHP) ili nadražene mokraćne bešike.',
    benefits: [
      'Podržava zdravlje prostate kod odraslih muškaraca',
      'Pomaže kod problema sa mokrenjem usljed uvećane prostate (BHP) ili nadražene mokraćne bešike',
      'Sadrži ekstrakt sjemena bundeve, čija je efikasnost potvrđena u brojnim studijama',
      'Sadrži cink, koji doprinosi normalnoj plodnosti, reprodukciji, nivou testosterona i funkciji imuniteta',
      'Sadrži vitamin E, koji doprinosi zaštiti ćelija od oksidativnog stresa',
    ],
  },
  cream_hot: {
    tagline: 'Krema koja grije — za napete mišiće i ukočene zglobove',
    description: 'Kurkuma Cream Hot je krema za masažu vrata, ramena, leđa, ruku i nogu, sa snažnim efektom zagrijavanja, na bazi kurkume i 11 biljnih ekstrakata. Pomaže kod ukočenosti i napetosti mišića i zglobova, kao i kod reumatskih tegoba i sportskih povreda.',
    benefits: [
      'Snažan efekat zagrijavanja i prijatne topline koja dugo traje na mjestu nanošenja',
      'Pomaže kod reumatskih tegoba – artritisa i artroze',
      'Doprinosi smanjenju bola, upala, otoka i ukočenosti (zglobovi, mišići, leđa, vrat)',
      'Pomaže u regeneraciji zglobova i mišića, kao i kod sportskih povreda',
      'Opušta umorne noge i stopala i daje osjećaj udobnosti',
      'Pospješuje perifernu cirkulaciju i prokrvljenost kože',
    ],
  },
  cream_cold: {
    tagline: 'Krema koja hladi — za otok, napetost i umorne noge',
    description: 'Kurkuma Cream Cold je krema za masažu ruku, vrata, ramena, leđa i nogu, sa snažnim efektom hlađenja, na bazi etarskog ulja kurkume i 15 biljnih ekstrakata. Pomaže kod akutnih upalnih stanja, otoka i bolova u mišićima, kao i kod opuštanja mišića poslije sportskih aktivnosti.',
    benefits: [
      'Snažan efekat hlađenja na mjestu nanošenja',
      'Opušta umorne, otečene noge i umanjuje osjećaj težine usljed dugotrajnog stajanja i hodanja',
      'Doprinosi smanjenju bola u mišićima',
      'Pomaže kod akutnih (trenutnih) upalnih stanja',
      'Opušta mišiće poslije sportskih aktivnosti',
      'Pospješuje prokrvljenost, njeguje i štiti kožu',
    ],
  },
};

// Mapiranje product ID → ključ sadržaja
const PRODUCT_CONTENT: Record<string, keyof typeof CONTENT> = {
  'citrax-forte-30':      'citrax',
  'citrax-forte-60':      'citrax',
  'kurkuma-forte-30':     'kurkuma_forte',
  'kurkuma-forte-60':     'kurkuma_forte',
  'urasan-forte-30':      'urasan',
  'urasan-forte-60':      'urasan',
  'kurkuma-cream-hot-225': 'cream_hot',
  'kurkuma-cream-hot-100': 'cream_hot',
  'kurkuma-cream-cold-225': 'cream_cold',
  'kurkuma-cream-cold-100': 'cream_cold',
};

async function main() {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '3306'),
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'bioclinica',
    charset: 'utf8mb4',
  });

  // ── Korak 1: Dodaj tagline kolonu ako ne postoji ────────────────────────────
  console.log('\n🗄️  Korak 1: Dodavanje tagline kolone...');
  const [cols] = await conn.execute(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products'`
  ) as any;
  const colNames = new Set(cols.map((r: any) => r.COLUMN_NAME));
  if (!colNames.has('tagline')) {
    await conn.execute(`ALTER TABLE products ADD COLUMN tagline VARCHAR(255) NULL AFTER name`);
    console.log('  ✅ Kolona tagline dodana');
  } else {
    console.log('  ℹ️  Kolona tagline već postoji');
  }

  // ── Korak 2: Brisanje starih benefita ──────────────────────────────────────
  console.log('\n🗑️  Korak 2: Brisanje starih benefita...');
  await conn.execute('DELETE FROM product_benefits');
  console.log('  ✅ Stari benefiti obrisani');

  // ── Korak 3: Update svakog proizvoda ───────────────────────────────────────
  console.log('\n📦 Korak 3: Ažuriranje sadržaja proizvoda...');
  for (const [productId, contentKey] of Object.entries(PRODUCT_CONTENT)) {
    const c = CONTENT[contentKey];

    await conn.execute(
      `UPDATE products SET tagline = ?, short_description = ? WHERE id = ?`,
      [c.tagline, c.description, productId]
    );

    for (let i = 0; i < c.benefits.length; i++) {
      await conn.execute(
        'INSERT INTO product_benefits (product_id, benefit, sort_order) VALUES (?, ?, ?)',
        [productId, c.benefits[i], i]
      );
    }

    console.log(`  ✅ ${productId} → tagline + opis + ${c.benefits.length} benefita`);
  }

  await conn.end();
  console.log('\n🎉 Gotovo! Svi proizvodi ažurirani.');
}

main().catch(err => {
  console.error('\n❌ Greška:', err.message || err);
  process.exit(1);
});
