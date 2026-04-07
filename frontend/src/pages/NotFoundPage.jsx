import { useNavigate } from 'react-router-dom';

/* ── tiny star field generated once ── */
const STARS = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() * 2.5 + 0.5,
  opacity: Math.random() * 0.7 + 0.3,
  duration: Math.random() * 3 + 2,
  delay: Math.random() * 4,
}));

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a1a] flex flex-col items-center justify-center select-none">

      {/* ── star field ── */}
      {STARS.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
            animation: `twinkle ${s.duration}s ${s.delay}s ease-in-out infinite alternate`,
          }}
        />
      ))}

      {/* ── main card ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">

        {/* headline */}
        <p className="text-white/70 text-lg font-medium tracking-widest uppercase mb-2">
          Houston, we have a problem.
        </p>

        {/* giant 404 */}
        <h1
          className="font-extrabold leading-none"
          style={{
            fontSize: 'clamp(6rem, 20vw, 14rem)',
            color: '#ffffff',
            textShadow: '0 0 60px rgba(255,165,0,0.25)',
          }}
        >
          404
        </h1>

        {/* subtitle */}
        <p
          className="text-2xl md:text-3xl font-bold mt-[-0.5rem] mb-2"
          style={{ color: '#f5a623' }}
        >
          Page not found
        </p>

        <p className="text-white/40 text-sm mb-8 tracking-wide">
          The page you're looking for drifted into deep space.
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate('/', { replace: true })}
          className="flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #f5a623 0%, #e08c10 100%)',
            color: '#0a0a1a',
            boxShadow: '0 4px 24px rgba(245,166,35,0.4)',
          }}
        >
          Take me home
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* ── astronaut illustration ── */}
      <div
        className="absolute right-[5%] bottom-[8%] z-10"
        style={{ animation: 'float 5s ease-in-out infinite' }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 220"
          className="w-40 md:w-56 lg:w-64 drop-shadow-2xl"
        >
          {/* planet / moon */}
          <ellipse cx="110" cy="195" rx="85" ry="22" fill="#f5a623" opacity="0.9" />
          <ellipse cx="110" cy="189" rx="85" ry="22" fill="#e08c10" />

          {/* suit body */}
          <rect x="72" y="110" width="56" height="60" rx="22" fill="#d0d8e8" />

          {/* helmet */}
          <circle cx="100" cy="95" r="32" fill="#c8d2e2" />
          <circle cx="100" cy="95" r="24" fill="#1a2236" />
          {/* visor shine */}
          <ellipse cx="92" cy="87" rx="7" ry="5" fill="white" opacity="0.25" transform="rotate(-20 92 87)" />

          {/* left arm */}
          <rect x="48" y="118" width="26" height="14" rx="7" fill="#c0c9d9" />
          <circle cx="42" cy="125" r="9" fill="#b0bac8" />

          {/* right arm – holding laptop */}
          <rect x="126" y="118" width="26" height="14" rx="7" fill="#c0c9d9" />
          <circle cx="158" cy="125" r="9" fill="#b0bac8" />

          {/* laptop */}
          <rect x="148" y="112" width="30" height="20" rx="3" fill="#2d3a50" />
          <rect x="150" y="114" width="26" height="16" rx="2" fill="#3b4f6e" />
          {/* screen glow */}
          <rect x="152" y="116" width="22" height="12" rx="1" fill="#4fa3e0" opacity="0.6" />
          {/* base */}
          <rect x="145" y="132" width="36" height="4" rx="2" fill="#2d3a50" />

          {/* legs */}
          <rect x="78" y="165" width="18" height="22" rx="8" fill="#b0bac8" />
          <rect x="104" y="165" width="18" height="22" rx="8" fill="#b0bac8" />

          {/* boots */}
          <ellipse cx="87" cy="188" rx="12" ry="7" fill="#8a929e" />
          <ellipse cx="113" cy="188" rx="12" ry="7" fill="#8a929e" />

          {/* suit detail – chest label */}
          <rect x="88" y="128" width="24" height="14" rx="4" fill="#4fa3e0" opacity="0.5" />
        </svg>
      </div>

      {/* ── keyframe styles ── */}
      <style>{`
        @keyframes twinkle {
          from { opacity: var(--tw-opacity, 0.3); transform: scale(1); }
          to   { opacity: 1; transform: scale(1.4); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50%       { transform: translateY(-18px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
}
