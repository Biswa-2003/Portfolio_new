'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from './MagneticButton';
import CinematicSmoke from './CinematicSmoke';
import { setHomeVariant } from '../lib/sceneState';

gsap.registerPlugin(ScrollTrigger);

function useReducedMotionSafe() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotionSafe();
  const progress = useMotionValue(0);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const check = () => {
      const desktop = window.innerWidth >= 992;
      setIsDesktop(desktop);
      setHomeVariant(!desktop);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // GSAP ScrollTrigger pins the hero for 2 viewports of scrubbed scroll
  useEffect(() => {
    if (reduceMotion) {
      progress.set(1);
      return;
    }
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * (isDesktop ? 1.25 : 0.95)}`,
        pin: true,
        scrub: 0.1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => progress.set(self.progress),
      });
    }, heroRef);

    return () => ctx.revert();
  }, [reduceMotion, progress, isDesktop]);

  // ==========================================================
  // SCROLL SEQUENCE:
  // 1. Initial screen: PORTFOLIO text is first shown prominently.
  // 2. On scroll: Portrait rises from below and OVERLAPS the letters.
  // 3. As scroll continues: PORTFOLIO scales back/dissolves, portrait
  //    moves into focus, and developer introduction is revealed.
  // ==========================================================

  // Giant PORTFOLIO typography (z-index: 2 — BEHIND portrait):
  // Prominently shown at 0%, then scales outward and fades as camera passes through
  const titleScale = useTransform(progress, [0, 0.35, 0.6, 0.85, 1], [1, 1.15, 2.1, 3.6, 3.6]);
  const titleOpacity = useTransform(progress, [0, 0.35, 0.55, 0.75, 1], [1, 1, 0.4, 0, 0]);
  const titleY = useTransform(progress, [0, 0.35, 0.6, 0.85, 1], [0, -8, -25, -55, -55]);

  // Professional Portrait (z-index: 3 — IN FRONT OF PORTFOLIO, OVERLAPPING IT):
  // At 0% (before scroll): Portrait is completely hidden (opacity 0, translated down).
  // ONLY "PORTFOLIO" typography is visible on the initial screen.
  // On scroll: Portrait rises up from below and OVERLAPS the letters!
  const portraitYDesktop = useTransform(progress, [0, 0.08, 0.35, 0.6, 1], [460, 300, 20, 0, 0]);
  const portraitYMobile = useTransform(progress, [0, 0.08, 0.35, 0.6, 0.85, 1], [340, 180, 0, -50, -120, -120]);
  const portraitY = isDesktop ? portraitYDesktop : portraitYMobile;

  const portraitScaleDesktop = useTransform(progress, [0, 0.08, 0.35, 0.6, 1], [0.82, 0.88, 1.0, 1.0, 1.0]);
  const portraitScaleMobile = useTransform(progress, [0, 0.08, 0.35, 0.6, 0.85, 1], [0.8, 0.88, 0.95, 0.88, 0.76, 0.76]);
  const portraitScale = isDesktop ? portraitScaleDesktop : portraitScaleMobile;

  const portraitOpacityDesktop = useTransform(progress, [0, 0.05, 0.28, 0.55, 1], [0, 0.25, 1.0, 1.0, 1.0]);
  const portraitOpacityMobile = useTransform(progress, [0, 0.08, 0.32, 0.55, 0.8, 1], [0, 0.35, 1.0, 0.65, 0.22, 0.16]);
  const portraitOpacity = isDesktop ? portraitOpacityDesktop : portraitOpacityMobile;
  const portraitGlowOpacity = useTransform(progress, [0, 0.08, 0.32, 1], [0, 0.3, 0.95, 0.9]);

  // On desktop, portrait smoothly shifts rightward as intro copy appears on the left
  const portraitXDesktop = useTransform(progress, [0, 0.3, 0.55, 0.8, 1], ['0vw', '0vw', '6vw', '21vw', '21vw']);
  const portraitXMobile = useTransform(progress, [0, 0.3, 0.55, 0.8, 1], ['0vw', '0vw', '0vw', '0vw', '0vw']);
  const portraitX = isDesktop ? portraitXDesktop : portraitXMobile;

  // Developer Introduction & CTA (z-index: 4):
  const introOpacity = useTransform(progress, [0, 0.4, 0.65, 0.88, 1], [0, 0, 0.25, 0.9, 1]);
  const introY = useTransform(progress, [0, 0.4, 0.65, 0.88, 1], [40, 40, 20, 5, 0]);
  const introXDesktop = useTransform(progress, [0, 0.4, 0.65, 0.88, 1], [-30, -30, -15, 0, 0]);
  const introXMobile = useTransform(progress, [0, 0.4, 0.65, 0.88, 1], [0, 0, 0, 0, 0]);
  const introX = isDesktop ? introXDesktop : introXMobile;
  const introPointerEvents = useTransform(progress, (v) => (v > 0.65 ? 'auto' : 'none'));

  // Studio lighting subtle dynamic pulse
  const glowScale = useTransform(progress, [0, 0.5, 1], [1, 1.15, 1.25]);
  const glowOpacity = useTransform(progress, [0, 0.5, 1], [0.85, 1, 0.9]);

  return (
    <section
      id="home"
      ref={heroRef}
      className="cinematic-hero-section"
      aria-label="Developer Portfolio Hero"
    >
      {/* ====================================================
          LAYER 1: DEEP NAVY ATMOSPHERIC LIGHTING & BACKDROP
          ==================================================== */}
      <div className="hero-atmosphere" aria-hidden="true">
        <div className="hero-navy-base" />
        <div className="hero-ambient-grid" />
        <motion.div
          className="hero-spotlight"
          style={{ scale: glowScale, opacity: glowOpacity }}
        />
        <div className="hero-top-glow" />

        {/* Cinematic WebGL Atmospheric Smoke Effect */}
        <CinematicSmoke scrollProgress={progress} />

        <motion.div
          className="hero-portrait-glow"
          style={{ x: portraitX, y: portraitY, scale: portraitScale, opacity: portraitGlowOpacity }}
        />
        <div className="hero-vignette" />
      </div>

      {/* ====================================================
          LAYER 2: OVERSIZED "PORTFOLIO" CINEMATIC TYPOGRAPHY
          (z-index: 2 — Sits BEHIND the rising portrait!)
          Shows first on initial screen.
          ==================================================== */}
      <motion.div
        className="hero-typography-layer"
        aria-hidden="true"
        style={{
          scale: titleScale,
          opacity: titleOpacity,
          y: titleY,
          willChange: 'transform, opacity',
        }}
      >
        <h2 className="hero-giant-title">PORTFOLIO</h2>
      </motion.div>

      {/* ====================================================
          LAYER 3: PROFESSIONAL PORTRAIT
          (z-index: 3 — Sits IN FRONT and OVERLAPS the letters!)
          Rises on scroll from below to overlap "PORTFOLIO".
          ==================================================== */}
      <motion.div
        className="hero-portrait-layer"
        aria-hidden="true"
        style={{
          scale: portraitScale,
          y: portraitY,
          x: portraitX,
          opacity: portraitOpacity,
          willChange: 'transform, opacity',
        }}
      >
        <div className="hero-portrait-frame">
          <Image
            src="/biswajit-hero.png"
            alt="Biswajit Panda — Full Stack Developer"
            fill
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 55vw, 680px"
            priority
            unoptimized
            className="hero-portrait-img"
          />
        </div>
      </motion.div>

      {/* ====================================================
          LAYER 4: DEVELOPER INTRODUCTION & CTA BUTTONS
          Revealed smoothly as the typography scales away.
          ==================================================== */}
      <motion.div
        className="hero-content-layer"
        style={{
          opacity: introOpacity,
          y: introY,
          x: introX,
          pointerEvents: introPointerEvents,
        }}
      >
        <div className="hero-intro-container">
          {/* Status badge */}
          <div className="hero-status-pill">
            <span className="status-ping-wrap">
              <span className="status-ping" />
              <span className="status-dot" />
            </span>
            <span className="status-text">Available for new opportunities</span>
          </div>

          {/* Developer Name */}
          <h1 className="hero-name">Biswajit Panda</h1>

          {/* Role / Title */}
          <div className="hero-role-wrap">
            <span className="hero-role-title">Full Stack Developer</span>
            <span className="hero-role-divider">•</span>
            <span className="hero-role-sub">AI & Scalable Systems</span>
          </div>

          {/* Description */}
          <p className="hero-description">
            Building scalable web applications and intelligent digital experiences.
          </p>

          {/* Skill pills */}
          <div className="hero-skills-row" aria-label="Core Skills">
            {['React.js', 'Next.js', 'Node.js', 'TypeScript', 'AWS', 'Generative AI'].map((skill) => (
              <span key={skill} className="hero-skill-chip">
                {skill}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hero-actions-row">
            <MagneticButton href="#projects" className="hero-btn-primary">
              <span>View Projects</span>
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </MagneticButton>

            <MagneticButton href="#contact" className="hero-btn-secondary">
              <span>Contact Me</span>
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </MagneticButton>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
