import { Router, Request, Response } from 'express';
import { query } from '../db/connection.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

const DETAIL_COLS = 'id, category_id, name, tagline, packaging, short_description, usage_instructions, composition, warnings, storage_temp, country_of_origin, price, image_url, is_active, sort_order';

async function attachBenefits(products: any[]): Promise<any[]> {
  if (!products.length) return products;
  const ids = products.map(p => p.id);
  const placeholders = ids.map(() => '?').join(',');
  const benefits = await query<any[]>(
    `SELECT product_id, benefit FROM product_benefits WHERE product_id IN (${placeholders}) ORDER BY sort_order`,
    ids
  );
  const benefitMap: Record<string, string[]> = {};
  for (const b of benefits) {
    if (!benefitMap[b.product_id]) benefitMap[b.product_id] = [];
    benefitMap[b.product_id].push(b.benefit);
  }
  return products.map(p => ({ ...p, benefits: benefitMap[p.id] || [] }));
}

// GET /api/products
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    let sql = 'SELECT id, category_id, name, packaging, short_description, price, image_url, is_active, sort_order FROM products WHERE is_active = 1';
    const params: any[] = [];
    if (category) { sql += ' AND category_id = ?'; params.push(category); }
    sql += ' ORDER BY sort_order ASC';
    const products = await query<any[]>(sql, params);
    res.json(await attachBenefits(products));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// GET /api/products/all - admin (uključuje neaktivne)
router.get('/all', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const products = await query<any[]>(`SELECT ${DETAIL_COLS} FROM products ORDER BY category_id, sort_order ASC`);
    res.json(await attachBenefits(products));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const products = await query<any[]>(`SELECT ${DETAIL_COLS} FROM products WHERE id = ?`, [req.params.id]);
    if (!products.length) { res.status(404).json({ error: 'Proizvod nije pronađen.' }); return; }
    const [product] = await attachBenefits(products);
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// POST /api/products - admin
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const { id, category_id, name, tagline, short_description, packaging, price, image_url, is_active, sort_order, benefits,
          usage_instructions, composition, warnings, storage_temp, country_of_origin } = req.body;
  if (!id || !category_id || !name || price === undefined) {
    res.status(400).json({ error: 'ID, kategorija, naziv i cijena su obavezni.' });
    return;
  }

  try {
    await query(
      `INSERT INTO products
         (id, category_id, name, tagline, short_description, packaging, price, image_url, is_active, sort_order,
          usage_instructions, composition, warnings, storage_temp, country_of_origin)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, category_id, name, tagline || null, short_description || null, packaging || null, price, image_url || null, is_active ?? 1, sort_order || 0,
       usage_instructions || null, composition || null, warnings || null, storage_temp || null, country_of_origin || null]
    );

    if (Array.isArray(benefits) && benefits.length) {
      for (let i = 0; i < benefits.length; i++) {
        await query('INSERT INTO product_benefits (product_id, benefit, sort_order) VALUES (?, ?, ?)', [id, benefits[i], i]);
      }
    }

    res.status(201).json({ message: 'Proizvod je kreiran.', id });
  } catch (err: any) {
    if (err.code === '23505' || err.code === 'ER_DUP_ENTRY') { res.status(409).json({ error: 'Proizvod s tim ID-om već postoji.' }); return; }
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// PUT /api/products/:id - admin
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  const { category_id, name, tagline, short_description, packaging, price, image_url, is_active, sort_order, benefits,
          usage_instructions, composition, warnings, storage_temp, country_of_origin } = req.body;
  if (!category_id || !name || price === undefined) {
    res.status(400).json({ error: 'Kategorija, naziv i cijena su obavezni.' });
    return;
  }

  try {
    const result = await query<any>(
      `UPDATE products SET
         category_id=?, name=?, tagline=?, short_description=?, packaging=?, price=?, image_url=?, is_active=?, sort_order=?,
         usage_instructions=?, composition=?, warnings=?, storage_temp=?, country_of_origin=?
       WHERE id=?`,
      [category_id, name, tagline || null, short_description || null, packaging || null, price, image_url || null, is_active ?? 1, sort_order || 0,
       usage_instructions || null, composition || null, warnings || null, storage_temp || null, country_of_origin || null,
       req.params.id]
    );
    if (result.affectedRows === 0) { res.status(404).json({ error: 'Proizvod nije pronađen.' }); return; }

    if (Array.isArray(benefits)) {
      await query('DELETE FROM product_benefits WHERE product_id = ?', [req.params.id]);
      for (let i = 0; i < benefits.length; i++) {
        await query('INSERT INTO product_benefits (product_id, benefit, sort_order) VALUES (?, ?, ?)', [req.params.id, benefits[i], i]);
      }
    }

    res.json({ message: 'Proizvod je ažuriran.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// DELETE /api/products/:id - admin
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await query<any>('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) { res.status(404).json({ error: 'Proizvod nije pronađen.' }); return; }
    res.json({ message: 'Proizvod je obrisan.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

export default router;
