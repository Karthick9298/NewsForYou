import { useState } from 'react';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';
import { INTEREST_META, DEFAULT_INTEREST_META } from '@/lib/constants';
import { api } from '@/lib/api';

/**
 * Renders a single category section in the news feed.
 * Manages its own "show more / collapse" state internally.
 *
 * Props:
 *  - category    string          — e.g. 'technology'
 *  - articles    Article[]       — initial articles from the feed
 *  - isFallback  boolean         — show "(trending)" label when true
 *  - onArticleClick (article) => void
 */
export default function CategorySection({ category, articles, isFallback, onArticleClick }) {
  const meta = INTEREST_META[category] ?? DEFAULT_INTEREST_META;
  const Icon = meta.icon;

  const [extras, setExtras] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextPage, setNextPage] = useState(2);
  const [noMore, setNoMore] = useState(false);

  async function loadMore() {
    setIsLoading(true);
    try {
      const data = await api.get(
        `/api/news/articles?category=${category}&limit=3&page=${nextPage}`
      );
      const incoming = data.articles ?? [];

      // Deduplicate against articles already shown (initial feed + previous extras)
      const existingIds = new Set([
        ...articles.map((a) => a._id),
        ...extras.map((a) => a._id),
      ]);
      const fresh = incoming.filter((a) => !existingIds.has(a._id));

      if (fresh.length === 0) {
        setNoMore(true);
      } else {
        setExtras((prev) => [...prev, ...fresh]);
        setNextPage((p) => p + 1);
        if (incoming.length < 3) setNoMore(true);
      }
    } catch {
      setNoMore(true);
    } finally {
      setIsLoading(false);
    }
  }

  function collapse() {
    setExtras([]);
    setNextPage(2);
    setNoMore(false);
  }

  const hasExtras = extras.length > 0;

  return (
    <section>
      {/* Section header chip */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${meta.bg} border ${meta.border} mb-5`}>
        <Icon className={`w-4 h-4 ${meta.color}`} />
        <span className={`text-sm font-semibold ${meta.color}`}>{meta.label}</span>
        {isFallback && <span className="text-xs font-normal opacity-70">(trending)</span>}
      </div>

      {/* Article grid — initial + extras */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <ArticleCard key={article._id} article={article} onClick={onArticleClick} />
        ))}
        {extras.map((article) => (
          <ArticleCard key={article._id} article={article} onClick={onArticleClick} />
        ))}
      </div>

      {/* Show more / loading / show less controls */}
      <div className="flex justify-center mt-5">
        {isLoading ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Loading more…
          </div>
        ) : hasExtras && noMore ? (
          <button
            onClick={collapse}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full border border-border/60 hover:bg-muted/40"
          >
            <ChevronUp className="w-3.5 h-3.5" />
            Show less
          </button>
        ) : !noMore ? (
          <button
            onClick={loadMore}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 px-4 py-2 rounded-full border
              ${meta.bg} ${meta.border} ${meta.color} hover:opacity-80`}
          >
            <ChevronDown className="w-3.5 h-3.5" />
            Show more {meta.label}
          </button>
        ) : null}
      </div>
    </section>
  );
}
