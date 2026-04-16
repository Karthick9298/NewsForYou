import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useBookmarks } from '@/context/BookmarkContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bookmark, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import nfuLogo from '@/assets/NFU_logo.png';
import ArticleCard from '@/components/ArticleCard';
import ArticleModal from '@/components/ArticleModal';
import FeedSkeleton from '@/components/FeedSkeleton';
import NightWaitingCard from '@/components/NightWaitingCard';
import { INTEREST_META, DEFAULT_INTEREST_META } from '@/lib/constants';

/* ── Main dashboard ───────────────────────────────────────────────────────── */
export function DashboardPage() {
  const { user, logout } = useAuth();
  const { bookmarkedArticles, bookmarkedIds } = useBookmarks();
  const navigate = useNavigate();

  const [view, setView] = useState('feed'); // 'feed' | 'bookmarks'
  const [feedGroups, setFeedGroups] = useState(undefined); // undefined=loading, null=no articles today
  const [isFallback, setIsFallback] = useState(false);
  const [feedError, setFeedError] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    api.get('/api/news/feed')
      .then((data) => {
        setFeedGroups(data.groups ?? null); // null means backend returned no today's articles
        setIsFallback(data.fallback ?? false);
      })
      .catch((err) => {
        setFeedGroups(null);
        setFeedError(err.message);
      });
  }, []);

  async function handleLogout() {
    await logout();
    navigate('/', { replace: true });
  }

  const interests = user?.interests || [];

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Top row: logo | view toggle | sign-out ───────────── */}
          <div className="flex items-center justify-between h-14 gap-3">
            <img src={nfuLogo} alt="NewsForYou" className="h-9 w-auto shrink-0" />

            {/* Feed / Saved toggle — centred in the bar */}
            <div className="flex items-center gap-0.5 bg-muted/60 border border-border/70 rounded-full p-1">
              <button
                onClick={() => setView('feed')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200
                  ${ view === 'feed'
                    ? 'bg-background border border-border/80 text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Newspaper className="w-3 h-3" />
                Feed
              </button>
              <button
                onClick={() => setView('bookmarks')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200
                  ${ view === 'bookmarks'
                    ? 'bg-background border border-border/80 text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Bookmark className="w-3 h-3" />
                Saved
                {bookmarkedIds.size > 0 && (
                  <span className={`ml-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold inline-flex items-center justify-center
                    ${ view === 'bookmarks' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground' }`}>
                    {bookmarkedIds.size}
                  </span>
                )}
              </button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors text-xs shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>

          {/* ── Interest chips row (feed view only) ─────────────── */}
          {view === 'feed' && interests.length > 0 && (
            <div className="flex items-center gap-2 pb-2.5 overflow-x-auto scrollbar-hide border-t border-border/30 pt-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 shrink-0 pr-1">
                Topics
              </span>
              {interests.map((cat) => {
                const meta = INTEREST_META[cat] ?? DEFAULT_INTEREST_META;
                const Icon = meta.icon;
                return (
                  <div
                    key={cat}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full shrink-0 ${meta.bg} border ${meta.border} ${meta.color} text-xs font-medium`}
                  >
                    <Icon className="w-3 h-3" />
                    {meta.label}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </header>

      {/* Dynamic top padding: taller when the chips row is visible */}
      <main className={`pb-16 transition-[padding] duration-200 ${
        view === 'feed' && interests.length > 0 ? 'pt-[7.5rem]' : 'pt-16'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

          {/* ── View: Feed or Bookmarks ─────────────────────────────────── */}
          {view === 'bookmarks' ? (
            bookmarkedArticles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border flex items-center justify-center">
                  <Bookmark className="w-7 h-7 text-muted-foreground/40" />
                </div>
                <p className="text-sm font-medium text-foreground/70">No saved articles yet</p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Hover any article card and click the bookmark icon to save it here.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-muted-foreground mb-5">
                  {bookmarkedArticles.length} saved {bookmarkedArticles.length === 1 ? 'article' : 'articles'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bookmarkedArticles.map((article) => (
                    <ArticleCard
                      key={article._id}
                      article={article}
                      onClick={setSelectedArticle}
                    />
                  ))}
                </div>
              </div>
            )
          ) : (
          /* ── News feed ───────────────────────────────────────────────────────── */
          feedGroups === undefined ? (
            /* Loading — one skeleton row per interest (or 2 generic rows if no interests yet) */
            <div className="space-y-10">
              {(interests.length > 0 ? interests : ['_a', '_b']).map((cat) => (
                <section key={cat}>
                  <div className="h-7 w-36 rounded-full bg-muted animate-pulse mb-5" />
                  <FeedSkeleton />
                </section>
              ))}
            </div>
          ) : feedError ? (
            <div className="bg-card border border-destructive/30 rounded-2xl p-8 text-center">
              <p className="text-sm text-destructive font-medium">{feedError}</p>
            </div>
          ) : feedGroups === null ? (
            /* No articles for today — cron hasn't run yet (midnight → 6 AM window) */
            <NightWaitingCard />
          ) : (
            /* Articles grouped by category — render every group the backend returned */
            <div className="space-y-10">
              {Object.entries(feedGroups).map(([cat, articles]) => {
                if (!articles.length) return null;
                const meta = INTEREST_META[cat] ?? DEFAULT_INTEREST_META;
                const Icon = meta.icon;
                return (
                  <section key={cat}>
                    {/* Section header */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${meta.bg} border ${meta.border} mb-5`}>
                      <Icon className={`w-4 h-4 ${meta.color}`} />
                      <span className={`text-sm font-semibold ${meta.color}`}>{meta.label}</span>
                      {isFallback && <span className="text-xs font-normal opacity-70">(trending)</span>}
                    </div>
                    {/* Article cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {articles.map((article) => (
                        <ArticleCard
                          key={article._id}
                          article={article}
                          onClick={setSelectedArticle}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )
          )} {/* end view ternary */}

        </div>
      </main>

      {/* ── Article detail modal ────────────────────────────────────────── */}
      <ArticleModal
        article={selectedArticle}
        open={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  );
}

export default DashboardPage;
