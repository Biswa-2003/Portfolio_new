'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EXPERIENCES } from './experience/ExperienceData';
import ExperienceCard from './experience/ExperienceCard';

// Sleek loading placeholder while WebGL initializes
function Experience3DPlaceholder() {
  return (
    <div
      className="w-100 h-100 d-flex flex-column align-items-center justify-content-center position-absolute inset-0"
      style={{
        background: 'radial-gradient(ellipse at center, rgba(10, 16, 36, 0.9) 0%, rgba(4, 2, 10, 0.98) 100%)',
        zIndex: 1,
      }}
    >
      <div
        className="spinner-border mb-3"
        style={{
          width: '2.8rem',
          height: '2.8rem',
          borderWidth: '3px',
          color: '#38bdf8',
          borderRightColor: 'transparent',
        }}
        role="status"
      >
        <span className="visually-hidden">Loading 3D Highway...</span>
      </div>
      <div
        style={{
          color: '#38bdf8',
          fontSize: '0.8rem',
          fontWeight: 800,
          letterSpacing: '0.14em',
          fontFamily: 'monospace',
          textTransform: 'uppercase',
        }}
      >
        INITIALIZING 3D CAREER HIGHWAY...
      </div>
      <div style={{ color: '#94a3b8', fontSize: '0.74rem', marginTop: '6px' }}>
        Rendering mountains, cyber highway & milestone beacons
      </div>
    </div>
  );
}

// Dynamically import 3D scene with SSR disabled for Canvas safety
const CareerJourneyScene = dynamic(
  () => import('./experience/CareerJourneyScene'),
  {
    ssr: false,
    loading: () => <Experience3DPlaceholder />,
  }
);

export default function Experience() {
  const [activeMilestone, setActiveMilestone] = useState('all');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const activeIndex = useMemo(() => {
    const idx = EXPERIENCES.findIndex((e) => e.id === activeMilestone);
    return idx >= 0 ? idx : 2;
  }, [activeMilestone]);

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + EXPERIENCES.length) % EXPERIENCES.length;
    setActiveMilestone(EXPERIENCES[prevIdx].id);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % EXPERIENCES.length;
    setActiveMilestone(EXPERIENCES[nextIdx].id);
  };

  return (
    <section
      id="experience"
      className="position-relative w-100 overflow-hidden"
      style={{
        padding: '110px 0 80px 0',
        background: '#04020a',
        color: '#ffffff',
      }}
    >
      <div className="container-fluid px-3 px-md-4" style={{ maxWidth: '1380px' }}>
        {/* Main 3D Journey Stage Container matching the reference image layout */}
        <div
          className="position-relative w-100 overflow-hidden rounded-4"
          style={{
            minHeight: '680px',
            height: 'clamp(640px, 82vh, 820px)',
            background: 'radial-gradient(ellipse at 50% 30%, #0c0822 0%, #04020a 85%)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.95), 0 0 35px -10px rgba(56, 189, 248, 0.15)',
          }}
        >
          {/* 3D WebGL Canvas in the background */}
          {isClient && (
            <CareerJourneyScene
              activeId={activeMilestone}
              onSelectMilestone={(id) => setActiveMilestone(id)}
            />
          )}

          {/* Top Center: Header Block (HISTORY, Career Trajectory, Subtitle) */}
          <div
            className="position-absolute top-0 start-50 translate-middle-x text-center px-3 pt-3 pt-md-4 w-100"
            style={{
              maxWidth: '720px',
              zIndex: 12,
              pointerEvents: 'none',
            }}
          >
            {/* HISTORY Pill Badge */}
            <div className="mb-2">
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 18px',
                  borderRadius: '9999px',
                  background: 'rgba(6, 12, 32, 0.85)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  color: '#38bdf8',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 0 15px rgba(56, 189, 248, 0.2)',
                }}
              >
                HISTORY
              </span>
            </div>

            {/* Career Trajectory Heading */}
            <h2
              className="fw-bold mb-2"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.1rem, 4.4vw, 3.2rem)',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.9)',
              }}
            >
              <span style={{ color: '#ffffff' }}>Career </span>
              <span
                style={{
                  background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 18px rgba(99, 102, 241, 0.6))',
                }}
              >
                Trajectory
              </span>
            </h2>

            {/* Subtitle */}
            <p
              className="mx-auto mb-0"
              style={{
                maxWidth: '620px',
                fontSize: 'clamp(0.82rem, 1.3vw, 0.95rem)',
                lineHeight: 1.55,
                color: '#94a3b8',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)',
              }}
            >
              A formal history of my technical tenure, outlining the environments where
              I&apos;ve executed infrastructure migrations and feature development.
            </p>
          </div>

          {/* Desktop Floating Experience Cards anchored above the 3D pedestals */}
          <div className="d-none d-lg-block">
            {/* Card 1: Milestone 1 (Left - Frontend Developer / Intern) */}
            <div
              className="position-absolute"
              style={{
                left: '7%',
                bottom: '25%',
                width: '280px',
                zIndex: 11,
              }}
            >
              <ExperienceCard
                experience={EXPERIENCES[0]}
                isActive={activeMilestone === EXPERIENCES[0].id}
                onHover={() => setActiveMilestone(EXPERIENCES[0].id)}
                onLeave={() => setActiveMilestone('all')}
                onClick={() => setActiveMilestone(EXPERIENCES[0].id)}
              />
            </div>

            {/* Card 2: Milestone 2 (Center - Software Developer) */}
            <div
              className="position-absolute"
              style={{
                left: '37.5%',
                bottom: '32%',
                width: '280px',
                zIndex: 11,
              }}
            >
              <ExperienceCard
                experience={EXPERIENCES[1]}
                isActive={activeMilestone === EXPERIENCES[1].id}
                onHover={() => setActiveMilestone(EXPERIENCES[1].id)}
                onLeave={() => setActiveMilestone('all')}
                onClick={() => setActiveMilestone(EXPERIENCES[1].id)}
              />
            </div>

            {/* Card 3: Milestone 3 (Right - Junior Software Developer / Triptales) */}
            <div
              className="position-absolute"
              style={{
                left: '67%',
                bottom: '39%',
                width: '280px',
                zIndex: 11,
              }}
            >
              <ExperienceCard
                experience={EXPERIENCES[2]}
                isActive={activeMilestone === EXPERIENCES[2].id}
                onHover={() => setActiveMilestone(EXPERIENCES[2].id)}
                onLeave={() => setActiveMilestone('all')}
                onClick={() => setActiveMilestone(EXPERIENCES[2].id)}
              />
            </div>
          </div>

          {/* Mobile / Tablet View: Active Card Carousel centered at bottom */}
          <div
            className="d-lg-none position-absolute bottom-0 start-50 translate-middle-x w-100 px-3 pb-4"
            style={{ maxWidth: '420px', zIndex: 12 }}
          >
            <div className="d-flex align-items-center justify-content-between mb-2">
              {/* Milestone step dots */}
              <div className="d-flex align-items-center gap-1">
                {EXPERIENCES.map((exp, i) => (
                  <button
                    key={exp.id}
                    type="button"
                    onClick={() => setActiveMilestone(exp.id)}
                    style={{
                      width: activeIndex === i ? '20px' : '8px',
                      height: '8px',
                      borderRadius: '9999px',
                      background: activeIndex === i ? exp.accent : 'rgba(255, 255, 255, 0.25)',
                      border: 'none',
                      padding: 0,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    aria-label={`Milestone ${i + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next controls */}
              <div className="d-flex gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center text-white"
                  style={{
                    width: '32px',
                    height: '32px',
                    background: 'rgba(8, 14, 32, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                  aria-label="Previous"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center text-white"
                  style={{
                    width: '32px',
                    height: '32px',
                    background: 'rgba(8, 14, 32, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                  aria-label="Next"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <ExperienceCard
              experience={EXPERIENCES[activeIndex]}
              isActive={true}
              onClick={() => setActiveMilestone(EXPERIENCES[activeIndex].id)}
            />
          </div>

          {/* Bottom Left Badge from Reference Mockup */}
          <div
            className="position-absolute d-none d-md-flex align-items-center gap-3"
            style={{
              bottom: '22px',
              left: '26px',
              zIndex: 12,
              pointerEvents: 'auto',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                background: 'rgba(6, 12, 32, 0.85)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'monospace',
                fontWeight: 800,
                fontSize: '0.88rem',
                color: '#38bdf8',
                boxShadow: '0 0 15px rgba(56, 189, 248, 0.25)',
              }}
            >
              02
            </div>
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ffffff' }}>
                Option 2: 3D Curved Path (Journey Style)
              </div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                A modern 3D road showing your career journey with milestones.
              </div>
            </div>
          </div>

          {/* Bottom Right Handwritten Annotation: Learning Building Growing --> */}
          <div
            className="position-absolute d-none d-sm-flex flex-column align-items-center"
            style={{
              bottom: '18px',
              right: '28px',
              zIndex: 12,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            <div
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: '24px',
                lineHeight: 1.15,
                fontWeight: 700,
                color: '#38bdf8',
                textShadow: '0 0 16px rgba(56, 189, 248, 0.8), 0 0 28px rgba(56, 189, 248, 0.4)',
                textAlign: 'center',
                transform: 'rotate(-4deg)',
              }}
            >
              Learning<br />
              Building<br />
              Growing
            </div>

            {/* Hand-drawn SVG Arrow pointing up toward the mountain path */}
            <svg
              width="46"
              height="26"
              viewBox="0 0 50 28"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.8))',
                marginTop: '1px',
              }}
            >
              <path d="M 6 16 Q 24 23 42 7" />
              <path d="M 33 5 L 43 7 L 39 17" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
