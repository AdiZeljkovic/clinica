import { Pool, types } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

// NUMERIC (price) vraćaj kao broj, ne string
types.setTypeParser(1700, (v: string) => parseFloat(v));
// BIGINT (COUNT(*)) vraćaj kao broj
types.setTypeParser(20, (v: string) => parseInt(v, 10));

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bioclinica',
  max: 10,
});

/* MySQL-style `?` placeholderi -> PostgreSQL $1..$n, da postojeći upiti rade netaknuti.
   SELECT vraća redove; INSERT/UPDATE/DELETE vraća objekt s affectedRows + insertId
   (insertId radi kad upit ima RETURNING id). */
function toPgPlaceholders(sql: string): string {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

export async function query<T = unknown>(sql: string, params?: any[]): Promise<T> {
  // tinyint(1) kolone su INTEGER — boolean iz admin panela pretvori u 1/0
  const coerced = params?.map(p => typeof p === 'boolean' ? (p ? 1 : 0) : p);
  const result = await pool.query(toPgPlaceholders(sql), coerced);
  if (result.command === 'SELECT') {
    return result.rows as T;
  }
  return {
    affectedRows: result.rowCount ?? 0,
    insertId: result.rows?.[0]?.id,
    rows: result.rows,
  } as T;
}
