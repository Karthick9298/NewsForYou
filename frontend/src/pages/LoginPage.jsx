import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight, Loader2, ChevronLeft, Newspaper, Sparkles, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import nfuLogo from '@/assets/NFU_logo.png';
import OTPInput from '@/components/OTPInput';

const STEP = { EMAIL: 'email', OTP: 'otp' };

/* ── Left decorative panel ───────────────────────────────────────────────────── */
function LeftPanel() {
  const { user } = useAuth();
  return (
    <div className="hidden lg:flex lg:w-[46%] bg-[#0a0a0a] relative overflow-hidden flex-col justify-between p-10 xl:p-14">
      {/* Ambient glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-amber-600/15 blur-[100px] pointer-events-none" />
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.035]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Logo */}
      <div className="relative z-10">
        <Link to={user ? '/dashboard' : '/'}>
          <img src={nfuLogo} alt="NewsForYou" className="h-16 w-auto" />
        </Link>
      </div>

      {/* Main copy */}
      <div className="relative z-10 space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">Your Daily Digest</p>
          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight font-serif">
            Your world,<br />
            <span className="text-primary">curated</span> daily.
          </h2>
          <p className="mt-4 text-[#9ca3af] leading-relaxed text-sm xl:text-base">
            Get a hand-picked digest of what matters most — delivered to your inbox at the exact time you choose.
          </p>
        </div>
        <div className="space-y-3">
          {[
            { icon: Sparkles, text: 'AI-curated from thousands of sources' },
            { icon: ShieldCheck, text: 'No password. Secure OTP login.' },
            { icon: Newspaper, text: 'One clean digest. Zero noise.' },
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

      {/* Testimonial */}
      <div className="relative z-10 border-l-2 border-primary/40 pl-4">
        <p className="text-sm text-[#9ca3af] italic">"The best newsletter I've ever subscribed to."</p>
        <p className="text-xs text-[#6b7280] mt-1">— Early beta user</p>
      </div>
    </div>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [step, setStep] = useState(STEP.EMAIL);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  async function handleSendOTP(e) {
    e.preventDefault();
    setError('');
    if (!email.trim()) return setError('Please enter your email address.');
    setIsLoading(true);
    try {
      await api.post('/api/auth/send-otp', { email: email.trim() });
      setStep(STEP.OTP);
      startCooldown();
    } catch (err) { setError(err.message); }
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
      if (data.user.isRegistered) navigate('/dashboard', { replace: true });
      else navigate('/register', { replace: true, state: { fromOTP: true, email: data.user.email } });
    } catch (err) { setError(err.message); }
    finally { setIsLoading(false); }
  }

  function startCooldown() {
    setResendCooldown(60);
    const t = setInterval(() => setResendCooldown((p) => { if (p <= 1) { clearInterval(t); return 0; } return p - 1; }), 1000);
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    try { await api.post('/api/auth/send-otp', { email: email.trim() }); setOtp(''); startCooldown(); }
    catch (err) { setError(err.message); }
    finally { setIsLoading(false); }
  }

  return (
    <div className="min-h-screen flex bg-background">
      <LeftPanel />

      {/* ── Right panel ───────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-5 border-b border-border/40">
          <Link to={user ? '/dashboard' : '/'} className="lg:hidden">
            <img src={nfuLogo} alt="NewsForYou" className="h-12 w-auto" />
          </Link>
          <span className="hidden lg:block" />
          <p className="text-sm text-muted-foreground">
            No account?{' '}
            <Link to="/register" className="text-primary hover:text-primary/80 font-semibold transition-colors">
              Sign up free
            </Link>
          </p>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10">
          <div className="w-full max-w-[400px]">

            {/* Step dots */}
            <div className="flex items-center mb-10">
              {['Email', 'Verify'].map((label, i) => {
                const isActive = (i === 0 && step === STEP.EMAIL) || (i === 1 && step === STEP.OTP);
                const isDone = i === 0 && step === STEP.OTP;
                return (
                  <div key={label} className="flex items-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`w-3 h-3 rounded-full transition-all duration-300
                        ${isDone ? 'bg-primary' : isActive ? 'bg-primary shadow-[0_0_10px_3px_rgba(245,158,11,0.35)]' : 'bg-border'}`} />
                      <span className={`text-[10px] font-semibold uppercase tracking-wide transition-colors
                        ${isActive || isDone ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
                    </div>
                    {i === 0 && (
                      <div className={`w-20 h-px mx-3 mb-4 transition-colors duration-500 ${step === STEP.OTP ? 'bg-primary' : 'bg-border'}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Step 1: Email ──────────────────────────────────────────── */}
            {step === STEP.EMAIL && (
              <div key="email-step">
                <div className="mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/25 to-primary/5 border border-primary/20 flex items-center justify-center mb-5 shadow-lg shadow-primary/10">
                    <Mail className="w-7 h-7 text-primary" />
                  </div>
                  <h1 className="text-[1.75rem] font-bold text-foreground leading-tight tracking-tight">Welcome back</h1>
                  <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                    Enter your email and we'll send a one-time verification code.
                  </p>
                </div>

                <form onSubmit={handleSendOTP} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-sm font-medium">Email address</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      autoFocus
                      required
                      className="h-12 text-sm rounded-xl border-border/80 focus-visible:ring-primary/30 bg-background/50"
                    />
                  </div>

                  {error && (
                    <div className="flex items-start gap-2.5 text-sm bg-destructive/10 border border-destructive/25 text-destructive-foreground rounded-xl px-3.5 py-3">
                      <span className="text-base leading-none mt-px">⚠</span>
                      <span className="leading-snug">{error}</span>
                    </div>
                  )}

                  <Button type="submit" className="w-full h-12 gap-2 font-semibold rounded-xl text-sm" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Continue <ArrowRight className="w-4 h-4" /></>}
                  </Button>
                </form>
              </div>
            )}

            {/* ── Step 2: OTP ────────────────────────────────────────────── */}
            {step === STEP.OTP && (
              <div key="otp-step">
                <button
                  onClick={() => { setStep(STEP.EMAIL); setError(''); setOtp(''); }}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group"
                >
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  Back
                </button>

                <div className="mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/25 to-primary/5 border border-primary/20 flex items-center justify-center mb-5 shadow-lg shadow-primary/10">
                    <ShieldCheck className="w-7 h-7 text-primary" />
                  </div>
                  <h1 className="text-[1.75rem] font-bold text-foreground leading-tight tracking-tight">Check your inbox</h1>
                  <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                    We sent a 6-digit code to
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-0.5 truncate">{email}</p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium block text-center">Enter your code</Label>
                    <OTPInput value={otp} onChange={setOtp} />
                  </div>

                  {error && (
                    <div className="flex items-start gap-2.5 text-sm bg-destructive/10 border border-destructive/25 text-destructive-foreground rounded-xl px-3.5 py-3">
                      <span className="text-base leading-none mt-px">⚠</span>
                      <span className="leading-snug">{error}</span>
                    </div>
                  )}

                  <Button type="submit" className="w-full h-12 gap-2 font-semibold rounded-xl text-sm" disabled={isLoading || otp.length !== 6}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Verify &amp; Sign In <ArrowRight className="w-4 h-4" /></>}
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

export default LoginPage;
