import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Newspaper } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import nfuLogo from '@/assets/NFU_logo.png';

const CONTENT = {
  login: {
    eyebrow: 'Your Daily Digest',
    heading: (
      <>
        Your world,<br />
        <span className="text-primary">curated</span> daily.
      </>
    ),
    subtitle: 'Get a hand-picked digest of what matters most — delivered to your inbox at the exact time you choose.',
    features: [
      { icon: Sparkles,    text: 'AI-curated from thousands of sources' },
      { icon: ShieldCheck, text: 'No password. Secure OTP login.' },
      { icon: Newspaper,   text: 'One clean digest. Zero noise.' },
    ],
    testimonial: {
      quote: '"The best newsletter I\'ve ever subscribed to."',
      author: '— Early beta user',
    },
  },
  register: {
    eyebrow: 'Join NewsForYou',
    heading: (
      <>
        News that fits<br />
        <span className="text-primary">your life.</span>
      </>
    ),
    subtitle: 'Set up your personalised digest in under a minute. Pick your topics, choose your time — done.',
    features: [
      { icon: Sparkles,    text: 'AI picks stories you actually care about' },
      { icon: ShieldCheck, text: 'Secure OTP — no password to remember' },
      { icon: Newspaper,   text: 'One digest, every day, perfectly timed' },
    ],
    testimonial: {
      quote: '"Setup took 30 seconds. The digest is brilliant."',
      author: '— Beta user, March 2026',
    },
  },
};

/**
 * AuthLeftPanel — decorative left column shared by LoginPage and RegisterPage.
 *
 * @param {'login' | 'register'} variant - Controls the copy shown in the panel.
 */
function AuthLeftPanel({ variant = 'login' }) {
  const { user } = useAuth();
  const { eyebrow, heading, subtitle, features, testimonial } = CONTENT[variant];

  return (
    <div className="hidden lg:flex lg:w-[46%] bg-[#0a0a0a] relative overflow-hidden flex-col justify-between p-10 xl:p-14">
      {/* Ambient glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-amber-600/15 blur-[100px] pointer-events-none" />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Logo */}
      <div className="relative z-10">
        <Link to={user ? '/dashboard' : '/'}>
          <img src={nfuLogo} alt="NewsForYou" className="h-16 w-auto" />
        </Link>
      </div>

      {/* Copy */}
      <div className="relative z-10 space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
            {eyebrow}
          </p>
          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight font-serif">
            {heading}
          </h2>
          <p className="mt-4 text-[#9ca3af] leading-relaxed text-sm xl:text-base">
            {subtitle}
          </p>
        </div>

        <div className="space-y-3">
          {features.map(({ icon: Icon, text }) => (
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
        <p className="text-sm text-[#9ca3af] italic">{testimonial.quote}</p>
        <p className="text-xs text-[#6b7280] mt-1">{testimonial.author}</p>
      </div>
    </div>
  );
}

export default AuthLeftPanel;
