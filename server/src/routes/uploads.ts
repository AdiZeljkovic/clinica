import { Router, Request, Response } from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

const __dirname = dirname(fileURLToPath(import.meta.url));
// index.ts servira /uploads iz <projekt>/uploads (server/src → ../../uploads).
// Ovaj fajl je u server/src/routes, pa treba jedan nivo više: ../../../uploads.
const UPLOAD_DIR = process.env.UPLOAD_DIR || join(__dirname, '../../../uploads');

if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    const base = file.originalname
      .replace(ext, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60);
    cb(null, `${Date.now()}-${base || 'slika'}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (_req, file, cb) => {
    if (/^image\/(png|jpe?g|webp|gif|svg\+xml|avif)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Dozvoljene su samo slike (png, jpg, webp, gif, svg, avif).'));
  },
});

// POST /api/uploads — admin (multipart/form-data, polje "file")
router.post('/', authMiddleware, (req: Request, res: Response) => {
  upload.single('file')(req, res, (err: any) => {
    if (err) {
      res.status(400).json({ error: err.message || 'Greška pri uploadu.' });
      return;
    }
    if (!req.file) {
      res.status(400).json({ error: 'Nije poslan fajl.' });
      return;
    }
    // Relativni URL — ne veže bazu za konkretan host/protokol
    const url = `/uploads/${req.file.filename}`;
    res.status(201).json({ url, filename: req.file.filename });
  });
});

export default router;
