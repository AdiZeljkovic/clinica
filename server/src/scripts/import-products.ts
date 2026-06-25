import XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const ROOT = path.resolve(process.cwd(), '..');
const EXCEL_PATH = path.join(ROOT, 'slike', 'Bioclinica_BIH_portfolio_finalna_verzija_-_2026_ijekavica.xlsx');
const IMG_SRC  = path.join(ROOT, 'slike', 'proizvodi');
const IMG_DST  = path.join(ROOT, 'public', 'slike');

// --- Image mapping: source file → destination URL-safe name ---
const IMAGE_MAP: [string, string][] = [
  ['CITRAX FORTE 30 kapsula.png',   'citrax-forte-30-kapsula.png'],
  ['CITRAX FORTE 60 kapsula.png',   'citrax-forte-60-kapsula.png'],
  ['KURKUMA FORTE 30 kapsula.png',  'kurkuma-forte-30-kapsula.png'],
  ['KURKUMA FORTE 60 kapsula.png',  'kurkuma-forte-60-kapsula.png'],
  ['URASAN FORTE 30 kapsula.png',   'urasan-forte-30-kapsula.png'],
  ['URASAN FORTE 60 kapsula.png',   'urasan-forte-60-kapsula.png'],
  ['KURKUMA CREAM HOT 225ml.png',   'kurkuma-cream-hot-225ml.png'],
  ['KURKUMA CREAM HOT 100ml.png',   'kurkuma-cream-hot-100ml.png'],
  ['KURKUMA CREAM COLD 225ml.png',  'kurkuma-cream-cold-225ml.png'],
  ['KURKUMA CREAM COLD 100ml.png',  'kurkuma-cream-cold-100ml.png'],
];

interface ProductMeta {
  id: string;
  categoryId: string;
  imageUrl: string;
  sortOrder: number;
}

function resolveProductMeta(name: string, packaging: string): ProductMeta | null {
  const n = name.toUpperCase().trim();
  const p = packaging.toUpperCase().trim();
  if (n.includes('CITRAX FORTE') && p.startsWith('30'))      return { id: 'citrax-forte-30',      categoryId: 'mrsavljenje',           imageUrl: '/slike/citrax-forte-30-kapsula.png',    sortOrder: 1 };
  if (n.includes('CITRAX FORTE') && p.startsWith('60'))      return { id: 'citrax-forte-60',      categoryId: 'mrsavljenje',           imageUrl: '/slike/citrax-forte-60-kapsula.png',    sortOrder: 2 };
  if (n.includes('KURKUMA FORTE') && p.startsWith('30'))     return { id: 'kurkuma-forte-30',     categoryId: 'kosti-zglobovi-misici', imageUrl: '/slike/kurkuma-forte-30-kapsula.png',   sortOrder: 3 };
  if (n.includes('KURKUMA FORTE') && p.startsWith('60'))     return { id: 'kurkuma-forte-60',     categoryId: 'kosti-zglobovi-misici', imageUrl: '/slike/kurkuma-forte-60-kapsula.png',   sortOrder: 4 };
  if (n.includes('URASAN FORTE') && p.startsWith('30'))      return { id: 'urasan-forte-30',      categoryId: 'zdravlje-prostate',     imageUrl: '/slike/urasan-forte-30-kapsula.png',    sortOrder: 5 };
  if (n.includes('URASAN FORTE') && p.startsWith('60'))      return { id: 'urasan-forte-60',      categoryId: 'zdravlje-prostate',     imageUrl: '/slike/urasan-forte-60-kapsula.png',    sortOrder: 6 };
  if (n.includes('KURKUMA CREAM HOT') && p.startsWith('225')) return { id: 'kurkuma-cream-hot-225', categoryId: 'kosti-zglobovi-misici', imageUrl: '/slike/kurkuma-cream-hot-225ml.png',    sortOrder: 7 };
  if (n.includes('KURKUMA CREAM HOT') && p.startsWith('100')) return { id: 'kurkuma-cream-hot-100', categoryId: 'kosti-zglobovi-misici', imageUrl: '/slike/kurkuma-cream-hot-100ml.png',    sortOrder: 8 };
  if (n.includes('KURKUMA CREAM COLD') && p.startsWith('225')) return { id: 'kurkuma-cream-cold-225', categoryId: 'kosti-zglobovi-misici', imageUrl: '/slike/kurkuma-cream-cold-225ml.png',  sortOrder: 9 };
  if (n.includes('KURKUMA CREAM COLD') && p.startsWith('100')) return { id: 'kurkuma-cream-cold-100', categoryId: 'kosti-zglobovi-misici', imageUrl: '/slike/kurkuma-cream-cold-100ml.png',  sortOrder: 10 };
  return null;
}

function parseBenefits(raw: string): string[] {
  return raw
    .split(/[\n\r•;]+/)
    .map(b => b.trim().replace(/^[-–—*\s]+/, '').trim())
    .filter(b => b.length > 3);
}

async function main() {
  // ──────────────────────────────────────────────
  // KORAK 1: Kopiranje slika
  // ──────────────────────────────────────────────
  console.log('\n📁 Korak 1: Kopiranje slika...');
  if (!fs.existsSync(IMG_DST)) fs.mkdirSync(IMG_DST, { recursive: true });

  for (const [src, dst] of IMAGE_MAP) {
    const srcPath = path.join(IMG_SRC, src);
    const dstPath = path.join(IMG_DST, dst);
    if (!fs.existsSync(srcPath)) {
      console.error(`  ❌ Slika ne postoji: ${srcPath}`);
      process.exit(1);
    }
    fs.copyFileSync(srcPath, dstPath);
    console.log(`  ✅ ${src} → ${dst}`);
  }

  // ──────────────────────────────────────────────
  // KORAK 2: Čitanje Excel fajla
  // ──────────────────────────────────────────────
  console.log('\n📊 Korak 2: Čitanje Excel fajla...');
  if (!fs.existsSync(EXCEL_PATH)) {
    console.error(`  ❌ Excel fajl ne postoji: ${EXCEL_PATH}`);
    process.exit(1);
  }

  const wb = XLSX.readFile(EXCEL_PATH);
  // Traži sheet koji sadrži NAZIV PROIZVODA
  let sheetData: any[][] | null = null;
  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
    const hasNaziv = rows.some(row => row.some((c: any) => String(c).toUpperCase().includes('NAZIV PROIZVODA')));
    if (hasNaziv) {
      console.log(`  Sheet: "${sheetName}"`);
      sheetData = rows;
      break;
    }
  }
  if (!sheetData) {
    console.error('  ❌ Nije pronađen sheet s "NAZIV PROIZVODA"!');
    process.exit(1);
  }

  // Pronalazi header red i indekse kolona
  let headerIdx = -1;
  let colNaziv = -1, colOpis = -1, colBenefit = -1;
  let colUsage = -1, colComposition = -1, colWarnings = -1;
  let colStorageTemp = -1, colCountry = -1;

  for (let i = 0; i < sheetData.length; i++) {
    const row = sheetData[i];
    const strRow = row.map((c: any) => String(c).toUpperCase().trim());
    const nazPos = strRow.findIndex((c: string) => c.includes('NAZIV PROIZVODA'));
    if (nazPos === -1) continue;
    headerIdx = i;
    colNaziv       = nazPos;
    colOpis        = strRow.findIndex((c: string) => c.includes('KRATAK OPIS') || (c.includes('OPIS') && !c.includes('DETALJNIJE')));
    colBenefit     = -1; // Nema posebne kolone za benefite u ovom Excel fajlu
    colUsage       = strRow.findIndex((c: string) => c.includes('NACIN UPOTREBE') || c.includes('NAČIN UPOTREBE') || (c.includes('NACIN') && c.includes('UPOTREBE')));
    colComposition = strRow.findIndex((c: string) => c === 'SASTAV' || c.includes('SASTAV'));
    colWarnings    = strRow.findIndex((c: string) => c.includes('UPOZORENJE') || c.includes('UPOZORENJA') || c.includes('NAPOMENA'));
    colStorageTemp = strRow.findIndex((c: string) => c.includes('TEMPERATURA'));
    colCountry     = strRow.findIndex((c: string) => c.includes('ZEMLJA POREKLA') || c.includes('ZEMLJA PORIJEKLA') || c.includes('ZEMLJA P'));
    console.log(`  Header red: ${i + 1}`);
    console.log(`  Kolone — naziv:${colNaziv}, opis:${colOpis}, benefit:${colBenefit}, upotreba:${colUsage}, sastav:${colComposition}, upozorenja:${colWarnings}, temp:${colStorageTemp}, zemlja:${colCountry}`);
    break;
  }

  if (headerIdx === -1 || colNaziv === -1) {
    console.error('  ❌ Header red nije pronađen!');
    process.exit(1);
  }

  const getCell = (row: any[], colIdx: number) => colIdx >= 0 ? String(row[colIdx] ?? '').trim() : '';

  // Čita redove i pronalazi naše 10 proizvoda
  const products: any[] = [];
  for (let i = headerIdx + 1; i < sheetData.length; i++) {
    const row = sheetData[i];
    const rawNaziv = getCell(row, colNaziv);
    if (!rawNaziv) continue;

    // Format: "CITRAX FORTE, 30 kapsula" — split by first ", "
    const commaIdx = rawNaziv.indexOf(', ');
    if (commaIdx === -1) continue;

    const productName = rawNaziv.substring(0, commaIdx).trim();
    const packaging   = rawNaziv.substring(commaIdx + 2).trim();
    const meta        = resolveProductMeta(productName, packaging);

    if (!meta) {
      console.log(`  ⚠️  Preskačem (bez slike): ${rawNaziv}`);
      continue;
    }

    products.push({
      ...meta,
      name:                productName,
      packaging,
      short_description:   getCell(row, colOpis),
      usage_instructions:  getCell(row, colUsage),
      composition:         getCell(row, colComposition),
      warnings:            getCell(row, colWarnings),
      storage_temp:        getCell(row, colStorageTemp),
      country_of_origin:   getCell(row, colCountry),
      benefits_raw:        getCell(row, colBenefit),
    });
  }

  console.log(`  Pronađeno ${products.length}/10 Bioclinica proizvoda`);
  if (products.length === 0) {
    console.error('  ❌ Nema pronađenih proizvoda. Provjeri format Excel fajla.');
    process.exit(1);
  }

  // ──────────────────────────────────────────────
  // KORAK 3: DB operacije
  // ──────────────────────────────────────────────
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '3306'),
    user:     process.env.DB_USER     || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME     || 'bioclinica',
    charset: 'utf8mb4',
  });

  console.log('\n🗄️  Korak 3: Proširenje sheme baze...');
  const newColumns = [
    { name: 'usage_instructions', def: 'TEXT NULL',         after: 'short_description' },
    { name: 'composition',        def: 'TEXT NULL',         after: 'usage_instructions' },
    { name: 'warnings',           def: 'TEXT NULL',         after: 'composition' },
    { name: 'storage_temp',       def: 'VARCHAR(255) NULL', after: 'warnings' },
    { name: 'country_of_origin',  def: 'VARCHAR(100) NULL', after: 'storage_temp' },
  ];
  const [existingCols] = await conn.execute(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products'`
  ) as any;
  const existingNames = new Set(existingCols.map((r: any) => r.COLUMN_NAME));
  for (const col of newColumns) {
    if (existingNames.has(col.name)) {
      console.log(`  ℹ️  Kolona već postoji: ${col.name}`);
      continue;
    }
    await conn.execute(`ALTER TABLE products ADD COLUMN ${col.name} ${col.def} AFTER ${col.after}`);
    console.log(`  ✅ Dodana kolona: ${col.name}`);
  }

  console.log('\n🗑️  Korak 4: Brisanje starih podataka...');
  await conn.execute('DELETE FROM product_benefits');
  await conn.execute('DELETE FROM products');
  console.log('  ✅ Stari proizvodi i benefiti obrisani');

  console.log('\n📦 Korak 5: Uvoz 10 novih proizvoda...');
  let benefitCount = 0;

  for (const p of products) {
    await conn.execute(
      `INSERT INTO products
         (id, category_id, name, packaging, short_description, usage_instructions,
          composition, warnings, storage_temp, country_of_origin, price, image_url, is_active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        p.id, p.categoryId, p.name, p.packaging,
        p.short_description   || null,
        p.usage_instructions  || null,
        p.composition         || null,
        p.warnings            || null,
        p.storage_temp        || null,
        p.country_of_origin   || null,
        '0.00',
        p.imageUrl,
        1,
        p.sortOrder,
      ]
    );

    const benefits = parseBenefits(p.benefits_raw);
    for (let bi = 0; bi < benefits.length; bi++) {
      await conn.execute(
        'INSERT INTO product_benefits (product_id, benefit, sort_order) VALUES (?, ?, ?)',
        [p.id, benefits[bi], bi]
      );
      benefitCount++;
    }

    console.log(`  ✅ ${p.name} ${p.packaging} → ${benefits.length} benefita`);
  }

  await conn.end();

  console.log(`\n🎉 Uvoz završen!`);
  console.log(`   Uvezeno: ${products.length} proizvoda, ${benefitCount} benefita`);
  console.log(`   Frontend: http://localhost:3002`);
}

main().catch(err => {
  console.error('\n❌ Greška:', err.message || err);
  process.exit(1);
});
