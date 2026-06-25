import { Router, Request, Response } from 'express';
import { query } from '../db/connection.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET /api/seo - javni (za frontend)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const settings = await query('SELECT * FROM seo_settings ORDER BY page_key ASC');
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// GET /api/seo/:pageKey - javni
router.get('/:pageKey', async (req: Request, res: Response) => {
  try {
    const settings = await query<any[]>('SELECT * FROM seo_settings WHERE page_key = ?', [req.params.pageKey]);
    if (!settings.length) { res.status(404).json({ error: 'SEO postavke nisu pronađene.' }); return; }
    res.json(settings[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// PUT /api/seo/:pageKey - admin
router.put('/:pageKey', authMiddleware, async (req: Request, res: Response) => {
  const { page_label, meta_title, meta_description, og_title, og_description, og_image, canonical_url } = req.body;

  try {
    const existing = await query<any[]>('SELECT id FROM seo_settings WHERE page_key = ?', [req.params.pageKey]);

    if (existing.length) {
      await query(
        'UPDATE seo_settings SET page_label=?, meta_title=?, meta_description=?, og_title=?, og_description=?, og_image=?, canonical_url=? WHERE page_key=?',
        [page_label || null, meta_title || null, meta_description || null, og_title || null, og_description || null, og_image || null, canonical_url || null, req.params.pageKey]
      );
    } else {
      await query(
        'INSERT INTO seo_settings (page_key, page_label, meta_title, meta_description, og_title, og_description, og_image, canonical_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [req.params.pageKey, page_label || null, meta_title || null, meta_description || null, og_title || null, og_description || null, og_image || null, canonical_url || null]
      );
    }

    res.json({ message: 'SEO postavke su ažurirane.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

export default router;
