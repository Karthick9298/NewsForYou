import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Mail, ArrowRight, Loader2, ChevronLeft, Check,
  Briefcase, Trophy, Clapperboard, Cpu, HeartPulse,
  FlaskConical, Sun, Moon, ShieldCheck, Newspaper, Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import nfuLogo from '@/assets/NFU_logo.png';

const STEP = { EMAIL: 1, OTP: 2, INTERESTS: 3, NOTIFICATION: 4 };
const STEP_LABELS = ['Email', 'Verify', 'Topics', 'Schedule'];

// NewsAPI supports exactly these 7 categories
const ALL_INTERESTS = [
  { id: 'business',      label: 'Business',      icon: Briefcase,    color: 'from-blue-500/20 to-blue-500/5',     iconColor: 'text-blue-400',   border: 'border-blue-500/40' },
  { id: 'sports',        label: 'Sports',        icon: Trophy,       color: 'from-green-500/20 to-green-500/5',   iconColor: 'text-green-400',  border: 'border-green-500/40' },
  { id: 'entertainment', label: 'Entertainment', icon: Clapperboard, color: 'from-pink-500/20 to-pink-500/5',     iconColor: 'text-pink-400',   border: 'border-pink-500/40' },
  { id: 'technology',    label: 'Technology',    icon: Cpu,          color: 'from-cyan-500/20 to-cyan-500/5',     iconColor: 'text-cyan-400',   border: 'border-cyan-500/40' },
  { id: 'health',        label: 'Health',        icon: HeartPulse,   color: 'from-red-500/20 to-red-500/5',       iconColor: 'text-red-400',    border: 'border-red-500/40' },
  { id: 'science',       label: 'Science',       icon: FlaskConical, color: 'from-violet-500/20 to-violet-500/5', iconColor: 'text-violet-400', border: 'border-violet-500/40' },
  { id: 'general',       label: 'General',       icon: Newspaper,    color: 'from-amber-500/20 to-amber-500/5',   iconColor: 'text-amber-400',  border: 'border-amber-500/40' },
];

const NOTIFICATION_OPTIONS = [
  {
    id: 'morning',
    label: 'Morning Digest',
    time: '6:00 AM',
    description: 'Start your day informed — fresh stories delivered at dawn.',
    icon: Sun,
    activeBg: 'bg-gradient-to-br from-amber-500/15 to-orange-500/5',
    activeBorder: 'border-amber-500/50',
    activeIcon: 'text-amber-400',
    iconBg: 'bg-amber-500/15',
    glow: 'shadow-amber-500/10',
  },
  {
    id: 'night',
    label: 'Night Recap',
    time: '9:00 PM',
    description: "Wind down with the day's biggest stories before bed.",
    icon: Moon,
    activeBg: 'bg-gradient-to-br from-indigo-500/15 to-purple-500/5',
    activeBorder: 'border-indigo-500/50',
    activeIcon: 'text-indigo-400',
    iconBg: 'bg-indigo-500/15',
    glow: 'shadow-indigo-500/10',
  },
];

/* ── OTP boxes (same as LoginPage) ──────────────────────────────────────────── */
function OTPInput({ value, onChange }) {
  const inputsRef = useRef([]);
  const digits = value.padEnd(6, ' ').split('').slice(0, 6);

  function handleKey(e, idx) {
    if (e.key === 'Backspace') {
      const newVal = value.slice(0, idx === value.length ? value.length - 1 : idx);
      onChange(newVal);
      if (idx > 0) inputsRef.current[idx - 1]?.focus();
      return;
    }
    if (e.key === 'ArrowLeft' && idx > 0) { inputsRef.current[idx - 1]?.focus(); return; }
    if (e.key === 'ArrowRight' && idx < 5) { inputsRef.current[idx + 1]?.focus(); return; }
  }

  function handleChange(e, idx) {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    if (!char) return;
    const arr = value.padEnd(6, ' ').split('').slice(0, 6);
    arr[idx] = char;
    const newVal = arr.join('').trimEnd().slice(0, 6);
    onChange(newVal);
    if (idx < 5) inputsRef.current[idx + 1]?.focus();
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted);
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
  }

  return (
    <div className="flex gap-2 sm:gap-3 justify-center">
      {Array.from({ length: 6 }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => { inputsRef.current[idx] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[idx]?.trim() || ''}
          autoFocus={idx === 0}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKey(e, idx)}
          onPaste={handlePaste}
          className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-xl font-bold font-mono rounded-xl border-2 bg-background/60 text-foreground outline-none transition-all duration-150
            focus:border-primary focus:bg-primary/5 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.15)]
            ${digits[idx]?.trim() ? 'border-primary/60 bg-primary/5' : 'border-border hover:border-border/80'}`}
        />
      ))}
    </div>
  );
}

/* ── Step progress bar ───────────────────────────────────────────────────────── */
function StepBar({ current }) {
  return (
    <div className="flex items-start mb-10">
      {STEP_LABELS.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current;
        return (
          <div key={n} className="flex items-start flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300
                ${done
                  ? 'bg-primary border-primary text-primary-foreground shadow-md shadow-primary/30'
                  : active
                    ? 'bg-primary border-primary text-primary-foreground shadow-[0_0_12px_3px_rgba(245,158,11,0.3)]'
                    : 'bg-background border-border text-muted-foreground'}`}>
                {done ? <Check className="w-3.5 h-3.5" /> : n}
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap transition-colors
                ${active ? 'text-primary' : done ? 'text-primary/70' : 'text-muted-foreground'}`}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`flex-1 h-px mt-4 mx-1 transition-colors duration-500 ${n < current ? 'bg-primary' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Left decorative panel ───────────────────────────────────────────────────── */
function LeftPanel() {
  const { user } = useAuth();
  return (
    <div className="hidden lg:flex lg:w-[46%] bg-[#0a0a0a] relative overflow-hidden flex-col justify-between p-10 xl:p-14">
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-amber-600/15 blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10">
        <Link to={user ? '/dashboard' : '/'}>
          <img src={nfuLogo} alt="NewsForYou" className="h-16 w-auto" />
        </Link>
      </div>

      <div className="relative z-10 space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">Join NewsForYou</p>
          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight font-serif">
            News that fits<br />
            <span className="text-primary">your life.</span>
          </h2>
          <p className="mt-4 text-[#9ca3af] leading-relaxed text-sm xl:text-base">
            Set up your personalised digest in under a minute. Pick your topics, choose your time — done.
          </p>
        </div>
        <div className="space-y-3">
          {[
            { icon: Sparkles, text: 'AI picks stories you actually care about' },
            { icon: ShieldCheck, text: 'Secure OTP — no password to remember' },
            { icon: Newspaper, text: 'One digest, every day, perfectly timed' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm text-[#d1d5db]">{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 border-l-2 border-primary/40 pl-4">
        <p className="text-sm text-[#9ca3af] italic">"Setup took 30 seconds. The digest is brilliant."</p>
        <p className="text-xs text-[#6b7280] mt-1">— Beta user, March 2026</p>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useAuth();

  const [step, setStep] = useState(STEP.EMAIL);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [notificationTime, setNotificationTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (location.state?.fromOTP && location.state?.email) {
      setEmail(location.state.email);
      setStep(STEP.INTERESTS);
    }
  }, []);

  function startCooldown() {
    setResendCooldown(60);
    const t = setInterval(() => setResendCooldown((p) => { if (p <= 1) { clearInterval(t); return 0; } return p - 1; }), 1000);
  }

  async function handleSendOTP(e) {
    e.preventDefault();
    setError('');
    if (!email.trim()) return setError('Please enter your email address.');
    setIsLoading(true);
    try { await api.post('/api/auth/send-otp', { email: email.trim() }); setStep(STEP.OTP); startCooldown(); }
    catch (err) { setError(err.message); }
    finally { setIsLoading(false); }
  }

  async function handleVerifyOTP(e) {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) return setError('Please enter all 6 digits.');
    setIsLoading(true);
    try {
      const data = await api.post('/api/auth/verify-otp', { email: email.trim(), otp });
      setUser(data.user);
      if (data.user.isRegistered) { navigate('/dashboard', { replace: true }); return; }
      setStep(STEP.INTERESTS);
    } catch (err) { setError(err.message); }
    finally { setIsLoading(false); }
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    try { await api.post('/api/auth/send-otp', { email: email.trim() }); setOtp(''); startCooldown(); }
    catch (err) { setError(err.message); }
    finally { setIsLoading(false); }
  }

  function toggleInterest(id) {
    setSelectedInterests((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }

  async function handleSaveInterests(e) {
    e.preventDefault();
    setError('');
    if (selectedInterests.length < 1) return setError('Please select at least 1 interest.');
    setIsLoading(true);
    try { await api.post('/api/auth/register/interests', { interests: selectedInterests }); setStep(STEP.NOTIFICATION); }
    catch (err) { setError(err.message); }
    finally { setIsLoading(false); }
  }

  async function handleSaveNotification(e) {
    e.preventDefault();
    setError('');
    if (!notificationTime) return setError('Please pick a delivery time.');
    setIsLoading(true);
    try {
      const data = await api.post('/api/auth/register/notification', { notificationTime });
      setUser(data.user);
      navigate('/dashboard', { replace: true });
    } catch (err) { setError(err.message); }
    finally { setIsLoading(false); }
  }

  const ErrorBanner = ({ msg }) => msg ? (
    <div className="flex items-start gap-2.5 text-sm bg-destructive/10 border border-destructive/25 text-destructive-foreground rounded-xl px-3.5 py-3">
      <span className="text-base leading-none mt-px">⚠</span>
      <span className="leading-snug">{msg}</span>
    </div>
  ) : null;

  return (
    <div className="min-h-screen flex bg-background">
      <LeftPanel />

      {/* ── Right panel ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-border/40 shrink-0">
          <Link to={user ? '/dashboard' : '/'} className="lg:hidden">
            <img src={nfuLogo} alt="NewsForYou" className="h-12 w-auto" />
          </Link>
          <span className="hidden lg:block" />
          <p className="text-sm text-muted-foreground">
            Have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">Sign in</Link>
          </p>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10">
          <div className="w-full max-w-[460px]">
            <StepBar current={step} />

            {/* ── Step 1: Email ──────────────────────────────────────────── */}
            {step === STEP.EMAIL && (
              <div key="s1">
                <div className="mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/25 to-primary/5 border border-primary/20 flex items-center justify-center mb-5 shadow-lg shadow-primary/10">
                    <Mail className="w-7 h-7 text-primary" />
                  </div>
                  <h1 className="text-[1.75rem] font-bold text-foreground leading-tight tracking-tight">Create your account</h1>
                  <p className="text-muted-foreground text-sm mt-2 leading-relaxed">Start with your email — we'll send a verification code instantly.</p>
                </div>
                <form onSubmit={handleSendOTP} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="text-sm font-medium">Email address</Label>
                    <Input
                      id="reg-email" type="email" placeholder="you@example.com"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email" autoFocus required
                      className="h-12 text-sm rounded-xl border-border/80 focus-visible:ring-primary/30 bg-background/50"
                    />
                  </div>
                  <ErrorBanner msg={error} />
                  <Button type="submit" className="w-full h-12 gap-2 font-semibold rounded-xl text-sm" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send code <ArrowRight className="w-4 h-4" /></>}
                  </Button>
                </form>
              </div>
            )}

            {/* ── Step 2: OTP ────────────────────────────────────────────── */}
            {step === STEP.OTP && (
              <div key="s2">
                <button onClick={() => { setStep(STEP.EMAIL); setError(''); setOtp(''); }}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group">
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back
                </button>
                <div className="mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/25 to-primary/5 border border-primary/20 flex items-center justify-center mb-5 shadow-lg shadow-primary/10">
                    <ShieldCheck className="w-7 h-7 text-primary" />
                  </div>
                  <h1 className="text-[1.75rem] font-bold text-foreground leading-tight tracking-tight">Verify your email</h1>
                  <p className="text-muted-foreground text-sm mt-2">We sent a 6-digit code to</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5 truncate">{email}</p>
                </div>
                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium block text-center">Enter your code</Label>
                    <OTPInput value={otp} onChange={setOtp} />
                  </div>
                  <ErrorBanner msg={error} />
                  <Button type="submit" className="w-full h-12 gap-2 font-semibold rounded-xl text-sm" disabled={isLoading || otp.length !== 6}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Verify &amp; continue <ArrowRight className="w-4 h-4" /></>}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Didn't receive it?{' '}
                    <button type="button" onClick={handleResend} disabled={resendCooldown > 0}
                      className="font-semibold text-primary hover:text-primary/80 transition-colors disabled:text-muted-foreground disabled:cursor-default">
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                    </button>
                  </p>
                </form>
              </div>
            )}

            {/* ── Step 3: Interests ──────────────────────────────────────── */}
            {step === STEP.INTERESTS && (
              <div key="s3">
                <div className="mb-7">
                  <h1 className="text-[1.75rem] font-bold text-foreground leading-tight tracking-tight">What interests you?</h1>
                  <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                    Choose <span className="text-primary font-semibold">1–4 topics</span> and we'll curate your digest around them.
                  </p>
                  {/* Selection counter */}
                  <div className="flex gap-1 mt-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < selectedInterests.length ? 'bg-primary' : 'bg-border'}`} />
                    ))}
                  </div>
                </div>
                <form onSubmit={handleSaveInterests} className="space-y-5">
                  <div className="grid grid-cols-2 gap-2.5">
                    {ALL_INTERESTS.map(({ id, label, icon: Icon, color, iconColor, border }) => {
                      const isSelected = selectedInterests.includes(id);
                      const isDisabled = !isSelected && selectedInterests.length >= 4;
                      return (
                        <button key={id} type="button" disabled={isDisabled}
                          onClick={() => toggleInterest(id)}
                          className={`relative flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200
                            ${isSelected ? `bg-gradient-to-br ${color} ${border} border` : 'border-border/60 bg-background/40 hover:border-border hover:bg-background/80'}
                            ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}>
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
                  <ErrorBanner msg={error} />
                  <Button type="submit" className="w-full h-12 gap-2 font-semibold rounded-xl text-sm" disabled={isLoading || selectedInterests.length < 1}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Continue <ArrowRight className="w-4 h-4" /></>}
                  </Button>
                </form>
              </div>
            )}

            {/* ── Step 4: Notification time ──────────────────────────────── */}
            {step === STEP.NOTIFICATION && (
              <div key="s4">
                <button onClick={() => { setStep(STEP.INTERESTS); setError(''); }}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group">
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back
                </button>
                <div className="mb-7">
                  <h1 className="text-[1.75rem] font-bold text-foreground leading-tight tracking-tight">When should we send it?</h1>
                  <p className="text-muted-foreground text-sm mt-2 leading-relaxed">Pick the time your daily digest lands in your inbox.</p>
                </div>
                <form onSubmit={handleSaveNotification} className="space-y-5">
                  <div className="grid gap-3">
                    {NOTIFICATION_OPTIONS.map(({ id, label, time, description, icon: Icon, activeBg, activeBorder, activeIcon, iconBg, glow }) => {
                      const sel = notificationTime === id;
                      return (
                        <button key={id} type="button" onClick={() => setNotificationTime(id)}
                          className={`relative flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200
                            ${sel ? `${activeBg} ${activeBorder} shadow-xl ${glow}` : 'border-border/60 bg-background/40 hover:border-border hover:bg-background/70'}`}>
                          {/* Radio indicator */}
                          <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                            ${sel ? 'border-primary bg-primary shadow-md shadow-primary/30' : 'border-border bg-background'}`}>
                            {sel && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                          </div>

                          {/* Icon */}
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-all
                            ${sel ? iconBg : 'bg-muted'}`}>
                            <Icon className={`w-7 h-7 transition-colors ${sel ? activeIcon : 'text-muted-foreground'}`} />
                          </div>

                          {/* Text */}
                          <div className="flex-1 pr-6">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="font-bold text-foreground text-base">{label}</span>
                              <span className={`text-sm font-mono font-bold transition-colors ${sel ? activeIcon : 'text-muted-foreground'}`}>{time}</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-snug">{description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <ErrorBanner msg={error} />
                  <Button type="submit" className="w-full h-12 gap-2 font-semibold rounded-xl text-sm" disabled={isLoading || !notificationTime}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Complete setup <ArrowRight className="w-4 h-4" /></>}
                  </Button>
                </form>
              </div>
            )}

            <p className="text-center text-xs text-muted-foreground mt-10 leading-relaxed">
              By continuing, you agree to our{' '}
              <a href="#" className="underline underline-offset-2 hover:text-foreground transition-colors">Terms</a>
              {' '}&amp;{' '}
              <a href="#" className="underline underline-offset-2 hover:text-foreground transition-colors">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;