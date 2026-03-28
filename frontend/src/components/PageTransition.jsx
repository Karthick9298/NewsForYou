import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * PageTransition wraps all routes and provides:
 *  - NProgress-style top loading bar on every route change
 *  - Fade-in page animation
 */
function PageTransition({ children }) {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setFading(false);
    setProgress(0);
    setVisible(true);

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

    const tComplete = setTimeout(() => setProgress(100), 1100);
    const tFade     = setTimeout(() => setFading(true),  1250);
    const tHide     = setTimeout(() => setVisible(false), 1600);

    return () => {
      [...timers, tComplete, tFade, tHide].forEach(clearTimeout);
    };
  }, [location.key]);

  return (
    <>
      {visible && (
        <div
          className="loading-bar-track"
          style={{
            opacity: fading ? 0 : 1,
            transition: fading ? 'opacity 350ms ease-out' : 'none',
          }}
        >
          <div
            className="loading-bar-fill"
            style={{
              width: `${progress}%`,
              transition:
                progress === 0
                  ? 'none'
                  : progress === 100
                  ? 'width 100ms ease-in'
                  : 'width 150ms ease-out',
            }}
          />
        </div>
      )}
      <div key={location.key} className="page-enter">
        {children}
      </div>
    </>
  );
}

export default PageTransition;
