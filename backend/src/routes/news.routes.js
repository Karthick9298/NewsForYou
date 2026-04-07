import { Router } from 'express';
import { triggerFetch, getArticles, getStats, getFeed } from '../controllers/news.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// POST /api/news/fetch  — manually trigger the NewsAPI fetch pipeline (testing)
/**router.post('/fetch', triggerFetch); // onl in development
 **/

// GET  /api/news/articles — list stored articles with optional ?category=&page=&limit= (protected)
router.get('/articles', protect, getArticles);

// GET  /api/news/feed — personalised feed for the logged-in user (protected)
router.get('/feed', protect, getFeed);

// GET  /api/news/stats — count breakdown by category
router.get('/stats', getStats);

export default router;
