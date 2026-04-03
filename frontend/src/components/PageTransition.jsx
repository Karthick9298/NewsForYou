import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Loader from '@/components/Loader';

/**
 * PageTransition wraps all routes and provides:
 *  - Full-screen Loader overlay on every route change
 *  - Fade-in page animation
 */
function PageTransition({ children }) {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setFading(false);
    setVisible(true);

    const tFade = setTimeout(() => setFading(true), 625);
    const tHide = setTimeout(() => setVisible(false), 800);

    return () => {
      clearTimeout(tFade);
      clearTimeout(tHide);
    };
  }, [location.key]);

  return (
    <>
      {/* ── Full-screen Loader overlay during transition ─────────────── */}
      {visible && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--background)',
            zIndex: 9990,
            overflow: 'hidden',
            opacity: fading ? 0 : 1,
            transition: fading ? 'opacity 350ms ease-out' : 'none',
            pointerEvents: fading ? 'none' : 'all',
          }}
        >
          <Loader />
        </div>
      )}

      <div key={location.key} className="page-enter">
        {children}
      </div>
    </>
  );
}

export default PageTransition;
