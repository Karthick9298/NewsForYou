import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Loader from '@/components/Loader';

/**
 * PageTransition — full-screen Loader overlay on route change (300ms min),
 * then fades out so the page skeleton / content can show.
 * In-page data loading is handled by each page's own skeleton UI.
 */
function PageTransition({ children }) {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setFading(false);
    setVisible(true);

    const tFade = setTimeout(() => setFading(true), 300);
    const tHide = setTimeout(() => setVisible(false), 475);

    return () => {
      clearTimeout(tFade);
      clearTimeout(tHide);
    };
  }, [location.key]);

  return (
    <>
      {visible && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--background)',
            zIndex: 9990,
            overflow: 'hidden',
            opacity: fading ? 0 : 1,
            transition: fading ? 'opacity 175ms ease-out' : 'none',
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
