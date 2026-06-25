import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db/connection.js';
import { signToken, authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

interface AdminUser {
  id: number;
  username: string;
  email: string;
  password_hash: string;
}

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Korisničko ime i lozinka su obavezni.' });
    return;
  }

  try {
    const users = await query<AdminUser[]>(
      'SELECT * FROM admin_users WHERE username = ? OR email = ? LIMIT 1',
      [username, username]
    );
    if (!users.length) {
      res.status(401).json({ error: 'Pogrešno korisničko ime ili lozinka.' });
      return;
    }

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Pogrešno korisničko ime ili lozinka.' });
      return;
    }

    const token = signToken(user.id, user.username);
    res.json({ token, username: user.username, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const users = await query<AdminUser[]>(
      'SELECT id, username, email FROM admin_users WHERE id = ?',
      [req.adminId]
    );
    if (!users.length) {
      res.status(404).json({ error: 'Korisnik nije pronađen.' });
      return;
    }
    res.json(users[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

// POST /api/auth/change-password
router.post('/change-password', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 6) {
    res.status(400).json({ error: 'Lozinka mora imati najmanje 6 znakova.' });
    return;
  }

  try {
    const users = await query<AdminUser[]>(
      'SELECT * FROM admin_users WHERE id = ?',
      [req.adminId]
    );
    if (!users.length) {
      res.status(404).json({ error: 'Korisnik nije pronađen.' });
      return;
    }

    const valid = await bcrypt.compare(currentPassword, users[0].password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Trenutna lozinka nije ispravna.' });
      return;
    }

    const hash = await bcrypt.hash(newPassword, 12);
    await query('UPDATE admin_users SET password_hash = ? WHERE id = ?', [hash, req.adminId]);
    res.json({ message: 'Lozinka je uspješno promijenjena.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

export default router;
