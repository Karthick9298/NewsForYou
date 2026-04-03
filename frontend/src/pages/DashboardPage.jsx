import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, Trophy, Clapperboard, Cpu, HeartPulse,
  FlaskConical, Sun, Moon, LogOut, Newspaper, Settings, Bell, ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { api } from '@/lib/api';
import nfuLogo from '@/assets/NFU_logo.png';

/* ── Per-category visual metadata ─────────────────────────────────────────── */
const INTEREST_META = {
  business:      { icon: Briefcase,    label: 'Business',      color: 'text-blue-400',   bg: 'bg-blue-500/10',    border: 'border-blue-500/20' },
  sports:        { icon: Trophy,       label: 'Sports',        color: 'text-green-400',  bg: 'bg-green-500/10',   border: 'border-green-500/20' },
  entertainment: { icon: Clapperboard, label: 'Entertainment', color: 'text-pink-400',   bg: 'bg-pink-500/10',    border: 'border-pink-500/20' },
  technology:    { icon: Cpu,          label: 'Technology',    color: 'text-cyan-400',   bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20' },
  health:        { icon: HeartPulse,   label: 'Health',        color: 'text-red-400',    bg: 'bg-red-500/10',     border: 'border-red-500/20' },
  science:       { icon: FlaskConical, label: 'Science',       color: 'text-violet-400', bg: 'bg-violet-500/10',  border: 'border-violet-500/20' },
  general:       { icon: Newspaper,    label: 'General',       color: 'text-amber-400',  bg: 'bg-amber-500/10',   border: 'border-amber-500/20' },
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ── Article card ─────────────────────────────────────────────────────────── */
function ArticleCard({ article, onClick }) {
  return (
    <div
      onClick={() => onClick(article)}
      className="group cursor-pointer bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 flex flex-col"
    >
      {/* Thumbnail */}
      {article.imageUrl ? (
        <div className="aspect-video overflow-hidden shrink-0">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.classList.add('hidden');
            }}
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0">
          <Newspaper className="w-10 h-10 text-primary/30" />
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-2">
          {article.title}
        </h3>
        {article.briefDescription && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3 flex-1">
            {article.briefDescription}
          </p>
        )}
        <div className="mt-auto space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {article.publishedBy && (
              <span className="font-medium text-foreground/70 truncate">{article.publishedBy}</span>
            )}
            {article.publishedBy && article.publishedAt && <span>·</span>}
            {article.publishedAt && <span className="shrink-0">{formatDate(article.publishedAt)}</span>}
          </div>
          {article.author && (
            <p className="text-xs text-muted-foreground truncate">by {article.author}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Article detail modal ─────────────────────────────────────────────────── */
function ArticleModal({ article, open, onClose }) {
  if (!article) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base leading-snug pr-6">{article.title}</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground mt-1">
              {article.publishedBy && <span className="font-medium">{article.publishedBy}</span>}
              {article.author && <span>· by {article.author}</span>}
              {article.publishedAt && <span>· {formatDate(article.publishedAt)}</span>}
            </div>
          </DialogDescription>
        </DialogHeader>

        {article.imageUrl && (
          <div className="rounded-xl overflow-hidden -mx-1">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-auto object-cover"
              onError={(e) => { e.target.parentElement.classList.add('hidden'); }}
            />
          </div>
        )}

        <div className="space-y-3">
          {article.briefDescription && (
            <p className="text-sm font-medium text-foreground leading-relaxed">
              {article.briefDescription}
            </p>
          )}
          {article.detailDescription && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {/* Strip NewsAPI's "[+N chars]" truncation marker */}
              {article.detailDescription.replace(/\s*\[\+\d+ chars\]$/, '')}
            </p>
          )}
          {!article.briefDescription && !article.detailDescription && (
            <p className="text-sm text-muted-foreground">No description available.</p>
          )}
        </div>

        <div className="pt-2 border-t border-border">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Read full article
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Loading skeleton row ─────────────────────────────────────────────────── */
function FeedSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="aspect-video bg-muted animate-pulse" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse" />
            <div className="h-4 bg-muted rounded animate-pulse w-4/5" />
            <div className="h-3 bg-muted rounded animate-pulse w-1/2 mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main dashboard ───────────────────────────────────────────────────────── */
export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [feedGroups, setFeedGroups] = useState(null); // null = loading
  const [isFallback, setIsFallback] = useState(false);
  const [feedError, setFeedError] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    api.get('/api/news/feed')
      .then((data) => {
        setFeedGroups(data.groups);
        setIsFallback(data.fallback ?? false);
      })
      .catch((err) => setFeedError(err.message));
  }, []);

  async function handleLogout() {
    await logout();
    navigate('/', { replace: true });
  }

  const interests = user?.interests || [];
  const digestTime = user?.notificationTime === 'morning' ? '6:00 AM' : '9:00 PM';
  const DigestIcon = user?.notificationTime === 'morning' ? Sun : Moon;
  const totalArticles = feedGroups
    ? Object.values(feedGroups).reduce((sum, arr) => sum + arr.length, 0)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <img src={nfuLogo} alt="NewsForYou" className="h-10 w-auto" />
            <nav className="hidden md:flex items-center gap-6">
              <button className="flex items-center gap-2 text-sm text-primary font-medium">
                <Newspaper className="w-4 h-4" /> My Digest
              </button>
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="w-4 h-4" /> Notifications
              </button>
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Settings className="w-4 h-4" /> Settings
              </button>
            </nav>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">

          {/* ── Welcome banner ──────────────────────────────────────────── */}
          {/* <div className="mb-8 p-6 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}! 👋
            </h1>
            <p className="text-muted-foreground text-sm">
              {feedGroups === null
                ? 'Loading your personalised digest…'
                : totalArticles > 0
                  ? isFallback
                    ? `Here's today's top news — ${totalArticles} general stories while we warm up your personalised feed.`
                    : `Here's your digest — ${totalArticles} fresh stories across ${Object.keys(feedGroups).length} topic${Object.keys(feedGroups).length !== 1 ? 's' : ''}.`
                  : 'Welcome to NewsForYou. Your personalised digest is being prepared.'}
            </p>
          </div> */}

          {/* ── Stats row ───────────────────────────────────────────────── */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Signed in as</p>
              <p className="text-sm font-semibold text-foreground truncate">{user?.email}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Your topics</p>
              <p className="text-sm font-semibold text-foreground">{interests.length} selected</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Daily digest</p>
              <div className="flex items-center gap-2">
                <DigestIcon className="w-4 h-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">{digestTime}</p>
              </div>
            </div>
          </div> */}

          {/* ── Interest chips ──────────────────────────────────────────── */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-8">
            <h2 className="text-base font-semibold text-foreground mb-4">Your Interests</h2>
            <div className="flex flex-wrap gap-3">
              {interests.length > 0 ? interests.map((cat) => {
                const meta = INTEREST_META[cat] ?? { icon: Newspaper, label: cat, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' };
                const Icon = meta.icon;
                return (
                  <div key={cat} className={`flex items-center gap-2 px-4 py-2 rounded-full ${meta.bg} border ${meta.border} text-sm font-medium ${meta.color}`}>
                    <Icon className="w-4 h-4" />
                    {meta.label}
                  </div>
                );
              }) : (
                <p className="text-sm text-muted-foreground">No interests set yet.</p>
              )}
            </div>
          </div>

          {/* ── News feed ───────────────────────────────────────────────── */}
          {feedError ? (
            <div className="bg-card border border-destructive/30 rounded-2xl p-8 text-center">
              <p className="text-sm text-destructive font-medium">{feedError}</p>
            </div>
          ) : feedGroups === null ? (
            /* Loading — one skeleton row per interest (or 2 generic rows if no interests yet) */
            <div className="space-y-10">
              {(interests.length > 0 ? interests : ['_a', '_b']).map((cat) => (
                <section key={cat}>
                  <div className="h-7 w-36 rounded-full bg-muted animate-pulse mb-5" />
                  <FeedSkeleton />
                </section>
              ))}
            </div>
          ) : totalArticles === 0 ? (
            /* Empty state */
            <div className="bg-card border border-border rounded-2xl p-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <Newspaper className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Your digest is on its way</h2>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                We're curating personalised news stories based on your interests.
                Check back at{' '}
                <span className="text-primary font-medium">{digestTime}</span>
                {' '}for your first digest.
              </p>
            </div>
          ) : (
            /* Articles grouped by category — render every group the backend returned */
            <div className="space-y-10">
              {Object.entries(feedGroups).map(([cat, articles]) => {
                if (!articles.length) return null;
                const meta = INTEREST_META[cat] ?? { icon: Newspaper, label: cat, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' };
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
          )}

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
