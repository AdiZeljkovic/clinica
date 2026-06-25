import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bioclinica-secret-change-in-production';

export interface AuthRequest extends Request {
  adminId?: number;
  adminUsername?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Niste autorizirani.' });
    return;
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: number; username: string };
    req.adminId = payload.id;
    req.adminUsername = payload.username;
    next();
  } catch {
    res.status(401).json({ error: 'Token nije validan ili je istekao.' });
  }
}

export function signToken(id: number, username: string): string {
  return jwt.sign({ id, username }, JWT_SECRET, { expiresIn: '7d' });
}
