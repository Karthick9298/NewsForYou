import { Router } from 'express';
import { triggerFetch, getArticles, getStats, getFeed, toggleBookmark, getBookmarks } from '../controllers/news.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

// POST /api/news/fetch  — manually trigger the NewsAPI fetch pipeline (testing)

if(process.env.NODE_ENV === 'development')router.post('/fetch', triggerFetch); // onl in development


// GET  /api/news/articles — list stored articles with optional ?category=&page=&limit= (protected)
router.get('/articles', protect, getArticles);

// GET  /api/news/feed — personalised feed for the logged-in user (protected)
router.get('/feed', protect, getFeed);

// GET  /api/news/stats — count breakdown by category
router.get('/stats', getStats);

// GET  /api/news/bookmarks — get all bookmarked articles (protected)
router.get('/bookmarks', protect, getBookmarks);

// POST /api/news/bookmarks/:articleId — toggle bookmark on/off (protected)
router.post('/bookmarks/:articleId', protect, toggleBookmark);

export default router;
