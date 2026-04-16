import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from './AuthContext';

const BookmarkContext = createContext(null);

export function BookmarkProvider({ children }) {
  const { user } = useAuth();

  // Set of article _id strings for O(1) lookup
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  // Full article objects ordered newest-first
  const [bookmarkedArticles, setBookmarkedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch bookmarks whenever the logged-in user changes
  useEffect(() => {
    if (!user?.isRegistered) {
      setBookmarkedIds(new Set());
      setBookmarkedArticles([]);
      return;
    }

    setIsLoading(true);
    api
      .get('/api/news/bookmarks')
      .then((data) => {
        setBookmarkedArticles(data.articles);
        setBookmarkedIds(new Set(data.articles.map((a) => a._id)));
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [user]);

  /**
   * Optimistically toggles the bookmark state of an article.
   * Rolls back on API failure.
   */
  const toggleBookmark = useCallback(
    async (article) => {
      const id = article._id;
      const wasBookmarked = bookmarkedIds.has(id);

      // Optimistic update
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        wasBookmarked ? next.delete(id) : next.add(id);
        return next;
      });
      setBookmarkedArticles((prev) =>
        wasBookmarked
          ? prev.filter((a) => a._id !== id)
          : [article, ...prev]
      );

      try {
        await api.post(`/api/news/bookmarks/${id}`);
      } catch {
        // Rollback
        setBookmarkedIds((prev) => {
          const next = new Set(prev);
          wasBookmarked ? next.add(id) : next.delete(id);
          return next;
        });
        setBookmarkedArticles((prev) =>
          wasBookmarked
            ? [article, ...prev]
            : prev.filter((a) => a._id !== id)
        );
      }
    },
    [bookmarkedIds]
  );

  return (
    <BookmarkContext.Provider
      value={{ bookmarkedIds, bookmarkedArticles, isLoading, toggleBookmark }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error('useBookmarks must be used within <BookmarkProvider>');
  return ctx;
}
