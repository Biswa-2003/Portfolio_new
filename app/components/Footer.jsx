'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import ContactForm from './ContactForm';
import MagneticButton from './MagneticButton';
import { Check, Copy, Mail, Phone, MapPin } from 'lucide-react';

// Dynamic import of 3D Particle Wave Background (SSR disabled for Three.js Canvas)
const Contact3DBackground = dynamic(() => import('./three/Contact3DBackground'), {
  ssr: false,
});

const SOCIALS = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/biswajit-panda-b66a41256/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    url: 'https://github.com/Biswa-2003',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    name: 'Twitter / X',
    url: 'https://twitter.com/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const containerRef = useRef(null);
  const year = new Date().getFullYear();
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2200);
  };

  return (
    <footer
      id="contact"
      className="position-relative overflow-hidden"
      style={{
        minHeight: '920px',
        backgroundColor: '#02000c',
      }}
    >
      {/* ====================================================
          CINEMATIC SCI-FI SPACE STATION & EARTH BACKGROUND
          ==================================================== */}
      <div
        className="position-absolute w-100 h-100 pointer-events-none"
        style={{ top: 0, left: 0, zIndex: 0, overflow: 'hidden' }}
      >
        {/* Photorealistic Astronaut overlooking Earth & Space Station */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/contact_station_bg.jpg"
          alt="Space Station Observation Platform"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 60%',
            opacity: 0.95,
          }}
        />

        {/* Ambient Vignette & Contrast Overlay Gradients */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(3, 0, 20, 0.88) 0%, rgba(3, 0, 20, 0.35) 25%, rgba(3, 0, 20, 0.45) 75%, rgba(2, 0, 12, 0.95) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 80% 50%, rgba(56, 189, 248, 0.08) 0%, transparent 60%)',
          }}
        />
      </div>

      {/* Interactive 3D Particle Wave Field */}
      <div
        className="position-absolute w-100 h-100 pointer-events-none"
        style={{ top: 0, left: 0, zIndex: 1, opacity: 0.65 }}
      >
        <Contact3DBackground />
      </div>

      {/* Top Horizon Neon Laser Divider */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '1px',
          background:
            'linear-gradient(90deg, transparent 0%, rgba(56, 189, 248, 0.5) 25%, rgba(99, 102, 241, 0.7) 50%, rgba(56, 189, 248, 0.5) 75%, transparent 100%)',
          zIndex: 2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: -2,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '240px',
          height: '6px',
          background: '#38bdf8',
          filter: 'blur(8px)',
          borderRadius: '9999px',
          opacity: 0.65,
          zIndex: 2,
        }}
      />

      {/* MAIN CONTENT CONTAINER */}
      <div
        className="container position-relative"
        ref={containerRef}
        style={{ paddingTop: '130px', paddingBottom: '80px', zIndex: 3 }}
      >
        <div className="row g-5 align-items-center">
          {/* ====================================================
              LEFT COLUMN: EXECUTIVE OVERVIEW & DIRECT CHANNELS
              ==================================================== */}
          <motion.div
            initial={{ opacity: 0.6, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="col-lg-5"
          >
            {/* Status Radar: SYSTEMS ONLINE / PRODUCTION READY */}
            <div
              className="d-inline-flex align-items-center gap-2 mb-4 px-3 py-1 rounded-pill"
              style={{
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span
                className="position-relative d-flex align-items-center justify-content-center"
                style={{ width: '8px', height: '8px' }}
              >
                <span
                  style={{
                    position: 'absolute',
                    width: '14px',
                    height: '14px',
                    background: '#10b981',
                    borderRadius: '50%',
                    opacity: 0.6,
                    animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                  }}
                />
                <span
                  style={{
                    position: 'relative',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#10b981',
                  }}
                />
              </span>
              <span
                className="fw-bold text-uppercase"
                style={{
                  color: '#34d399',
                  fontSize: '0.74rem',
                  letterSpacing: '0.12em',
                  fontFamily: 'monospace',
                }}
              >
                SYSTEMS ONLINE / PRODUCTION READY
              </span>
            </div>

            {/* Title */}
            <h2
              className="fw-bold mb-3"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.3rem, 4.2vw, 3.5rem)',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                color: '#ffffff',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)',
              }}
            >
              Let&apos;s engineer <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                the future
              </span>{' '}
              of your system.
            </h2>

            {/* Narrative */}
            <p
              className="mb-4"
              style={{
                fontSize: '1.02rem',
                color: '#cbd5e1',
                lineHeight: 1.7,
                maxWidth: '480px',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
              }}
            >
              I&apos;m always open to discussing new opportunities, innovative ideas, or potential collaborations. Whether you have a project in mind or just want to connect, feel free to reach out!
            </p>

            {/* Direct Communication Channels */}
            <div className="d-flex flex-column gap-3 mb-4" style={{ maxWidth: '440px' }}>
              {/* Email */}
              <div
                className="d-flex align-items-center justify-content-between p-3 px-3 px-sm-4 rounded-3"
                style={{
                  background: 'rgba(9, 14, 34, 0.82)',
                  border: '1px solid rgba(56, 189, 248, 0.28)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                  transition: 'all 0.25s ease',
                  overflow: 'hidden',
                  width: '100%',
                }}
              >
                <div className="d-flex align-items-center gap-2 gap-sm-3" style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                  <div
                    className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                    style={{
                      width: '36px',
                      height: '36px',
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      color: '#38bdf8',
                    }}
                  >
                    <Mail size={18} />
                  </div>
                  <a
                    href="mailto:biswajitpanda130203@gmail.com"
                    className="text-decoration-none fw-semibold text-truncate"
                    style={{ color: '#38bdf8', fontSize: 'clamp(0.78rem, 3.2vw, 0.94rem)' }}
                  >
                    biswajitpanda130203@gmail.com
                  </a>
                </div>
                <button
                  onClick={() => handleCopy('biswajitpanda130203@gmail.com', 'email')}
                  className="btn btn-sm border-0 p-1 px-2 flex-shrink-0 ms-2"
                  style={{
                    background: copiedField === 'email' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                    color: copiedField === 'email' ? '#34d399' : '#94a3b8',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                  }}
                  title="Copy email"
                >
                  {copiedField === 'email' ? (
                    <span className="d-flex align-items-center gap-1">
                      <Check size={13} /> Copied!
                    </span>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              {/* Phone */}
              <div
                className="d-flex align-items-center justify-content-between p-3 px-3 px-sm-4 rounded-3"
                style={{
                  background: 'rgba(9, 14, 34, 0.82)',
                  border: '1px solid rgba(56, 189, 248, 0.28)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                  transition: 'all 0.25s ease',
                  width: '100%',
                }}
              >
                <div className="d-flex align-items-center gap-2 gap-sm-3">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0"
                    style={{
                      width: '36px',
                      height: '36px',
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      color: '#38bdf8',
                    }}
                  >
                    <Phone size={18} />
                  </div>
                  <a
                    href="tel:+91966864753"
                    className="text-decoration-none fw-semibold"
                    style={{ color: '#f1f5f9', fontSize: 'clamp(0.85rem, 3.4vw, 0.94rem)' }}
                  >
                    +91 96686 64753
                  </a>
                </div>
                <button
                  onClick={() => handleCopy('+91966864753', 'phone')}
                  className="btn btn-sm border-0 p-1 px-2 flex-shrink-0 ms-2"
                  style={{
                    background: copiedField === 'phone' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                    color: copiedField === 'phone' ? '#34d399' : '#94a3b8',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                  }}
                  title="Copy phone"
                >
                  {copiedField === 'phone' ? (
                    <span className="d-flex align-items-center gap-1">
                      <Check size={13} /> Copied!
                    </span>
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              {/* Location */}
              <div
                className="d-flex align-items-center gap-3 p-3 px-4 rounded-3"
                style={{
                  background: 'rgba(9, 14, 34, 0.82)',
                  border: '1px solid rgba(56, 189, 248, 0.28)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-2"
                  style={{
                    width: '36px',
                    height: '36px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    color: '#38bdf8',
                  }}
                >
                  <MapPin size={18} />
                </div>
                <span className="fw-semibold" style={{ color: '#e2e8f0', fontSize: '0.94rem' }}>
                  India, Remote Distributed
                </span>
              </div>
            </div>

            {/* Architectural Badges */}
            <div className="d-flex flex-wrap gap-2 mb-4">
              {['INFRASTRUCTURE', 'CLOUD ARCHITECTURE', 'SECURE AUTH', 'FULL-STACK ENG.'].map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1 rounded-pill"
                  style={{
                    fontSize: '0.72rem',
                    color: '#38bdf8',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    backdropFilter: 'blur(8px)',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Space Station Decal & Socials */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 pt-2">
              <div
                className="p-2 px-3 rounded-2"
                style={{
                  background: 'rgba(7, 12, 28, 0.75)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  backdropFilter: 'blur(8px)',
                  fontFamily: 'monospace',
                  fontSize: '0.74rem',
                  color: '#60a5fa',
                  letterSpacing: '0.08em',
                }}
              >
                GOOD IDEAS TRAVEL FAR 🚀
              </div>

              <div className="d-flex gap-2">
                {SOCIALS.map((social, i) => (
                  <MagneticButton
                    key={i}
                    href={social.url}
                    className="d-flex align-items-center justify-content-center text-decoration-none social-icon-pill"
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'rgba(9, 14, 34, 0.82)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#94a3b8',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    {social.icon}
                  </MagneticButton>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ====================================================
              RIGHT COLUMN: HOLOGRAPHIC CYBER CONNECTION PORTAL
              ==================================================== */}
          <motion.div
            initial={{ opacity: 0.6, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="col-lg-7 position-relative"
          >
            {/* Background Cyber Orbit HUD Reticle Ring */}
            <div
              className="position-absolute pointer-events-none d-none d-xl-block"
              style={{
                width: '600px',
                height: '600px',
                right: '-100px',
                top: '-40px',
                borderRadius: '50%',
                border: '1px dashed rgba(56, 189, 248, 0.2)',
                zIndex: 0,
                animation: 'celestialSpin 60s linear infinite',
              }}
            />
            <div
              className="position-absolute pointer-events-none d-none d-xl-block"
              style={{
                width: '420px',
                height: '420px',
                right: '-10px',
                top: '50px',
                borderRadius: '50%',
                border: '1px solid rgba(129, 140, 248, 0.15)',
                zIndex: 0,
              }}
            />

            {/* Surrounding Cyber Decorative Monospace Tags (from Reference Image) */}
            <div
              className="position-absolute pointer-events-none d-none d-xxl-block"
              style={{
                right: '-180px',
                top: '20px',
                color: 'rgba(147, 197, 253, 0.55)',
                fontFamily: 'monospace',
                fontSize: '0.72rem',
                letterSpacing: '0.08em',
                lineHeight: 1.6,
                textAlign: 'right',
                zIndex: 1,
              }}
            >
              Same Universe<br />
              Bigger Possibilities
            </div>

            <div
              className="position-absolute pointer-events-none d-none d-xxl-block"
              style={{
                right: '-180px',
                top: '45%',
                color: 'rgba(56, 189, 248, 0.65)',
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                lineHeight: 1.8,
                textAlign: 'right',
                zIndex: 1,
              }}
            >
              CONNECT<br />
              COLLABORATE<br />
              INNOVATE<br />
              BUILD TOGETHER
            </div>

            <div
              className="position-absolute pointer-events-none d-none d-xxl-block"
              style={{
                right: '-180px',
                bottom: '20px',
                color: 'rgba(147, 197, 253, 0.55)',
                fontFamily: 'monospace',
                fontSize: '0.72rem',
                letterSpacing: '0.08em',
                lineHeight: 1.6,
                textAlign: 'right',
                zIndex: 1,
              }}
            >
              LET&apos;S<br />
              BUILD<br />
              SOMETHING<br />
              AMAZING<br />
              TOGETHER
            </div>

            {/* THE HOLOGRAPHIC CYBER FRAME */}
            <div
              className="cyber-portal-frame position-relative"
              style={{
                borderRadius: '24px',
                background: 'rgba(8, 14, 38, 0.82)',
                border: '1.5px solid rgba(56, 189, 248, 0.38)',
                boxShadow:
                  '0 0 50px rgba(37, 99, 235, 0.35), 0 25px 70px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                padding: '36px',
                zIndex: 2,
              }}
            >
              {/* Glowing Beveled Corner Tech Brackets */}
              <div
                style={{
                  position: 'absolute',
                  top: '-2px',
                  left: '-2px',
                  width: '24px',
                  height: '24px',
                  borderTop: '3px solid #38bdf8',
                  borderLeft: '3px solid #38bdf8',
                  borderTopLeftRadius: '24px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '24px',
                  height: '24px',
                  borderTop: '3px solid #818cf8',
                  borderRight: '3px solid #818cf8',
                  borderTopRightRadius: '24px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  left: '-2px',
                  width: '24px',
                  height: '24px',
                  borderBottom: '3px solid #38bdf8',
                  borderLeft: '3px solid #38bdf8',
                  borderBottomLeftRadius: '24px',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '24px',
                  height: '24px',
                  borderBottom: '3px solid #818cf8',
                  borderRight: '3px solid #818cf8',
                  borderBottomRightRadius: '24px',
                }}
              />

              {/* Shimmer Top Accent Bar */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '20%',
                  right: '20%',
                  height: '2px',
                  background:
                    'linear-gradient(90deg, transparent, #38bdf8, #818cf8, transparent)',
                }}
              />

              {/* Portal Header: Icon + Title + EST. 2025 Signal */}
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center gap-3">
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      border: '2.5px solid #38bdf8',
                      borderRadius: '4px',
                      boxShadow: '0 0 12px rgba(56, 189, 248, 0.7)',
                    }}
                  />
                  <h3
                    className="h4 fw-bold mb-0"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: '#ffffff',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Secure Connection Portal
                  </h3>
                </div>

                <div
                  className="d-flex align-items-center gap-2"
                  style={{ fontFamily: 'monospace', fontSize: '0.76rem', color: '#60a5fa' }}
                >
                  <span>EST. 2025</span>
                  {/* Signal Strength 4 Bars */}
                  <div className="d-flex align-items-end gap-1" style={{ height: '14px' }}>
                    <span style={{ width: '3px', height: '4px', background: '#38bdf8', borderRadius: '1px' }} />
                    <span style={{ width: '3px', height: '7px', background: '#38bdf8', borderRadius: '1px' }} />
                    <span style={{ width: '3px', height: '10px', background: '#38bdf8', borderRadius: '1px' }} />
                    <span style={{ width: '3px', height: '14px', background: '#38bdf8', borderRadius: '1px' }} />
                  </div>
                </div>
              </div>

              {/* Subtitle */}
              <p
                className="mb-4"
                style={{
                  color: '#94a3b8',
                  fontSize: '0.94rem',
                  lineHeight: 1.5,
                }}
              >
                Initialize data transmission for project collaboration or enterprise inquiry.
              </p>

              {/* Embedded Interactive Contact Form */}
              <ContactForm />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(2, 0, 12, 0.92)',
          position: 'relative',
          zIndex: 3,
        }}
      >
        <div
          className="container py-4 d-flex flex-wrap justify-content-between align-items-center gap-3 fw-medium"
          style={{ fontSize: '0.84rem', color: '#71717a' }}
        >
          <div>© {year} Biswajit Panda. All system protocols reserved.</div>
          <div className="d-flex gap-4">
            <span className="footer-link">Privacy Policy</span>
            <span className="footer-link">Terms of Service</span>
            <span className="footer-link">System Telemetry</span>
          </div>
        </div>
      </div>

      <style>{`
        .social-icon-pill:hover {
          background: rgba(56, 189, 248, 0.25) !important;
          border-color: #38bdf8 !important;
          color: #38bdf8 !important;
          transform: translateY(-2px);
          box-shadow: 0 0 18px rgba(56, 189, 248, 0.5);
        }
        .footer-link {
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .footer-link:hover {
          color: #38bdf8;
        }
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </footer>
  );
}
