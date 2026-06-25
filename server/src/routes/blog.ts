import { Router, Request, Response } from 'express';
import { query } from '../db/connection.js';
import { authMiddleware } from '../middleware/auth.js';
import slugify from 'slugify';

const router = Router();

// GET /api/blog - javni (samo objavljeni)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const posts = await query(
      'SELECT id, title, excerpt, image_url, slug, published_at FROM blog_posts WHERE is_published = 1 ORDER BY published_at DESC'
    );
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// GET /api/blog/all - admin (svi)
router.get('/all', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const posts = await query(
      'SELECT id, title, excerpt, image_url, slug, is_published, published_at, created_at FROM blog_posts ORDER BY created_at DESC'
    );
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// GET /api/blog/:id - javni
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const posts = await query<any[]>(
      'SELECT * FROM blog_posts WHERE id = ? OR slug = ?',
      [req.params.id, req.params.id]
    );
    if (!posts.length) { res.status(404).json({ error: 'Članak nije pronađen.' }); return; }
    res.json(posts[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// POST /api/blog - admin
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const { id, title, excerpt, content, image_url, is_published } = req.body;
  if (!id || !title) { res.status(400).json({ error: 'ID i naslov su obavezni.' }); return; }

  const slug = slugify(title, { lower: true, strict: true, locale: 'hr' });
  const published_at = is_published ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null;

  try {
    await query(
      'INSERT INTO blog_posts (id, title, excerpt, content, image_url, slug, is_published, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, title, excerpt || null, content || null, image_url || null, slug, is_published ? 1 : 0, published_at]
    );
    res.status(201).json({ message: 'Članak je kreiran.', id, slug });
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') { res.status(409).json({ error: 'Članak s tim ID-om već postoji.' }); return; }
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// PUT /api/blog/:id - admin
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  const { title, excerpt, content, image_url, is_published } = req.body;
  if (!title) { res.status(400).json({ error: 'Naslov je obavezan.' }); return; }

  const slug = slugify(title, { lower: true, strict: true, locale: 'hr' });

  try {
    const existing = await query<any[]>('SELECT is_published, published_at FROM blog_posts WHERE id = ?', [req.params.id]);
    if (!existing.length) { res.status(404).json({ error: 'Članak nije pronađen.' }); return; }

    let published_at = existing[0].published_at;
    if (is_published && !published_at) {
      published_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    await query(
      'UPDATE blog_posts SET title=?, excerpt=?, content=?, image_url=?, slug=?, is_published=?, published_at=? WHERE id=?',
      [title, excerpt || null, content || null, image_url || null, slug, is_published ? 1 : 0, published_at, req.params.id]
    );
    res.json({ message: 'Članak je ažuriran.', slug });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// DELETE /api/blog/:id - admin
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await query<any>('DELETE FROM blog_posts WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) { res.status(404).json({ error: 'Članak nije pronađen.' }); return; }
    res.json({ message: 'Članak je obrisan.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

export default router;
