import { Router, Request, Response } from 'express';
import { query } from '../db/connection.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// pictograms može doći iz baze kao string (JSON) ili već parsiran (mysql2) — normaliziraj
function normalize(slide: any) {
  let pics = slide.pictograms;
  if (typeof pics === 'string') {
    try { pics = JSON.parse(pics); } catch { pics = []; }
  }
  return { ...slide, pictograms: Array.isArray(pics) ? pics : [] };
}

function serializePictograms(pictograms: any): string {
  if (Array.isArray(pictograms)) return JSON.stringify(pictograms);
  if (typeof pictograms === 'string') return pictograms; // već JSON string
  return '[]';
}

// GET /api/hero-slides — javni (samo aktivni, po redoslijedu)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const slides = await query<any[]>(
      'SELECT * FROM hero_slides WHERE is_active = 1 ORDER BY sort_order ASC'
    );
    res.json(slides.map(normalize));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// GET /api/hero-slides/all — admin (svi)
router.get('/all', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const slides = await query<any[]>('SELECT * FROM hero_slides ORDER BY sort_order ASC');
    res.json(slides.map(normalize));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// POST /api/hero-slides — admin
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const { tagline, name1, name2, name2b, sub, image_url, accent_color, pictograms, product_id, is_active, sort_order } = req.body;
  if (!name1) {
    res.status(400).json({ error: 'Naziv (prvi red) je obavezan.' });
    return;
  }
  try {
    const result = await query<any>(
      `INSERT INTO hero_slides
        (tagline, name1, name2, name2b, sub, image_url, accent_color, pictograms, product_id, is_active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tagline || null, name1, name2 || null, name2b || null, sub || null,
        image_url || null, accent_color || '#d4600a', serializePictograms(pictograms),
        product_id || null, is_active ?? 1, sort_order ?? 0,
      ]
    );
    res.status(201).json({ message: 'Slajd je kreiran.', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// PUT /api/hero-slides/:id — admin
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  const { tagline, name1, name2, name2b, sub, image_url, accent_color, pictograms, product_id, is_active, sort_order } = req.body;
  if (!name1) {
    res.status(400).json({ error: 'Naziv (prvi red) je obavezan.' });
    return;
  }
  try {
    const result = await query<any>(
      `UPDATE hero_slides SET
        tagline=?, name1=?, name2=?, name2b=?, sub=?, image_url=?, accent_color=?, pictograms=?, product_id=?, is_active=?, sort_order=?
       WHERE id=?`,
      [
        tagline || null, name1, name2 || null, name2b || null, sub || null,
        image_url || null, accent_color || '#d4600a', serializePictograms(pictograms),
        product_id || null, is_active ?? 1, sort_order ?? 0, req.params.id,
      ]
    );
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Slajd nije pronađen.' });
      return;
    }
    res.json({ message: 'Slajd je ažuriran.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// DELETE /api/hero-slides/:id — admin
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await query<any>('DELETE FROM hero_slides WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Slajd nije pronađen.' });
      return;
    }
    res.json({ message: 'Slajd je obrisan.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

export default router;
