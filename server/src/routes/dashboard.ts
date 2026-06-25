import { Router, Request, Response } from 'express';
import { query } from '../db/connection.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET /api/dashboard/stats - admin
router.get('/stats', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const [products, categories, posts, messages, subscribers] = await Promise.all([
      query<any[]>('SELECT COUNT(*) as count FROM products'),
      query<any[]>('SELECT COUNT(*) as count FROM categories'),
      query<any[]>('SELECT COUNT(*) as count FROM blog_posts WHERE is_published = 1'),
      query<any[]>('SELECT COUNT(*) as count FROM contact_messages WHERE status = "new"'),
      query<any[]>('SELECT COUNT(*) as count FROM newsletter_subscribers WHERE is_active = 1'),
    ]);

    const recentMessages = await query(
      'SELECT id, first_name, last_name, email, subject, status, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 5'
    );

    res.json({
      stats: {
        products: products[0].count,
        categories: categories[0].count,
        publishedPosts: posts[0].count,
        newMessages: messages[0].count,
        activeSubscribers: subscribers[0].count,
      },
      recentMessages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Greška na serveru.' });
  }
});

export default router;
