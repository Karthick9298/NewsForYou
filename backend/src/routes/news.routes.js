import { Router } from 'express';
import { triggerFetch, getArticles, getStats } from '../controllers/news.controller.js';

const router = Router();

// POST /api/news/fetch  — manually trigger the NewsAPI fetch pipeline (testing)
router.post('/fetch', triggerFetch);

// GET  /api/news/articles — list stored articles with optional ?category=&page=&limit=
router.get('/articles', getArticles);

// GET  /api/news/stats — count breakdown by category + region
router.get('/stats', getStats);

export default router;
