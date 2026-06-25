import { Router, Request, Response } from 'express';
import { query } from '../db/connection.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// POST /api/contact - javni (slanje poruke)
router.post('/', async (req: Request, res: Response) => {
  const { first_name, last_name, email, subject, message } = req.body;
  if (!first_name || !last_name || !email || !message) {
    res.status(400).json({ error: 'Ime, prezime, email i poruka su obavezni.' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Email adresa nije ispravna.' });
    return;
  }

  try {
    await query(
      'INSERT INTO contact_messages (first_name, last_name, email, subject, message) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, email, subject || null, message]
    );
    res.status(201).json({ message: 'Vaša poruka je uspješno poslana.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// GET /api/contact - admin
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  const { status } = req.query;
  let sql = 'SELECT * FROM contact_messages';
  const params: any[] = [];
  if (status) { sql += ' WHERE status = ?'; params.push(status); }
  sql += ' ORDER BY created_at DESC';

  try {
    const messages = await query(sql, params);
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// GET /api/contact/stats - admin
router.get('/stats', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const stats = await query(
      "SELECT status, COUNT(*) as count FROM contact_messages GROUP BY status"
    );
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// PATCH /api/contact/:id/status - admin
router.patch('/:id/status', authMiddleware, async (req: Request, res: Response) => {
  const { status } = req.body;
  const validStatuses = ['new', 'read', 'replied', 'archived'];
  if (!validStatuses.includes(status)) {
    res.status(400).json({ error: 'Nevažeći status.' });
    return;
  }

  try {
    const result = await query<any>('UPDATE contact_messages SET status = ? WHERE id = ?', [status, req.params.id]);
    if (result.affectedRows === 0) { res.status(404).json({ error: 'Poruka nije pronađena.' }); return; }
    res.json({ message: 'Status je ažuriran.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// DELETE /api/contact/:id - admin
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await query<any>('DELETE FROM contact_messages WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) { res.status(404).json({ error: 'Poruka nije pronađena.' }); return; }
    res.json({ message: 'Poruka je obrisana.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

export default router;
