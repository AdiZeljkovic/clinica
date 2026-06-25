/**
 * Pokretanje: cd server && npx tsx src/scripts/createAdmin.ts
 * Kreira prvog admin korisnika u bazi.
 */
import bcrypt from 'bcryptjs';
import { query, pool } from '../db/connection.js';
import * as readline from 'readline';

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q: string): Promise<string> => new Promise(resolve => rl.question(q, resolve));

async function main() {
  console.log('\n=== Bioclinica - Kreiranje admin korisnika ===\n');

  const username = await ask('Korisničko ime: ');
  const email = await ask('Email adresa: ');
  const password = await ask('Lozinka (min 6 znakova): ');

  if (!username || !email || password.length < 6) {
    console.error('Greška: svi podaci su obavezni, lozinka mora imati min 6 znakova.');
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);

  try {
    await query(
      'INSERT INTO admin_users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, hash]
    );
    console.log(`\n✅ Admin korisnik "${username}" je uspješno kreiran!\n`);
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.error('\n❌ Korisnik s tim korisničkim imenom ili emailom već postoji.\n');
    } else {
      console.error('\n❌ Greška:', err.message);
    }
    process.exit(1);
  } finally {
    rl.close();
    await pool.end();
  }
}

main();
