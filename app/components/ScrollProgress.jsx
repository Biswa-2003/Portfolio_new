// app/components/ScrollProgress.jsx
'use client';
import { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      if (!barRef.current) return;
      const el = document.scrollingElement || document.documentElement;
      const max = el.scrollHeight - el.clientHeight || 1;
      const p = el.scrollTop / max; // 0..1
      barRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    // run once and bind listeners
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <>
      <div ref={barRef} className="scroll-progress" aria-hidden="true" />
      <style jsx>{`
        .scroll-progress {
          position: fixed;
          top: 0; left: 0;
          height: 3px;
          width: 100%;
          transform-origin: 0 50%;
          transform: scaleX(0);
          background: linear-gradient(90deg, var(--g1, var(--primary)), var(--g2, var(--secondary)), var(--g3, var(--primary)));
          box-shadow: 0 0 12px var(--primary-glow);
          z-index: 9999;
          will-change: transform;
          pointer-events: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .scroll-progress { transition: none !important; }
        }
      `}</style>
    </>
  );
}
