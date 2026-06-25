import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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
const PORT = process.env.SERVER_PORT || 4000;

// Dozvoljeni origini: iz CORS_ORIGIN (zarezom odvojeni) + lokalni dev (frontend 3002, admin 3001)
const allowedOrigins = Array.from(new Set([
  ...(process.env.CORS_ORIGIN || 'http://localhost:3000').split(',').map(s => s.trim()).filter(Boolean),
  'http://localhost:3001',
  'http://localhost:3002',
]));

app.use(cors({
  origin: (origin, cb) => {
    // dozvoli zahtjeve bez origina (curl, server-to-server) i one s liste
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error(`CORS: origin ${origin} nije dozvoljen.`));
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Statičke slike uploadane od admina
app.use('/uploads', express.static(join(__dirname, '../../uploads')));

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

app.listen(PORT, () => {
  console.log(`Bioclinica API server pokrenut na portu ${PORT}`);
});

export default app;
