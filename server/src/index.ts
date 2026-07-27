import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { query } from './db/connection.js';

import authRouter from './routes/auth.js';
import categoriesRouter from './routes/categories.js';
import productsRouter from './routes/products.js';
import blogRouter from './routes/blog.js';
import contactRouter from './routes/contact.js';
import newsletterRouter from './routes/newsletter.js';
import seoRouter from './routes/seo.js';
import dashboardRouter from './routes/dashboard.js';
import heroSlidesRouter from './routes/heroSlides.js';
import uploadsRouter from './routes/uploads.js';

dotenv.config({ path: '../.env' });

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
// PORT (kontejner/Dokploy) ima prednost nad SERVER_PORT (lokalni dev)
const PORT = Number(process.env.PORT || process.env.SERVER_PORT || 4000);

// Dozvoljeni origini: iz CORS_ORIGIN (zarezom odvojeni) + lokalni dev (frontend 3002, admin 3001)
const allowedOrigins = Array.from(new Set([
  ...(process.env.CORS_ORIGIN || 'http://localhost:3000').split(',').map(s => s.trim()).filter(Boolean),
  'http://localhost:3001',
  'http://localhost:3002',
]));

app.use(cors({
  origin: (origin, cb) => {
    // dozvoli zahtjeve bez origina (curl, server-to-server) i one s liste
    // cb(null, false) umjesto Error — browser dobije CORS odbijenicu, ne 500
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(null, false);
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Statičke slike uploadane od admina (UPLOAD_DIR za kontejner, fallback za lokalni dev)
app.use('/uploads', express.static(process.env.UPLOAD_DIR || join(__dirname, '../../uploads')));

// API rute
app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);
app.use('/api/blog', blogRouter);
app.use('/api/contact', contactRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/seo', seoRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/hero-slides', heroSlidesRouter);
app.use('/api/uploads', uploadsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* Admin kredencijali iz env-a — na svakom bootu uskladi admin_users s
   ADMIN_USERNAME/ADMIN_PASSWORD (idempotentno: piše samo kad se hash razlikuje) */
async function seedAdminFromEnv() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) return;
  try {
    const existing = await query<any[]>('SELECT id, password_hash FROM admin_users WHERE username = ?', [username]);
    if (existing.length) {
      const same = await bcrypt.compare(password, existing[0].password_hash);
      if (!same) {
        const hash = await bcrypt.hash(password, 10);
        await query('UPDATE admin_users SET password_hash = ? WHERE id = ?', [hash, existing[0].id]);
        console.log(`Admin "${username}": lozinka ažurirana iz env-a.`);
      }
    } else {
      const hash = await bcrypt.hash(password, 10);
      await query('INSERT INTO admin_users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, process.env.ADMIN_EMAIL || `${username}@bioclinica.local`, hash]);
      console.log(`Admin "${username}": kreiran iz env-a.`);
    }
  } catch (err) {
    console.error('Admin seed iz env-a nije uspio:', err);
  }
}

// 0.0.0.0 — u kontejneru mora biti dostupan proxy mreži, ne samo loopbacku
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Bioclinica API server pokrenut na portu ${PORT}`);
  seedAdminFromEnv();
});

export default app;
