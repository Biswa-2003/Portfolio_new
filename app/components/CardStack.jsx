'use client';

import * as React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { SquareArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';

function wrapIndex(n, len) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

/** Minimal signed offset from active index to i, with wrapping (for loop behavior). */
function signedOffset(i, active, len, loop) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

export function CardStack({
  items,
  initialIndex = 0,
  maxVisible = 7,

  cardWidth = 480,
  cardHeight = 360,

  overlap = 0.48,
  spreadDeg = 48,

  perspectivePx = 1100,
  depthPx = 140,
  tiltXDeg = 12,

  activeLiftPx = 22,
  activeScale = 1.03,
  inactiveScale = 0.94,

  springStiffness = 280,
  springDamping = 28,

  loop = true,
  autoAdvance = false,
  intervalMs = 2800,
  pauseOnHover = true,

  showDots = true,
  className,

  onChangeIndex,
  renderCard,
}) {
  const reduceMotion = useReducedMotion();
  const len = items.length;

  const [active, setActive] = React.useState(() => wrapIndex(initialIndex, len));
  const [hovering, setHovering] = React.useState(false);

  React.useEffect(() => {
    setActive((a) => wrapIndex(a, len));
  }, [len]);

  React.useEffect(() => {
    if (!len) return;
    onChangeIndex?.(active, items[active]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2));
  const cardSpacing = Math.max(10, Math.round(cardWidth * (1 - overlap)));
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;

  const canGoPrev = loop || active > 0;
  const canGoNext = loop || active < len - 1;

  const prev = React.useCallback(() => {
    if (!len || !canGoPrev) return;
    setActive((a) => wrapIndex(a - 1, len));
  }, [canGoPrev, len]);

  const next = React.useCallback(() => {
    if (!len || !canGoNext) return;
    setActive((a) => wrapIndex(a + 1, len));
  }, [canGoNext, len]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  };

  React.useEffect(() => {
    if (!autoAdvance || reduceMotion || !len) return;
    if (pauseOnHover && hovering) return;

    const id = window.setInterval(() => {
      if (loop || active < len - 1) next();
    }, Math.max(700, intervalMs));

    return () => window.clearInterval(id);
  }, [autoAdvance, intervalMs, hovering, pauseOnHover, reduceMotion, len, loop, active, next]);

  if (!len) return null;

  const activeItem = items[active];

  return (
    <div
      className={className}
      style={{ width: '100%', overflow: 'hidden' }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        style={{ position: 'relative', width: '100%', height: Math.max(380, cardHeight + 80), overflow: 'hidden' }}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', pointerEvents: 'none', left: 0, right: 0, top: '24px',
            margin: '0 auto', height: '190px', width: '70%', borderRadius: '9999px',
            background: 'var(--secondary-glow)', filter: 'blur(70px)', opacity: 0.5,
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', pointerEvents: 'none', left: 0, right: 0, bottom: 0,
            margin: '0 auto', height: '160px', width: '76%', borderRadius: '9999px',
            background: 'rgba(0,0,0,0.4)', filter: 'blur(70px)',
          }}
        />

        <div
          style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end',
            justifyContent: 'center', perspective: `${perspectivePx}px`,
          }}
        >
          <AnimatePresence initial={false}>
            {items.map((item, i) => {
              const off = signedOffset(i, active, len, loop);
              const abs = Math.abs(off);
              const visible = abs <= maxOffset;
              if (!visible) return null;

              const rotateZ = off * stepDeg;
              const x = off * cardSpacing;
              const y = abs * 10;
              const z = -abs * depthPx;

              const isActive = off === 0;
              const scale = isActive ? activeScale : inactiveScale;
              const lift = isActive ? -activeLiftPx : 0;
              const rotateX = isActive ? 0 : tiltXDeg;
              const zIndex = 100 - abs;

              const dragProps = isActive
                ? {
                    drag: 'x',
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.18,
                    onDragEnd: (_e, info) => {
                      if (reduceMotion) return;
                      const travel = info.offset.x;
                      const v = info.velocity.x;
                      const threshold = Math.min(160, cardWidth * 0.22);
                      if (travel > threshold || v > 650) prev();
                      else if (travel < -threshold || v < -650) next();
                    },
                  }
                : {};

              return (
                <motion.div
                  key={item.id}
                  className="card-stack-card"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    width: cardWidth,
                    height: cardHeight,
                    zIndex,
                    borderRadius: '22px',
                    border: '1px solid var(--glass-border)',
                    overflow: 'hidden',
                    boxShadow: '0 30px 70px -20px rgba(0,0,0,0.6)',
                    willChange: 'transform',
                    userSelect: 'none',
                    cursor: isActive ? 'grab' : 'pointer',
                    transformStyle: 'preserve-3d',
                  }}
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, y: y + 40, x, rotateZ, rotateX, scale }
                  }
                  animate={{ opacity: 1, x, y: y + lift, rotateZ, rotateX, scale }}
                  transition={{ type: 'spring', stiffness: springStiffness, damping: springDamping }}
                  onClick={() => setActive(i)}
                  {...dragProps}
                >
                  <div style={{ height: '100%', width: '100%', transform: `translateZ(${z}px)`, transformStyle: 'preserve-3d' }}>
                    {renderCard ? renderCard(item, { active: isActive }) : <DefaultFanCard item={item} active={isActive} />}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        {/* Floating Side Navigation Chevrons */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 clamp(4px, 2vw, 16px)',
            zIndex: 120,
          }}
        >
          <button
            type="button"
            onClick={prev}
            disabled={!canGoPrev}
            aria-label="Previous Project"
            className="card-stack-nav-btn"
            style={{
              pointerEvents: 'auto',
              width: 'clamp(38px, 9vw, 46px)',
              height: 'clamp(38px, 9vw, 46px)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(10, 7, 22, 0.75)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              color: '#ffffff',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
              cursor: canGoPrev ? 'pointer' : 'not-allowed',
              opacity: canGoPrev ? 1 : 0.35,
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={next}
            disabled={!canGoNext}
            aria-label="Next Project"
            className="card-stack-nav-btn"
            style={{
              pointerEvents: 'auto',
              width: 'clamp(38px, 9vw, 46px)',
              height: 'clamp(38px, 9vw, 46px)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(10, 7, 22, 0.75)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              color: '#ffffff',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
              cursor: canGoNext ? 'pointer' : 'not-allowed',
              opacity: canGoNext ? 1 : 0.35,
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Cybernetic Deck Control HUD */}
      {showDots ? (
        <div
          style={{
            marginTop: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          {/* Controls Bar */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '16px',
              padding: '8px 18px',
              borderRadius: '9999px',
              background: 'rgba(8, 6, 18, 0.8)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
            }}
          >
            {/* System Counter Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'monospace',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--teal)',
                letterSpacing: '0.08em',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--teal)',
                  boxShadow: '0 0 8px var(--teal)',
                }}
              />
              <span>0{active + 1} / 0{len}</span>
            </div>

            <div style={{ width: '1px', height: '14px', background: 'rgba(255, 255, 255, 0.12)' }} />

            {/* Interactive Dot Indicators */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {items.map((it, idx) => {
                const on = idx === active;
                return (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => setActive(idx)}
                    className="card-stack-dot"
                    aria-label={`Go to ${it.title}`}
                    style={{
                      height: '7px',
                      width: on ? '26px' : '7px',
                      borderRadius: '9999px',
                      border: 'none',
                      padding: 0,
                      background: on
                        ? 'linear-gradient(90deg, var(--teal) 0%, var(--violet) 100%)'
                        : 'rgba(255, 255, 255, 0.2)',
                      boxShadow: on ? '0 0 12px var(--teal)' : 'none',
                      transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                      cursor: 'pointer',
                    }}
                  />
                );
              })}
            </div>

            {/* External Repo Quick Link if present */}
            {activeItem?.link ? (
              <>
                <div style={{ width: '1px', height: '14px', background: 'rgba(255, 255, 255, 0.12)' }} />
                <a
                  href={activeItem.link}
                  target="_blank"
                  rel="noreferrer"
                  className="card-stack-link"
                  aria-label="Open project repository"
                  style={{
                    color: 'var(--muted)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.2s ease, transform 0.2s ease',
                  }}
                >
                  <SquareArrowOutUpRight size={15} />
                </a>
              </>
            ) : null}
          </div>

          {/* Cyber Hint Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.72rem',
              color: '#64748b',
              fontFamily: 'monospace',
              letterSpacing: '0.06em',
            }}
          >
            <span
              style={{
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
              }}
            >
              &larr; &rarr;
            </span>
            <span>USE ARROW KEYS OR SWIPE TO ROTATE DECK</span>
          </div>
        </div>
      ) : null}

      <style>{`
        .card-stack-nav-btn:hover:not(:disabled) {
          background: rgba(56, 189, 248, 0.2) !important;
          border-color: var(--teal) !important;
          box-shadow: 0 0 25px rgba(56, 189, 248, 0.45) !important;
          transform: scale(1.1);
        }
        .card-stack-nav-btn:active:not(:disabled) {
          transform: scale(0.95);
        }
        .card-stack-dot:hover {
          background: rgba(255, 255, 255, 0.5) !important;
        }
        .card-stack-link:hover {
          color: var(--teal) !important;
          transform: translateY(-1px);
        }
        .card-stack-card:active {
          cursor: grabbing;
        }
      `}</style>
    </div>
  );
}

function DefaultFanCard({ item }) {
  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <div style={{ position: 'absolute', inset: 0 }}>
        {item.imageSrc ? (
          <img
            src={item.imageSrc}
            alt={item.title}
            draggable={false}
            loading="eager"
            style={{ height: '100%', width: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', background: 'var(--card)', fontSize: '0.85rem', color: 'var(--muted)' }}>
            No image
          </div>
        )}
      </div>

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent 60%)' }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', height: '100%', flexDirection: 'column', justifyContent: 'flex-end', padding: '20px' }}>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
          {item.title}
        </div>
        {item.description ? (
          <div style={{ marginTop: '4px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {item.description}
          </div>
        ) : null}
      </div>
    </div>
  );
}
