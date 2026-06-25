import { Router, Request, Response } from 'express';
import { query } from '../db/connection.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// POST /api/newsletter/subscribe - javni
router.post('/subscribe', async (req: Request, res: Response) => {
  const { email, source } = req.body;
  if (!email) { res.status(400).json({ error: 'Email je obavezan.' }); return; }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Email adresa nije ispravna.' });
    return;
  }

  try {
    const existing = await query<any[]>(
      'SELECT id, is_active FROM newsletter_subscribers WHERE email = ?',
      [email]
    );

    if (existing.length) {
      if (existing[0].is_active) {
        res.status(409).json({ error: 'Ova email adresa je već pretplaćena.' });
        return;
      }
      await query('UPDATE newsletter_subscribers SET is_active = 1, unsubscribed_at = NULL WHERE email = ?', [email]);
      res.json({ message: 'Uspješno ste se pretplatili na newsletter.' });
      return;
    }

    const validSources = ['header', 'footer', 'popup'];
    const src = validSources.includes(source) ? source : 'footer';
    await query('INSERT INTO newsletter_subscribers (email, source) VALUES (?, ?)', [email, src]);
    res.status(201).json({ message: 'Uspješno ste se pretplatili na newsletter.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// POST /api/newsletter/unsubscribe - javni
router.post('/unsubscribe', async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) { res.status(400).json({ error: 'Email je obavezan.' }); return; }

  try {
    await query(
      'UPDATE newsletter_subscribers SET is_active = 0, unsubscribed_at = NOW() WHERE email = ?',
      [email]
    );
    res.json({ message: 'Uspješno ste se odjavili s newslettera.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// GET /api/newsletter/subscribers - admin
router.get('/subscribers', authMiddleware, async (req: Request, res: Response) => {
  const { active } = req.query;
  let sql = 'SELECT * FROM newsletter_subscribers';
  const params: any[] = [];
  if (active !== undefined) { sql += ' WHERE is_active = ?'; params.push(active === 'true' ? 1 : 0); }
  sql += ' ORDER BY subscribed_at DESC';

  try {
    const subscribers = await query(sql, params);
    res.json(subscribers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// GET /api/newsletter/stats - admin
router.get('/stats', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const stats = await query<any[]>(
      'SELECT COUNT(*) as total, SUM(is_active) as active, SUM(1 - is_active) as inactive FROM newsletter_subscribers'
    );
    res.json(stats[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// DELETE /api/newsletter/subscribers/:id - admin
router.delete('/subscribers/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await query<any>('DELETE FROM newsletter_subscribers WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) { res.status(404).json({ error: 'Pretplatnik nije pronađen.' }); return; }
    res.json({ message: 'Pretplatnik je obrisan.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

export default router;
