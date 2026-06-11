import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useBookmarks } from '@/context/BookmarkContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bookmark, Newspaper, Pencil, Check, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { api } from '@/lib/api';
import nfuLogo from '@/assets/NFU_logo.png';
import ArticleCard from '@/components/ArticleCard';
import ArticleModal from '@/components/ArticleModal';
import FeedSkeleton from '@/components/FeedSkeleton';
import NightWaitingCard from '@/components/NightWaitingCard';
import { ALL_INTERESTS, INTEREST_META, DEFAULT_INTEREST_META } from '@/lib/constants';

/* ── Main dashboard ───────────────────────────────────────────────────────── */
export function DashboardPage() {
  const { user, setUser, logout } = useAuth();
  const { bookmarkedArticles, bookmarkedIds } = useBookmarks();
  const navigate = useNavigate();

  const [view, setView] = useState('feed'); // 'feed' | 'bookmarks'
  const [feedGroups, setFeedGroups] = useState(undefined); // undefined=loading, null=no articles today
  const [isFallback, setIsFallback] = useState(false);
  const [feedError, setFeedError] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isInterestsOpen, setIsInterestsOpen] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [interestsError, setInterestsError] = useState('');
  const [isSavingInterests, setIsSavingInterests] = useState(false);

  // ── Show more: per-category extra articles loaded on demand ────────────────
  // extras[cat]   = array of additional articles fetched beyond the initial feed
  // moreLoading[cat] = true while that category's next page is fetching
  // morePage[cat]    = next page number to request (starts at 2)
  // noMore[cat]      = true once the backend returns an empty page
  const [extras, setExtras] = useState({});
  const [moreLoading, setMoreLoading] = useState({});
  const [morePage, setMorePage] = useState({});
  const [noMore, setNoMore] = useState({});

  async function loadMoreForCategory(cat, currentFeedArticles) {
    const page = morePage[cat] ?? 2;
    setMoreLoading((prev) => ({ ...prev, [cat]: true }));
    try {
      const data = await api.get(`/api/news/articles?category=${cat}&limit=3&page=${page}`);
      const incoming = data.articles ?? [];

      // Deduplicate against articles already shown (feed + previous extras)
      const existingIds = new Set([
        ...currentFeedArticles.map((a) => a._id),
        ...(extras[cat] ?? []).map((a) => a._id),
      ]);
      const fresh = incoming.filter((a) => !existingIds.has(a._id));

      if (fresh.length === 0) {
        setNoMore((prev) => ({ ...prev, [cat]: true }));
      } else {
        setExtras((prev) => ({ ...prev, [cat]: [...(prev[cat] ?? []), ...fresh] }));
        setMorePage((prev) => ({ ...prev, [cat]: page + 1 }));
        if (incoming.length < 3) setNoMore((prev) => ({ ...prev, [cat]: true }));
      }
    } catch {
      setNoMore((prev) => ({ ...prev, [cat]: true }));
    } finally {
      setMoreLoading((prev) => ({ ...prev, [cat]: false }));
    }
  }

  function collapseCategory(cat) {
    setExtras((prev) => ({ ...prev, [cat]: [] }));
    setMorePage((prev) => ({ ...prev, [cat]: 2 }));
    setNoMore((prev) => ({ ...prev, [cat]: false }));
  }

  // Measures the fixed header's actual height so main content never overlaps it,
  // even on mobile where the two-row interest section makes the header taller.
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(56);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeaderHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    fetchFeed();
  }, []);

  useEffect(() => {
    if (user?.interests?.length) {
      setSelectedInterests(user.interests);
    }
  }, [user]);

  function fetchFeed() {
    api.get('/api/news/feed')
      .then((data) => {
        setFeedGroups(data.groups ?? null); // null means backend returned no today's articles
        setIsFallback(data.fallback ?? false);
        setFeedError('');
      })
      .catch((err) => {
        setFeedGroups(null);
        setFeedError(err.message);
      });
  }

  async function handleLogout() {
    await logout();
    navigate('/', { replace: true });
  }

  function openInterests() {
    setSelectedInterests(interests);
    setInterestsError('');
    setIsInterestsOpen(true);
  }

  function toggleInterest(id) {
    setSelectedInterests((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }

  async function handleSaveInterests() {
    setInterestsError('');
    if (selectedInterests.length < 1) {
      setInterestsError('Please select at least 1 interest.');
      return;
    }
    setIsSavingInterests(true);
    try {
      const data = await api.post('/api/auth/register/interests', { interests: selectedInterests });
      setUser((prev) => ({
        ...prev,
        interests: data.interests ?? selectedInterests,
      }));
      setIsInterestsOpen(false);
      setFeedGroups(undefined);
      setIsFallback(false);
      setFeedError('');
      fetchFeed();
    } catch (err) {
      setInterestsError(err.message);
    } finally {
      setIsSavingInterests(false);
    }
  }

  const interests = user?.interests || [];

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Top row: logo | view toggle | sign-out ───────────── */}
          <div className="flex items-center justify-between h-14 gap-3">
            <img src={nfuLogo} alt="NewsForYou" className="h-9 w-auto shrink-0" />

            {/* Feed / Saved toggle — centred in the bar */}
            <div className="flex items-center gap-0.5 bg-muted/60 border border-border/70 rounded-full p-1">
              <button
                onClick={() => setView('feed')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200
                  ${view === 'feed'
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
                  ${view === 'bookmarks'
                    ? 'bg-background border border-border/80 text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <Bookmark className="w-3 h-3" />
                Saved
                {bookmarkedIds.size > 0 && (
                  <span className={`ml-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold inline-flex items-center justify-center
                    ${view === 'bookmarks' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
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

          {/* ── Interest chips section (feed view only) ─────────────── */}
          {view === 'feed' && interests.length > 0 && (
            <div className="border-t border-border/30 pt-2 pb-2.5">

              {/* ── Mobile / tablet: chips scroll on row 1, button pinned on row 2 ── */}
              <div className="md:hidden">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 shrink-0 pr-1 select-none">
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
                {/* Update button — always fully visible on its own row */}
                <div className="flex justify-end mt-1.5">
                  <button
                    type="button"
                    onClick={openInterests}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/40 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
                  >
                    <Pencil className="w-3 h-3" />
                    Update interests
                  </button>
                </div>
              </div>

              {/* ── Desktop: single centered row (original) ─────────────────── */}
              <div className="hidden md:flex items-center justify-center gap-2 overflow-x-auto scrollbar-hide">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 shrink-0 pr-1 select-none">
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
                <button
                  type="button"
                  onClick={openInterests}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/40 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors shrink-0"
                >
                  <Pencil className="w-3 h-3" />
                  Update interests
                </button>
              </div>

            </div>
          )}

        </div>
      </header>

      {/* Padding-top = real header height measured live — never overlaps on any screen size */}
      <main className="pb-16" style={{ paddingTop: headerHeight }}>
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
                  const catExtras = extras[cat] ?? [];
                  const hasExtras = catExtras.length > 0;

                  return (
                    <section key={cat}>
                      {/* Section header */}
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${meta.bg} border ${meta.border} mb-5`}>
                        <Icon className={`w-4 h-4 ${meta.color}`} />
                        <span className={`text-sm font-semibold ${meta.color}`}>{meta.label}</span>
                        {isFallback && <span className="text-xs font-normal opacity-70">(trending)</span>}
                      </div>

                      {/* Initial feed articles */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {articles.map((article) => (
                          <ArticleCard
                            key={article._id}
                            article={article}
                            onClick={setSelectedArticle}
                          />
                        ))}

                        {/* Extra articles loaded via Show more */}
                        {catExtras.map((article) => (
                          <ArticleCard
                            key={article._id}
                            article={article}
                            onClick={setSelectedArticle}
                          />
                        ))}
                      </div>

                      {/* Show more / Show less controls */}
                      <div className="flex justify-center mt-5">
                        {moreLoading[cat] ? (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Loading more…
                          </div>
                        ) : hasExtras && noMore[cat] ? (
                          // Loaded everything — offer collapse
                          <button
                            onClick={() => collapseCategory(cat)}
                            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-full border border-border/60 hover:bg-muted/40"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                            Show less
                          </button>
                        ) : !noMore[cat] ? (
                          // More articles available
                          <button
                            onClick={() => loadMoreForCategory(cat, articles)}
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

      <Dialog open={isInterestsOpen} onOpenChange={setIsInterestsOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Update your interests</DialogTitle>
            <DialogDescription>Pick 1 to 4 topics to personalize your feed.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-2.5">
            {ALL_INTERESTS.map(({ id, label, icon: Icon, color, iconColor, border }) => {
              const isSelected = selectedInterests.includes(id);
              const isDisabled = !isSelected && selectedInterests.length >= 4;
              return (
                <button
                  key={id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => toggleInterest(id)}
                  className={`relative flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200
                    ${isSelected ? `bg-gradient-to-br ${color} ${border} border` : 'border-border/60 bg-background/40 hover:border-border hover:bg-background/80'}
                    ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
                    ${isSelected ? 'bg-white/10' : 'bg-muted'}`}>
                    <Icon className={`w-4 h-4 transition-colors ${isSelected ? iconColor : 'text-muted-foreground'}`} />
                  </div>
                  <span className={`text-sm font-semibold transition-colors ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {label}
                  </span>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center shadow-sm">
                      <Check className="w-2.5 h-2.5 text-primary-foreground" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {interestsError && (
            <p className="text-xs text-destructive font-medium">{interestsError}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              onClick={handleSaveInterests}
              disabled={isSavingInterests || selectedInterests.length < 1}
              className="gap-2"
            >
              {isSavingInterests ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save interests'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DashboardPage;
