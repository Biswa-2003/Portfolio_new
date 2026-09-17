'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const CORE_PILLARS = [
  {
    id: 'backend',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
    title: 'Scalable Backends & APIs',
    desc: 'Normalized PostgreSQL relational modeling, MongoDB document stores, WebSockets, and sub-50ms query optimization.',
    accent: 'var(--teal)',
    glow: 'rgba(56, 189, 248, 0.35)',
  },
  {
    id: 'ai',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a8 8 0 0 0-8 8c0 3.37 2.11 6.26 5.1 7.42.36.14.65.4.78.76l.62 1.76c.18.52.75.86 1.3.86h.4c.55 0 1.12-.34 1.3-.86l.62-1.76c.13-.36.42-.62.78-.76C17.89 16.26 20 13.37 20 10a8 8 0 0 0-8-8z" />
        <circle cx="9" cy="9" r="1" />
        <circle cx="15" cy="9" r="1" />
      </svg>
    ),
    title: 'AI & Real-Time Voice',
    desc: 'GPT-4o multimodal integrations, LiveKit WebRTC audio pipelines, Deepgram STT, and ElevenLabs neural synthesis.',
    accent: 'var(--violet)',
    glow: 'rgba(99, 102, 241, 0.35)',
  },
  {
    id: 'frontend',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
    title: '60FPS Frontend & 3D',
    desc: 'Next.js App Router, React Three Fiber 3D interactive graphics, GSAP physics, and component design systems.',
    accent: 'var(--pink)',
    glow: 'rgba(139, 92, 246, 0.35)',
  },
];

const VITALS = [
  { label: 'ROLE', value: 'Software Developer', detail: '@ Triptales Commercials' },
  { label: 'EDUCATION', value: 'BTech CSE', detail: 'GIET University (2024)' },
  { label: 'SPECIALTY', value: 'Full Stack + AI', detail: 'WebSockets & Agents' },
  { label: 'LOCATION', value: 'Bhubaneswar', detail: 'Odisha, India' },
];

export default function About() {
  const shouldReduceMotion = useReducedMotion();
  const cardRef = useRef(null);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlare({ x, y, opacity: 0.28 });

    const rotX = ((y - 50) / 50) * -6;
    const rotY = ((x - 50) / 50) * 6;
    setTilt({ rotateX: rotX, rotateY: rotY });
  };

  const handleMouseLeave = () => {
    setGlare((prev) => ({ ...prev, opacity: 0 }));
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const leftVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0, y: shouldReduceMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const rightVariants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 35,
      scale: shouldReduceMotion ? 1 : 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      id="about"
      className="about-editorial-section"
      aria-label="About Biswajit Panda — The Person Behind the Code"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Premium Black Atmospheric Backdrop with Floating Ambient Luminous Nodes */}
      <div className="about-editorial-backdrop" aria-hidden="true">
        <motion.div
          animate={{
            y: [-25, 25, -25],
            x: [-15, 15, -15],
            scale: [1, 1.12, 1],
            opacity: [0.14, 0.26, 0.14],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '12%',
            left: '5%',
            width: '380px',
            height: '380px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--teal) 0%, transparent 70%)',
            filter: 'blur(75px)',
            pointerEvents: 'none',
          }}
        />

        <motion.div
          animate={{
            y: [30, -30, 30],
            x: [20, -20, 20],
            scale: [1.1, 0.92, 1.1],
            opacity: [0.12, 0.22, 0.12],
          }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          style={{
            position: 'absolute',
            bottom: '8%',
            right: '8%',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--violet) 0%, transparent 70%)',
            filter: 'blur(85px)',
            pointerEvents: 'none',
          }}
        />

        <div className="about-ambient-glow" />
        <div className="about-grid-pattern" />
      </div>

      <div className="about-editorial-container">
        {/* =========================================================
            LEFT COLUMN: High-Impact Developer Story & Pillars
            ========================================================= */}
        <motion.div
          className="about-editorial-left"
          variants={leftVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Section Tag & Status */}
          <div className="about-editorial-meta">
            <span className="about-section-label">03 / IDENTITY &amp; CRAFT</span>
            <span className="about-meta-divider" />
            <div className="about-status-pill">
              <span className="status-ping-wrap">
                <span className="status-ping" />
                <span className="status-dot" />
              </span>
              <span className="status-label">OPEN FOR COLLABORATION</span>
            </div>
          </div>

          {/* Main Heading with Animated Molten Gradient */}
          <h2 className="about-editorial-headline">
            THE PERSON BEHIND <br />
            <span className="about-animated-gradient">THE ARCHITECTURE.</span>
          </h2>

          {/* Subheading */}
          <p className="about-editorial-subheadline">
            ENGINEERING SCALABLE SYSTEMS &amp; PURPOSE-DRIVEN SOFTWARE.
          </p>

          {/* Main Bio Paragraph */}
          <p className="about-editorial-main-p">
            I&apos;m <strong style={{ color: '#ffffff' }}>Biswajit Panda</strong>, a Full Stack Developer based in Bhubaneswar, India.
            Currently engineering production-grade software at <strong style={{ color: 'var(--teal)' }}>Triptales Commercials</strong>,
            I specialize in bridging high-concurrency backend services with fluid 60FPS user experiences and intelligent real-time AI agents.
          </p>

          {/* Developer Vitals Grid with Spring Hover Lift */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '12px',
              marginBottom: '32px',
            }}
          >
            {VITALS.map((item, idx) => (
              <motion.div
                key={item.label}
                whileHover={{ y: -3, scale: 1.02 }}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                style={{
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                }}
                className="about-vital-card"
              >
                <div
                  style={{
                    fontSize: '0.64rem',
                    fontFamily: 'monospace',
                    letterSpacing: '0.12em',
                    color: 'var(--teal)',
                    fontWeight: 700,
                    marginBottom: '3px',
                  }}
                >
                  {item.label}
                </div>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#ffffff' }}>
                  {item.value}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                  {item.detail}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Core Engineering Pillars */}
          <div style={{ marginBottom: '36px' }}>
            <div
              style={{
                fontSize: '0.72rem',
                fontFamily: 'monospace',
                letterSpacing: '0.14em',
                color: '#94a3b8',
                fontWeight: 700,
                textTransform: 'uppercase',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>// CORE ENGINEERING PILLARS</span>
              <span className="blinking-cursor">_</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '12px',
              }}
            >
              {CORE_PILLARS.map((pillar, pIdx) => (
                <motion.div
                  key={pillar.id}
                  whileHover={{ y: -4, scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 + pIdx * 0.1 }}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    background: 'linear-gradient(180deg, rgba(14, 10, 26, 0.8) 0%, rgba(7, 5, 15, 0.8) 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.09)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 10px 25px -10px rgba(0, 0, 0, 0.7)',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                  className="about-pillar-card"
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${pillar.accent}`,
                      color: pillar.accent,
                      marginBottom: '12px',
                      boxShadow: `0 0 12px ${pillar.glow}`,
                      transition: 'transform 0.3s ease',
                    }}
                    className="pillar-icon-box"
                  >
                    {pillar.icon}
                  </div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                    {pillar.title}
                  </h4>
                  <p style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                    {pillar.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="about-editorial-cta-row">
            <a href="#projects" className="about-btn-primary">
              <span>Inspect Architectures</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
            <a href="#experience" className="about-btn-secondary">
              <span>3D Career Trajectory</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </a>
            <a
              href="#contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '13px 20px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94a3b8',
                fontSize: '0.88rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.25s ease',
              }}
              className="about-btn-tertiary"
            >
              <span>Get In Touch</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </div>
        </motion.div>

        {/* =========================================================
            RIGHT COLUMN: 3D Holographic Portrait Chassis
            ========================================================= */}
        <motion.div
          className="about-editorial-right"
          variants={rightVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="about-portrait-frame-wrapper"
            style={{
              position: 'relative',
              transform: `perspective(900px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.15s ease-out, border-color 0.4s ease, box-shadow 0.4s ease',
              boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.95), 0 0 35px rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
            }}
          >
            {/* Rotating Cybernetic HUD Rings in corner */}
            <div
              style={{
                position: 'absolute',
                top: '-35px',
                right: '-35px',
                width: '160px',
                height: '160px',
                pointerEvents: 'none',
                zIndex: 1,
                opacity: 0.4,
              }}
            >
              <svg viewBox="0 0 100 100" className="cyber-hud-ring-outer" style={{ width: '100%', height: '100%' }}>
                <circle cx="50" cy="50" r="44" stroke="var(--teal)" strokeWidth="1" fill="none" strokeDasharray="6 4 14 4" />
              </svg>
              <svg viewBox="0 0 100 100" className="cyber-hud-ring-inner" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                <circle cx="50" cy="50" r="34" stroke="var(--violet)" strokeWidth="1.2" fill="none" strokeDasharray="3 6" />
              </svg>
            </div>

            {/* Ambient Backlight */}
            <div className="portrait-ambient-backlight" />

            {/* Interactive Specular Glare */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, ${glare.opacity}) 0%, transparent 60%)`,
                pointerEvents: 'none',
                zIndex: 3,
                transition: 'opacity 0.2s ease',
              }}
            />

            {/* Corner Crosshair Accents */}
            <span className="editorial-corner-crosshair top-left">+</span>
            <span className="editorial-corner-crosshair top-right">+</span>
            <span className="editorial-corner-crosshair bottom-left">+</span>
            <span className="editorial-corner-crosshair bottom-right">+</span>

            {/* Top Technical Metadata Bar */}
            <div className="portrait-header-bar">
              <div className="portrait-meta-col">
                <span className="portrait-badge-tag">SYS // IDENTITY MATRIX</span>
                <span className="portrait-badge-value">BISWAJIT PANDA</span>
              </div>
              <div className="portrait-badge-pill" style={{ borderColor: 'var(--teal)' }}>
                <span
                  style={{
                    position: 'relative',
                    display: 'inline-flex',
                    width: '6px',
                    height: '6px',
                  }}
                >
                  <span
                    className="about-pulse-ring"
                    style={{
                      position: 'absolute',
                      inset: '-2px',
                      borderRadius: '50%',
                      background: 'var(--teal)',
                    }}
                  />
                  <span
                    style={{
                      position: 'relative',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--teal)',
                      boxShadow: '0 0 8px var(--teal)',
                    }}
                  />
                </span>
                <span style={{ color: 'var(--teal)' }}>FULL STACK DEV (AI)</span>
              </div>
            </div>

            {/* Candid Portrait Image with Sweeping Laser Scanline */}
            <div className="about-candid-image-container" style={{ position: 'relative' }}>
              {/* Sweeping Laser Scanline */}
              <div
                className="about-scanline-laser"
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent 0%, var(--teal) 50%, transparent 100%)',
                  boxShadow: '0 0 16px var(--teal), 0 0 6px #ffffff',
                  pointerEvents: 'none',
                  zIndex: 4,
                }}
              />

              <Image
                src="/images/about-profile.png"
                alt="Biswajit Panda — Candid Portrait"
                fill
                priority={false}
                sizes="(max-width: 991px) 90vw, 480px"
                className="about-candid-image"
                style={{ objectFit: 'cover' }}
              />

              {/* Scrim Overlay */}
              <div className="about-candid-overlay-scrim" />

              {/* Floating Holographic Badge over image with gentle float animation */}
              <div
                className="about-floating-status-pill"
                style={{
                  position: 'absolute',
                  bottom: '14px',
                  left: '14px',
                  right: '14px',
                  zIndex: 3,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  background: 'rgba(5, 3, 12, 0.82)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--success)',
                      boxShadow: '0 0 8px var(--success)',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontFamily: 'monospace',
                      letterSpacing: '0.08em',
                      color: '#ffffff',
                      fontWeight: 700,
                    }}
                  >
                    STATUS: ACTIVE BUILDER
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.64rem',
                    fontFamily: 'monospace',
                    color: 'var(--teal)',
                    fontWeight: 700,
                  }}
                >
                  TRIPTALES &bull; 2025
                </span>
              </div>
            </div>

            {/* Bottom Minimal Footer Bar */}
            <div className="portrait-footer-bar">
              <div className="portrait-meta-col">
                <span className="portrait-badge-tag">ENGINEERING MOTTO</span>
                <span className="portrait-badge-value">HIGH CONCURRENCY &amp; CLEAN CODE</span>
              </div>
              <div className="portrait-meta-divider" />
              <div className="portrait-meta-col">
                <span className="portrait-badge-tag">MINDSET</span>
                <span className="portrait-badge-value">AUTONOMOUS &amp; PRODUCT-FIRST</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        /* Animated Molten Shimmering Gradient */
        .about-animated-gradient {
          background: linear-gradient(135deg, #38bdf8 0%, #818cf8 35%, #c084fc 70%, #38bdf8 100%);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: moltenAurora 6s ease infinite;
        }
        @keyframes moltenAurora {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Rotating Sci-Fi HUD Rings */
        .cyber-hud-ring-outer {
          animation: rotateClockwise 26s linear infinite;
        }
        .cyber-hud-ring-inner {
          animation: rotateCounterClockwise 18s linear infinite;
        }
        @keyframes rotateClockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes rotateCounterClockwise {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        /* Sweeping Laser Scanline */
        @keyframes aboutScanline {
          0% { top: -5%; opacity: 0; }
          15% { opacity: 0.9; }
          85% { opacity: 0.9; }
          100% { top: 105%; opacity: 0; }
        }
        .about-scanline-laser {
          animation: aboutScanline 3.6s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
        }

        /* Radar Pulse Beacon */
        @keyframes aboutRadarPulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        .about-pulse-ring {
          animation: aboutRadarPulse 1.8s cubic-bezier(0.2, 0.8, 0.4, 1) infinite;
        }

        /* Blinking Terminal Cursor */
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .blinking-cursor {
          color: var(--teal);
          font-weight: 700;
          animation: cursorBlink 1s step-end infinite;
        }

        /* Hover micro-interactions */
        .about-pillar-card:hover {
          border-color: rgba(56, 189, 248, 0.4) !important;
          box-shadow: 0 15px 35px -10px rgba(56, 189, 248, 0.25) !important;
        }
        .about-pillar-card:hover .pillar-icon-box {
          transform: scale(1.1) rotate(4deg);
        }
        .about-vital-card:hover {
          border-color: rgba(56, 189, 248, 0.3) !important;
          background: rgba(255, 255, 255, 0.05) !important;
          box-shadow: 0 8px 20px -6px rgba(56, 189, 248, 0.2) !important;
        }
        .about-btn-tertiary:hover {
          background: rgba(255, 255, 255, 0.09) !important;
          color: #ffffff !important;
          border-color: rgba(255, 255, 255, 0.25) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
}
