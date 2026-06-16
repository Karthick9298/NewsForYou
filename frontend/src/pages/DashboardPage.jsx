import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useBookmarks } from '@/context/BookmarkContext';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import ArticleModal from '@/components/ArticleModal';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import InterestsDialog from '@/components/dashboard/InterestsDialog';
import { NewsFeed, BookmarksView } from '@/components/dashboard/FeedViews';

/* ── Dashboard page — orchestrates state and data fetching only ──────────── */
export function DashboardPage() {
  const { user, setUser, logout } = useAuth();
  const { bookmarkedArticles } = useBookmarks();
  const navigate = useNavigate();

  const [view, setView] = useState('feed'); // 'feed' | 'bookmarks'
  const [feedGroups, setFeedGroups] = useState(undefined); // undefined=loading, null=no articles today
  const [isFallback, setIsFallback] = useState(false);
  const [feedError, setFeedError] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isInterestsOpen, setIsInterestsOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(56);

  const interests = user?.interests || [];

  useEffect(() => {
    fetchFeed();
  }, []);

  function fetchFeed() {
    setFeedGroups(undefined); // triggers loading skeleton
    api
      .get('/api/news/feed')
      .then((data) => {
        setFeedGroups(data.groups ?? null);
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

  function handleInterestsSaved(newInterests) {
    setUser((prev) => ({ ...prev, interests: newInterests }));
    fetchFeed();
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        view={view}
        onViewChange={setView}
        interests={interests}
        onOpenInterests={() => setIsInterestsOpen(true)}
        onLogout={handleLogout}
        onHeightChange={setHeaderHeight}
      />

      {/* Padding-top = live header height so content never overlaps */}
      <main className="pb-16" style={{ paddingTop: headerHeight }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          {view === 'bookmarks' ? (
            <BookmarksView
              bookmarkedArticles={bookmarkedArticles}
              onArticleClick={setSelectedArticle}
            />
          ) : (
            <NewsFeed
              feedGroups={feedGroups}
              isFallback={isFallback}
              feedError={feedError}
              interests={interests}
              onArticleClick={setSelectedArticle}
            />
          )}
        </div>
      </main>

      {/* Article detail modal */}
      <ArticleModal
        article={selectedArticle}
        open={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      {/* Update interests dialog */}
      <InterestsDialog
        open={isInterestsOpen}
        currentInterests={interests}
        onClose={() => setIsInterestsOpen(false)}
        onSaved={handleInterestsSaved}
      />
    </div>
  );
}

export default DashboardPage;
