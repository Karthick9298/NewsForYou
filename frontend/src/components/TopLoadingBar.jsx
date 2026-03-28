import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * NProgress-style top loading bar.
 * Mounts on every route change, fake-progresses to 95 %, then
 * shoots to 100 % and fades out — giving instant feedback even
 * before the new page renders in production.
 */
export function TopLoadingBar() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Reset to zero immediately (no transition so it snaps back)
    setFading(false);
    setProgress(0);
    setVisible(true);

    // Fake-progress steps: [delay ms, target %]
    const steps = [
      [20,  25],
      [120, 45],
      [280, 62],
      [480, 75],
      [700, 85],
      [950, 92],
    ];

    const timers = steps.map(([delay, val]) =>
      setTimeout(() => setProgress(val), delay)
    );

    // Complete: shoot to 100 %
    const tComplete = setTimeout(() => setProgress(100), 1100);
    // Fade out after reaching 100 %
    const tFade    = setTimeout(() => setFading(true),   1250);
    // Unmount fully
    const tHide    = setTimeout(() => setVisible(false), 1600);

    return () => {
      [...timers, tComplete, tFade, tHide].forEach(clearTimeout);
    };
  }, [location.key]);

  if (!visible) return null;

  return (
    <div
      className="loading-bar-track"
      style={{ opacity: fading ? 0 : 1, transition: fading ? 'opacity 350ms ease-out' : 'none' }}
    >
      <div
        className="loading-bar-fill"
        style={{
          width: `${progress}%`,
          // snap to 0 instantly, then ease for all other moves
          transition: progress === 0
            ? 'none'
            : progress === 100
              ? 'width 180ms ease-in'
              : 'width 220ms ease-out',
        }}
      />
    </div>
  );
}
