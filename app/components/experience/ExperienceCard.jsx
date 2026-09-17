'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExperienceCard({
  experience,
  isActive,
  onHover,
  onLeave,
  onClick,
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!showDetails) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowDetails(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [showDetails]);

  return (
    <>
      <motion.div
        className="position-relative w-100"
        style={{
          cursor: 'pointer',
          userSelect: 'none',
        }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.025, y: -4 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onClick={() => {
          onClick?.();
          setShowDetails(true);
        }}
      >
        {/* Sleek Vertical Connector Beam pointing down towards the 3D milestone */}
        <div
          className="d-none d-lg-block position-absolute"
          style={{
            width: '1px',
            height: '36px',
            bottom: '-36px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: isActive
              ? `linear-gradient(to bottom, ${experience.accent}, transparent)`
              : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.15), transparent)',
            boxShadow: isActive ? `0 0 10px ${experience.accent}` : 'none',
            transition: 'all 0.3s ease',
          }}
        />

        {/* Sleek Minimalist Glassmorphism Card matching reference image */}
        <div
          style={{
            borderRadius: '16px',
            padding: '16px 20px',
            background: isActive
              ? 'linear-gradient(135deg, rgba(14, 20, 44, 0.88) 0%, rgba(6, 10, 26, 0.82) 100%)'
              : 'linear-gradient(135deg, rgba(10, 14, 32, 0.72) 0%, rgba(5, 8, 20, 0.65) 100%)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: `1px solid ${isActive ? experience.accent : 'rgba(56, 189, 248, 0.22)'}`,
            boxShadow: isActive
              ? `0 16px 36px -10px rgba(0, 0, 0, 0.85), 0 0 28px -4px ${experience.glow}`
              : '0 10px 24px -10px rgba(0, 0, 0, 0.6), 0 0 15px -8px rgba(56, 189, 248, 0.12)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Top Date Badge Pill matching image */}
          <div className="d-flex align-items-center mb-2">
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                padding: '3px 10px',
                borderRadius: '9999px',
                background: 'rgba(56, 189, 248, 0.12)',
                color: experience.accent,
                border: `1px solid ${isActive ? experience.accent : 'rgba(56, 189, 248, 0.3)'}`,
                boxShadow: isActive ? `0 0 10px ${experience.glow}` : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              {experience.dateBadge}
            </span>
          </div>

          {/* Role Title */}
          <h4
            className="fw-bold mb-1"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.02rem',
              color: '#ffffff',
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
            }}
          >
            {experience.role}
          </h4>

          {/* Company Name */}
          <p
            className="mb-2"
            style={{
              fontSize: '0.84rem',
              color: '#cbd5e1',
              fontWeight: 500,
            }}
          >
            {experience.company}
          </p>

          {/* Location with Pin Icon */}
          <div
            className="d-flex align-items-center gap-2"
            style={{
              fontSize: '0.78rem',
              color: '#94a3b8',
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke={experience.accent}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{experience.location}</span>
          </div>
        </div>
      </motion.div>

      {/* Expanded Details Modal when clicked */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.22 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(3, 2, 8, 0.82)',
              backdropFilter: 'blur(16px)',
              padding: '20px',
            }}
            onClick={() => setShowDetails(false)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '560px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(18, 14, 34, 0.96) 0%, rgba(9, 7, 20, 0.96) 100%)',
                border: `1px solid ${experience.accent}`,
                boxShadow: `0 25px 60px -15px rgba(0,0,0,0.95), 0 0 35px ${experience.glow}`,
                padding: '28px 32px',
                maxHeight: '85vh',
                overflowY: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '9999px',
                      background: 'rgba(56, 189, 248, 0.12)',
                      color: experience.accent,
                      border: `1px solid ${experience.accent}`,
                    }}
                  >
                    {experience.dateBadge}
                  </span>
                  <h3 className="fw-bold mt-2 mb-1" style={{ fontSize: '1.4rem' }}>
                    {experience.role}
                  </h3>
                  <div className="d-flex gap-2" style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                    <span className="text-white fw-semibold">{experience.company}</span>
                    <span>&bull;</span>
                    <span>{experience.location}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDetails(false)}
                  className="btn btn-sm text-white"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  &times;
                </button>
              </div>

              <h6 className="fw-bold text-white mb-2" style={{ fontSize: '0.88rem' }}>
                Key Technical Contributions:
              </h6>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-4">
                {experience.points.map((pt, i) => (
                  <li key={i} className="d-flex gap-2 align-items-start" style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                    <span style={{ color: experience.accent, marginTop: '2px' }}>&bull;</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              <h6 className="fw-bold text-white mb-2" style={{ fontSize: '0.88rem' }}>
                Skills & Technologies:
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {experience.skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      fontSize: '0.75rem',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#94a3b8',
                      fontWeight: 600,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
