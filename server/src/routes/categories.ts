import { Router, Request, Response } from 'express';
import { query } from '../db/connection.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET /api/categories - javni endpoint
router.get('/', async (_req: Request, res: Response) => {
  try {
    const categories = await query('SELECT * FROM categories ORDER BY sort_order ASC');
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// GET /api/categories/:id - javni endpoint
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const cats = await query<any[]>('SELECT * FROM categories WHERE id = ?', [req.params.id]);
    if (!cats.length) { res.status(404).json({ error: 'Kategorija nije pronađena.' }); return; }
    res.json(cats[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// POST /api/categories - admin
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const { id, name, description, sort_order } = req.body;
  if (!id || !name) { res.status(400).json({ error: 'ID i naziv su obavezni.' }); return; }

  try {
    await query(
      'INSERT INTO categories (id, name, description, sort_order) VALUES (?, ?, ?, ?)',
      [id, name, description || null, sort_order || 0]
    );
    res.status(201).json({ message: 'Kategorija je kreirana.', id });
  } catch (err: any) {
    if (err.code === '23505' || err.code === 'ER_DUP_ENTRY') { res.status(409).json({ error: 'Kategorija s tim ID-om već postoji.' }); return; }
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// PUT /api/categories/:id - admin
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  const { name, description, sort_order } = req.body;
  if (!name) { res.status(400).json({ error: 'Naziv je obavezan.' }); return; }

  try {
    const result = await query<any>(
      'UPDATE categories SET name = ?, description = ?, sort_order = ? WHERE id = ?',
      [name, description || null, sort_order || 0, req.params.id]
    );
    if (result.affectedRows === 0) { res.status(404).json({ error: 'Kategorija nije pronađena.' }); return; }
    res.json({ message: 'Kategorija je ažurirana.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// DELETE /api/categories/:id - admin
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await query<any>('DELETE FROM categories WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) { res.status(404).json({ error: 'Kategorija nije pronađena.' }); return; }
    res.json({ message: 'Kategorija je obrisana.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

export default router;
