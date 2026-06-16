import { Bookmark } from 'lucide-react';
import ArticleCard from '@/components/ArticleCard';
import FeedSkeleton from '@/components/FeedSkeleton';
import NightWaitingCard from '@/components/NightWaitingCard';
import CategorySection from '@/components/dashboard/CategorySection';

/**
 * Renders the news feed section, handling all loading / error / empty states.
 *
 * Props:
 *  - feedGroups      undefined (loading) | null (no articles today) | object (grouped by category)
 *  - isFallback      boolean
 *  - feedError       string
 *  - interests       string[]
 *  - onArticleClick  (article) => void
 */
export function NewsFeed({ feedGroups, isFallback, feedError, interests, onArticleClick }) {
  // Loading skeleton
  if (feedGroups === undefined) {
    return (
      <div className="space-y-10">
        {(interests.length > 0 ? interests : ['_a', '_b']).map((cat) => (
          <section key={cat}>
            <div className="h-7 w-36 rounded-full bg-muted animate-pulse mb-5" />
            <FeedSkeleton />
          </section>
        ))}
      </div>
    );
  }

  // Error state
  if (feedError) {
    return (
      <div className="bg-card border border-destructive/30 rounded-2xl p-8 text-center">
        <p className="text-sm text-destructive font-medium">{feedError}</p>
      </div>
    );
  }

  // No articles yet for today (cron runs midnight → 6 AM)
  if (feedGroups === null) {
    return <NightWaitingCard />;
  }

  // Render grouped categories
  return (
    <div className="space-y-10">
      {Object.entries(feedGroups).map(([cat, articles]) => {
        if (!articles.length) return null;
        return (
          <CategorySection
            key={cat}
            category={cat}
            articles={articles}
            isFallback={isFallback}
            onArticleClick={onArticleClick}
          />
        );
      })}
    </div>
  );
}

/**
 * Renders the bookmarks view, handling empty and populated states.
 *
 * Props:
 *  - bookmarkedArticles  Article[]
 *  - onArticleClick      (article) => void
 */
export function BookmarksView({ bookmarkedArticles, onArticleClick }) {
  if (bookmarkedArticles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border flex items-center justify-center">
          <Bookmark className="w-7 h-7 text-muted-foreground/40" />
        </div>
        <p className="text-sm font-medium text-foreground/70">No saved articles yet</p>
        <p className="text-xs text-muted-foreground max-w-xs">
          Hover any article card and click the bookmark icon to save it here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-5">
        {bookmarkedArticles.length} saved {bookmarkedArticles.length === 1 ? 'article' : 'articles'}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {bookmarkedArticles.map((article) => (
          <ArticleCard key={article._id} article={article} onClick={onArticleClick} />
        ))}
      </div>
    </div>
  );
}
