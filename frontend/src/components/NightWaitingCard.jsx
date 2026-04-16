import { Clock } from 'lucide-react';

/* Fixed star positions — deterministic so no layout jank on re-render */
const STARS = [
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

const STAR_COLORS = ['#fcd34d', '#e0e7ff', '#fbcfe8'];
const STAR_SHADOW_COLORS = ['rgba(252,211,77,.6)', 'rgba(224,231,255,.4)', 'rgba(224,231,255,.4)'];
const TIME_CHIPS = ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM ✦'];

/**
 * NightWaitingCard — shown on the dashboard when no articles are available yet
 * (i.e. the cron fetch hasn't run today). Animates an ambient night-sky scene
 * with a countdown to the 6 AM digest delivery.
 *
 * All CSS animations live in index.css under the `.nwc-*` namespace.
 */
function NightWaitingCard() {
  return (
    <div className="nwc-container">
      {/* Ambient glows */}
      <div className="nwc-glow-tr" />
      <div className="nwc-glow-bl" />
      <div className="nwc-glow-center" />

      {/* Twinkling stars — positions are data-driven so inline styles are required */}
      {STARS.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: s.top,
            left: s.left,
            width: s.w,
            height: s.w,
            borderRadius: '50%',
            background: STAR_COLORS[i % 3],
            boxShadow: `0 0 ${s.w * 2}px ${s.w}px ${STAR_SHADOW_COLORS[i % 3]}`,
            animation: `nfu-twinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Shooting stars */}
      <div className="nwc-shoot-1" />
      <div className="nwc-shoot-2" />

      {/* Moon */}
      <div className="nwc-moon-glow" />
      <div className="nwc-moon-core" />

      {/* Horizon glow */}
      <div className="nwc-horizon" />
      <div className="nwc-horizon-line" />

      {/* Floating clock icon */}
      <div className="nwc-clock-float">
        <div className="nwc-ripple-1" />
        <div className="nwc-ripple-2" />
        <div className="nwc-ripple-3" />
        <div className="nwc-orbit-outer" />
        <div className="nwc-orbit-inner" />
        <div className="nwc-icon-box">
          <Clock className="nwc-clock-icon" />
        </div>
      </div>

      {/* Heading */}
      <h2 className="nwc-heading">
        Please come back after{' '}
        <span className="nwc-text-glow" style={{ color: '#fbbf24' }}>6 AM</span>
      </h2>

      {/* Body */}
      <p className="nwc-subtext">
        Your personalised digest is being curated overnight. Fresh stories across
        all your topics will be ready at{' '}
        <span className="nwc-text-glow-delayed" style={{ color: '#fbbf24', fontWeight: 600 }}>
          6:00 AM
        </span>{' '}
        sharp.
      </p>

      {/* Time chips */}
      <div className="nwc-chips-row">
        {TIME_CHIPS.map((t, i) => (
          <div key={t} className={`nwc-chip ${i === TIME_CHIPS.length - 1 ? 'nwc-chip-active' : 'nwc-chip-inactive'}`}>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NightWaitingCard;
