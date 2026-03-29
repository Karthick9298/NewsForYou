import { fetchAndStoreAllArticles } from '../services/newsFetcher.service.js';
import NewsArticle, { ARTICLE_CATEGORIES } from '../models/NewsArticle.js';

/**
 * POST /api/news/fetch
 * Manually trigger the NewsAPI fetch pipeline.
 * Use this for testing — will become a cron job in production.
 */
export async function triggerFetch(req, res) {
  try {
    const summary = await fetchAndStoreAllArticles();
    return res.status(200).json({
      message: 'Article fetch completed.',
      summary,
    });
  } catch (err) {
    console.error('[news.controller] triggerFetch error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * GET /api/news/articles
 * Query params: category, page (default 1), limit (default 20)
 * Returns stored articles for quick verification.
 */
export async function getArticles(req, res) {
  try {
    const { category, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (category) {
      if (!ARTICLE_CATEGORIES.includes(category)) {
        return res.status(400).json({
          message: `Invalid category. Must be one of: ${ARTICLE_CATEGORIES.join(', ')}`,
        });
      }
      filter.category = category;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [articles, total] = await Promise.all([
      NewsArticle.find(filter)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .select('-__v'),
      NewsArticle.countDocuments(filter),
    ]);

    return res.status(200).json({
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      articles,
    });
  } catch (err) {
    console.error('[news.controller] getArticles error:', err);
    return res.status(500).json({ message: err.message });
  }
}

/**
 * GET /api/news/stats
 * Returns a count breakdown by category — handy for testing.
 */
export async function getStats(req, res) {
  try {
    const breakdown = await NewsArticle.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const total = await NewsArticle.countDocuments();

    return res.status(200).json({ total, breakdown });
  } catch (err) {
    console.error('[news.controller] getStats error:', err);
    return res.status(500).json({ message: err.message });
  }
}
