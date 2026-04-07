import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import nfuLogo from '@/assets/NFU_logo.png';
import ArticleCard from '@/components/ArticleCard';
import ArticleModal from '@/components/ArticleModal';
import FeedSkeleton from '@/components/FeedSkeleton';
import { INTEREST_META, DEFAULT_INTEREST_META } from '@/lib/constants';

/* ── Fixed star positions for the midnight waiting card ──────────────────── */
const NIGHT_STARS = [
  { top: '7%',  left: '9%',  w: 2, dur: 2.1, delay: 0.0 },
  { top: '13%', left: '22%', w: 1, dur: 3.2, delay: 0.5 },
  { top: '5%',  left: '38%', w: 3, dur: 2.6, delay: 0.9 },
  { top: '18%', left: '54%', w: 1, dur: 1.9, delay: 0.3 },
  { top: '9%',  left: '70%', w: 2, dur: 3.0, delay: 1.4 },
  { top: '22%', left: '85%', w: 1, dur: 2.4, delay: 0.7 },
  { top: '31%', left: '6%',  w: 2, dur: 3.5, delay: 1.1 },
  { top: '26%', left: '33%', w: 1, dur: 2.0, delay: 1.6 },
  { top: '11%', left: '50%', w: 2, dur: 2.8, delay: 0.4 },
  { top: '36%', left: '67%', w: 1, dur: 3.1, delay: 1.0 },
  { top: '4%',  left: '91%', w: 2, dur: 2.0, delay: 1.9 },
  { top: '20%', left: '14%', w: 1, dur: 2.7, delay: 0.6 },
  { top: '29%', left: '79%', w: 3, dur: 3.3, delay: 1.2 },
  { top: '40%', left: '44%', w: 1, dur: 2.2, delay: 0.8 },
  { top: '16%', left: '60%', w: 2, dur: 2.9, delay: 1.7 },
  { top: '8%',  left: '76%', w: 1, dur: 3.4, delay: 0.2 },
  { top: '33%', left: '25%', w: 2, dur: 2.3, delay: 1.3 },
  { top: '42%', left: '89%', w: 1, dur: 1.8, delay: 0.4 },
  { top: '3%',  left: '47%', w: 2, dur: 3.0, delay: 2.0 },
  { top: '24%', left: '96%', w: 1, dur: 2.5, delay: 0.1 },
];



/* ── Main dashboard ───────────────────────────────────────────────────────── */
export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
  const digestTime = user?.notificationTime === 'morning' ? '6:00 AM' : '9:00 PM';
  const totalArticles = feedGroups && typeof feedGroups === 'object'
    ? Object.values(feedGroups).reduce((sum, arr) => sum + arr.length, 0)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Top row: logo + sign-out ─────────────────────────────── */}
          <div className="flex items-center justify-between h-14">
            <img src={nfuLogo} alt="NewsForYou" className="h-9 w-auto" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors text-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>

          {/* ── Interest chips row ───────────────────────────────────── */}
          {interests.length > 0 && (
            <div className="flex items-center gap-2 pb-3 overflow-x-auto scrollbar-hide">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 shrink-0 pr-1">
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

      <main className="pt-28 pb-16">
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

          {/* ── News feed ───────────────────────────────────────────────── */}
          {feedGroups === undefined ? (
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
            <>
              <style>{`
                @keyframes nfu-twinkle {
                  0%,100% { opacity: .08; transform: scale(.5); }
                  50%      { opacity:  1;  transform: scale(1.5); }
                }
                @keyframes nfu-float {
                  0%,100% { transform: translateY(0px);  }
                  50%      { transform: translateY(-14px); }
                }
                @keyframes nfu-glow-breathe {
                  0%,100% { opacity: .25; transform: scale(1);    }
                  50%      { opacity: .55; transform: scale(1.12); }
                }
                @keyframes nfu-orbit-cw {
                  from { transform: rotate(0deg);   }
                  to   { transform: rotate(360deg); }
                }
                @keyframes nfu-orbit-ccw {
                  from { transform: rotate(0deg);    }
                  to   { transform: rotate(-360deg); }
                }
                @keyframes nfu-ripple {
                  0%   { transform: scale(.85); opacity: .55; }
                  100% { transform: scale(2.6); opacity: 0;   }
                }
                @keyframes nfu-dawn {
                  0%,100% { opacity: .3; }
                  50%      { opacity: .7; }
                }
                @keyframes nfu-slide-up {
                  0%   { opacity: 0; transform: translateY(20px); }
                  100% { opacity: 1; transform: translateY(0);    }
                }
                @keyframes nfu-scale-in {
                  0%   { opacity: 0; transform: scale(.5) rotate(-20deg); }
                  100% { opacity: 1; transform: scale(1) rotate(0deg);    }
                }
                @keyframes nfu-shooting-star {
                  0%   { transform: translateX(0) translateY(0) rotate(-35deg); opacity: 1; width: 0px;   }
                  40%  { width: 80px; opacity: 1; }
                  100% { transform: translateX(180px) translateY(90px) rotate(-35deg); opacity: 0; width: 80px; }
                }
                @keyframes nfu-text-glow {
                  0%,100% { text-shadow: 0 0 8px rgba(251,191,36,.3); }
                  50%      { text-shadow: 0 0 24px rgba(251,191,36,.8), 0 0 48px rgba(251,191,36,.3); }
                }
                .nfu-shooting { animation: nfu-shooting-star 5s ease-in-out infinite; }
                .nfu-shooting-2 { animation: nfu-shooting-star 5s ease-in-out 2.5s infinite; }
              `}</style>

              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '20px',
                  border: '1px solid rgba(245,158,11,.2)',
                  background: 'linear-gradient(170deg,#06060f 0%,#0c0a1a 35%,#0f0a08 70%,#0a0600 100%)',
                  minHeight: 380,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '64px 32px',
                  animation: 'nfu-slide-up .7s cubic-bezier(.22,1,.36,1) both',
                }}
              >
                {/* ── Deep-space ambient glows ── */}
                <div style={{ position:'absolute', top:-60, right:-60, width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,158,11,.1) 0%,transparent 65%)', animation:'nfu-glow-breathe 6s ease-in-out infinite', pointerEvents:'none' }} />
                <div style={{ position:'absolute', bottom:-80, left:-60, width:360, height:240, borderRadius:'50%', background:'radial-gradient(circle,rgba(245,158,11,.07) 0%,transparent 65%)', animation:'nfu-glow-breathe 7s ease-in-out 1s infinite', pointerEvents:'none' }} />
                <div style={{ position:'absolute', top:'30%', left:'30%', width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,.06) 0%,transparent 70%)', animation:'nfu-glow-breathe 8s ease-in-out 2s infinite', pointerEvents:'none' }} />

                {/* ── Twinkling stars ── */}
                {NIGHT_STARS.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      top: s.top, left: s.left,
                      width: s.w, height: s.w,
                      borderRadius: '50%',
                      background: i % 3 === 0 ? '#fcd34d' : i % 3 === 1 ? '#e0e7ff' : '#fbcfe8',
                      boxShadow: `0 0 ${s.w * 2}px ${s.w}px ${i % 3 === 0 ? 'rgba(252,211,77,.6)' : 'rgba(224,231,255,.4)'}`,
                      animation: `nfu-twinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
                      pointerEvents: 'none',
                    }}
                  />
                ))}

                {/* ── Shooting stars ── */}
                <div style={{ position:'absolute', top:'18%', left:'5%', height:1.5, background:'linear-gradient(to right,transparent,rgba(252,211,77,.9),transparent)', pointerEvents:'none', borderRadius:2 }} className="nfu-shooting" />
                <div style={{ position:'absolute', top:'28%', left:'55%', height:1.5, background:'linear-gradient(to right,transparent,rgba(224,231,255,.8),transparent)', pointerEvents:'none', borderRadius:2 }} className="nfu-shooting-2" />

                {/* ── Moon glow (top-right) ── */}
                <div style={{ position:'absolute', top:16, right:28, width:48, height:48, borderRadius:'50%', background:'radial-gradient(circle,rgba(253,230,138,.25) 0%,rgba(253,230,138,.05) 60%,transparent 80%)', boxShadow:'0 0 24px 8px rgba(253,230,138,.12)', animation:'nfu-glow-breathe 4s ease-in-out infinite', pointerEvents:'none' }} />
                <div style={{ position:'absolute', top:22, right:34, width:26, height:26, borderRadius:'50%', background:'radial-gradient(circle,rgba(253,230,138,.5) 0%,rgba(253,230,138,.1) 80%)', pointerEvents:'none' }} />

                {/* ── Dawn horizon glow ── */}
                <div style={{ position:'absolute', bottom:0, left:0, right:0, height:90, background:'linear-gradient(to top,rgba(245,158,11,.22),rgba(245,158,11,.06),transparent)', animation:'nfu-dawn 5s ease-in-out infinite', pointerEvents:'none' }} />
                <div style={{ position:'absolute', bottom:0, left:'15%', right:'15%', height:1, background:'linear-gradient(to right,transparent,rgba(245,158,11,.5),transparent)', pointerEvents:'none' }} />

                {/* ── Floating clock icon ── */}
                <div style={{ position:'relative', marginBottom:32, animation:'nfu-float 4.5s ease-in-out infinite' }}>
                  {/* Ripple rings */}
                  <div style={{ position:'absolute', inset:-16, borderRadius:26, border:'1px solid rgba(245,158,11,.4)', animation:'nfu-ripple 2.8s ease-out infinite 0s' }} />
                  <div style={{ position:'absolute', inset:-16, borderRadius:26, border:'1px solid rgba(245,158,11,.3)', animation:'nfu-ripple 2.8s ease-out infinite .93s' }} />
                  <div style={{ position:'absolute', inset:-16, borderRadius:26, border:'1px solid rgba(245,158,11,.2)', animation:'nfu-ripple 2.8s ease-out infinite 1.86s' }} />
                  {/* Outer orbit ring */}
                  <div style={{ position:'absolute', inset:-8, borderRadius:22, border:'1px dashed rgba(245,158,11,.3)', animation:'nfu-orbit-cw 14s linear infinite' }} />
                  {/* Inner counter-orbit ring */}
                  <div style={{ position:'absolute', inset:6, borderRadius:14, border:'1px dashed rgba(167,139,250,.25)', animation:'nfu-orbit-ccw 9s linear infinite' }} />
                  {/* Icon box */}
                  <div
                    style={{
                      position: 'relative', zIndex: 1,
                      width: 72, height: 72, borderRadius: 20,
                      background: 'linear-gradient(135deg,rgba(245,158,11,.2),rgba(245,158,11,.04))',
                      border: '1px solid rgba(245,158,11,.45)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 0 40px rgba(245,158,11,.25), 0 0 80px rgba(245,158,11,.1), inset 0 0 24px rgba(245,158,11,.06)',
                      animation: 'nfu-scale-in .7s cubic-bezier(.34,1.56,.64,1) .1s both',
                    }}
                  >
                    <Clock
                      style={{
                        width: 34, height: 34,
                        color: '#fbbf24',
                        filter: 'drop-shadow(0 0 10px rgba(251,191,36,.7)) drop-shadow(0 0 3px rgba(251,191,36,1))',
                        animation: 'nfu-orbit-cw 10s linear infinite',
                      }}
                    />
                  </div>
                </div>

                {/* ── Heading ── */}
                <h2
                  style={{
                    position: 'relative', zIndex: 1,
                    fontSize: 22, fontWeight: 700, color: '#f9fafb',
                    marginBottom: 12, letterSpacing: '-.01em',
                    animation: 'nfu-slide-up .6s .2s ease-out both',
                  }}
                >
                  Please come back after{' '}
                  <span style={{ color: '#fbbf24', animation: 'nfu-text-glow 2.5s ease-in-out infinite' }}>6 AM</span>
                </h2>

                {/* ── Body ── */}
                <p
                  style={{
                    position: 'relative', zIndex: 1,
                    fontSize: 14, color: 'rgba(156,163,175,.9)',
                    maxWidth: 340, lineHeight: 1.7, margin: '0 auto 24px',
                    animation: 'nfu-slide-up .6s .38s ease-out both',
                  }}
                >
                  Your personalised digest is being curated overnight.
                  Fresh stories across all your topics will be ready at{' '}
                  <span style={{ color: '#fbbf24', fontWeight: 600, animation: 'nfu-text-glow 2.5s ease-in-out .4s infinite' }}>6:00 AM</span> sharp.
                </p>

                {/* ── Time chips ── */}
                <div
                  style={{
                    position: 'relative', zIndex: 1,
                    display: 'flex', gap: 8,
                    animation: 'nfu-slide-up .6s .52s ease-out both',
                  }}
                >
                  {['12 AM','1 AM','2 AM','3 AM','4 AM','5 AM','6 AM ✦'].map((t, i) => (
                    <div
                      key={t}
                      style={{
                        fontSize: 11, fontWeight: 500,
                        padding: '4px 10px', borderRadius: 20,
                        background: i === 6 ? 'rgba(245,158,11,.18)' : 'rgba(255,255,255,.04)',
                        border: `1px solid ${i === 6 ? 'rgba(245,158,11,.45)' : 'rgba(255,255,255,.07)'}`,
                        color: i === 6 ? '#fbbf24' : 'rgba(156,163,175,.5)',
                        boxShadow: i === 6 ? '0 0 12px rgba(245,158,11,.2)' : 'none',
                        transition: 'all .3s',
                      }}
                    >
                      {t}
                    </div>
                  ))}
                </div>

              </div>
            </>
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
