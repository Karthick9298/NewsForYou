import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, Trophy, Clapperboard, Cpu, HeartPulse,
  FlaskConical, Landmark, Globe2, Leaf, GraduationCap,
  Sun, Moon, LogOut, Newspaper, Settings, Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import nfuLogo from '@/assets/NFU_logo.png';

const INTEREST_ICONS = {
  Business: Briefcase, Sports: Trophy, Entertainment: Clapperboard,
  Technology: Cpu, Health: HeartPulse, Science: FlaskConical,
  Politics: Landmark, World: Globe2, Lifestyle: Leaf, Education: GraduationCap,
};

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/', { replace: true });
  }

  const digestTime = user?.notificationTime === 'morning' ? '6:00 AM' : '9:00 PM';
  const DigestIcon = user?.notificationTime === 'morning' ? Sun : Moon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">

          {/* Welcome banner */}
          <div className="mb-8 p-6 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}! 👋
            </h1>
            <p className="text-muted-foreground text-sm">
              Welcome to NewsForYou. Your personalised digest is being prepared.
            </p>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {/* Email */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Signed in as</p>
              <p className="text-sm font-semibold text-foreground truncate">{user?.email}</p>
            </div>
            {/* Interests */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Your topics</p>
              <p className="text-sm font-semibold text-foreground">{user?.interests?.length || 0} selected</p>
            </div>
            {/* Digest time */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Daily digest</p>
              <div className="flex items-center gap-2">
                <DigestIcon className="w-4 h-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">{digestTime}</p>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <h2 className="text-base font-semibold text-foreground mb-4">Your Interests</h2>
            <div className="flex flex-wrap gap-3">
              {user?.interests?.length > 0 ? user.interests.map((interest) => {
                const Icon = INTEREST_ICONS[interest] || Newspaper;
                return (
                  <div key={interest} className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary">
                    <Icon className="w-4 h-4" />
                    {interest}
                  </div>
                );
              }) : (
                <p className="text-sm text-muted-foreground">No interests set yet.</p>
              )}
            </div>
          </div>

          {/* Coming soon placeholder */}
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
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
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
