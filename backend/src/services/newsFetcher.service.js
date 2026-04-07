/**
 * newsFetcher.service.js
 *
 * Fetches worldwide top-headline articles from NewsAPI.org for all 7 categories.
 * Each run makes 7 requests — one per category with no country filter so results
 * come from global sources.
 *
 * Articles are upserted by URL so re-running is always safe (idempotent).
 */

import NewsArticle, { ARTICLE_CATEGORIES } from '../models/NewsArticle.js';

const BASE_URL = 'https://newsapi.org/v2/top-headlines';
const PAGE_SIZE = 15; // NewsAPI max on free tier per request

// ── Build the request URL for a given category (no key in URL) ───────────────
function buildUrl(category) {
  const params = new URLSearchParams({
    category,
    pageSize: String(PAGE_SIZE),
    language: 'en',
  });
  return `${BASE_URL}?${params.toString()}`;
}

// ── Fetch wrapper — injects API key as header, never in the URL ───────────────
// NewsAPI supports both ?apiKey= (query) and X-Api-Key (header).
// The header approach keeps the key out of server logs, proxy logs,
// and browser history entirely.
function newsApiFetch(url) {
  return fetch(url, {
    headers: { 'X-Api-Key': process.env.NEWS_APIKEY },
  });
}

// ── Map a raw NewsAPI article object to our Mongoose schema ───────────────────
function mapArticle(raw, category) {
  return {
    title: raw.title || 'Untitled',
    url: raw.url,
    imageUrl: raw.urlToImage || null,
    briefDescription: raw.description || null,
    detailDescription: raw.content || null,
    category,
    publishedBy: raw.source?.name || null,
    sourceId: raw.source?.id || null,
    author: typeof raw.author === 'string' ? raw.author.slice(0, 200) : null,
    publishedAt: raw.publishedAt ? new Date(raw.publishedAt) : null,
  };
}

// ── Fetch top headlines for one category (worldwide) ─────────────────────────
async function fetchCategory(category) {
  const url = buildUrl(category);

  const response = await newsApiFetch(url);
  if (!response.ok) {
    throw new Error(`NewsAPI HTTP ${response.status} for category=${category}`);
  }

  const data = await response.json();

  if (data.status !== 'ok') {
    throw new Error(`NewsAPI error [${data.code}]: ${data.message}`);
  }

  // Drop articles that NewsAPI marks as removed
  const valid = (data.articles || []).filter(
    (a) => a.url && !a.url.includes('removed.com') && a.title !== '[Removed]'
  );

  return valid;
}

// ── Upsert an array of raw articles into MongoDB ──────────────────────────────
async function upsertArticles(rawList, category) {
  let savedCount = 0;
  let skippedCount = 0;

  for (const raw of rawList) {
    const doc = mapArticle(raw, category);
    const result = await NewsArticle.updateOne(
      { url: doc.url },
      { $setOnInsert: doc },
      { upsert: true }
    );
    result.upsertedCount > 0 ? savedCount++ : skippedCount++;
  }

  return { savedCount, skippedCount };
}

// ── Main export ───────────────────────────────────────────────────────────────
export async function fetchAndStoreAllArticles() {
  if (!process.env.NEWS_APIKEY) {
    throw new Error('NEWS_APIKEY environment variable is not set.');
  }

  console.log('[NewsFetcher] Starting worldwide article fetch for all categories…');

  const results = [];
  const errors = [];

  // Sequential to respect NewsAPI free-tier rate limits
  for (const category of ARTICLE_CATEGORIES) {
    try {
      const articles = await fetchCategory(category);
      const { savedCount, skippedCount } = await upsertArticles(articles, category);
      const r = { category, fetched: articles.length, savedCount, skippedCount };
      results.push(r);
      console.log(
        `  ✔ ${r.category} — fetched: ${r.fetched}, new: ${r.savedCount}, dupes: ${r.skippedCount}`
      );
    } catch (err) {
      console.error(`  ✖ ${category} — ${err.message}`);
      errors.push({ category, error: err.message });
    }
  }

  const totalFetched = results.reduce((s, r) => s + r.fetched, 0);
  const totalSaved   = results.reduce((s, r) => s + r.savedCount, 0);
  const totalSkipped = results.reduce((s, r) => s + r.skippedCount, 0);

  const summary = {
    completedAt: new Date().toISOString(),
    totalFetched,
    totalSaved,
    totalSkipped,
    categoriesProcessed: results.length,
    errors,
  };

  console.log(
    `[NewsFetcher] Done — fetched: ${totalFetched}, saved: ${totalSaved}, dupes: ${totalSkipped}, errors: ${errors.length}`
  );

  return summary;
}
