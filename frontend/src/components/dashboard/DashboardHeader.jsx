import { useRef, useEffect, useState } from 'react';
import { LogOut, Bookmark, Newspaper, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBookmarks } from '@/context/BookmarkContext';
import { INTEREST_META, DEFAULT_INTEREST_META } from '@/lib/constants';
import nfuLogo from '@/assets/NFU_logo.png';

/**
 * Fixed top navigation bar for the dashboard.
 *
 * Props:
 *  - view            'feed' | 'bookmarks'
 *  - onViewChange    (newView: string) => void
 *  - interests       string[]  — current user interests
 *  - onOpenInterests () => void
 *  - onLogout        () => void
 *  - onHeightChange  (px: number) => void  — reports live header height so
 *                    the page can pad its content correctly
 */
export default function DashboardHeader({
  view,
  onViewChange,
  interests,
  onOpenInterests,
  onLogout,
  onHeightChange,
}) {
  const { bookmarkedIds } = useBookmarks();
  const headerRef = useRef(null);

  // Report real header height to parent (two-row interest section changes it)
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => onHeightChange?.(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, [onHeightChange]);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Top row: logo | view toggle | sign-out ───────────── */}
        <div className="flex items-center justify-between h-14 gap-3">
          <img src={nfuLogo} alt="NewsForYou" className="h-9 w-auto shrink-0" />

          {/* Feed / Saved toggle */}
          <div className="flex items-center gap-0.5 bg-muted/60 border border-border/70 rounded-full p-1">
            <button
              onClick={() => onViewChange('feed')}
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
              onClick={() => onViewChange('bookmarks')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200
                ${view === 'bookmarks'
                  ? 'bg-background border border-border/80 text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <Bookmark className="w-3 h-3" />
              Saved
              {bookmarkedIds.size > 0 && (
                <span
                  className={`ml-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold inline-flex items-center justify-center
                    ${view === 'bookmarks' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}
                >
                  {bookmarkedIds.size}
                </span>
              )}
            </button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors text-xs shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign out</span>
          </Button>
        </div>

        {/* ── Interest chips section (feed view only) ─────────────── */}
        {view === 'feed' && interests.length > 0 && (
          <div className="border-t border-border/30 pt-2 pb-2.5">

            {/* Mobile / tablet: chips scroll on row 1, button pinned on row 2 */}
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
              <div className="flex justify-end mt-1.5">
                <button
                  type="button"
                  onClick={onOpenInterests}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/70 bg-muted/40 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                  Update interests
                </button>
              </div>
            </div>

            {/* Desktop: single centered row */}
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
                onClick={onOpenInterests}
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
  );
}
