'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { CardStack } from './CardStack';

const PROJECTS = [
  {
    id: 1,
    category: 'realtime',
    title: 'Real-Time Chat Ecosystem',
    desc: 'Engineered a high-performance, real-time messaging platform with WebSockets, presence indicators, message persistence, and rich media support.',
    stack: 'Next.js · Socket.io · Node.js · MongoDB',
    link: 'https://github.com/Biswa-2003',
    imageSrc: '/images/project_chat.jpg',
    metrics: { Latency: '<20ms', Connections: '10k+ WebSockets' },
    accent: 'var(--teal)',
    glow: 'rgba(56, 189, 248, 0.4)',
    architecture: [
      'Engineered bi-directional WebSocket communication pipelines with automatic reconnection fallbacks.',
      'Implemented distributed presence heartbeat tracking and message delivery receipt confirmations.',
      'Architected horizontally scalable MongoDB document schemas with compound indexing for instant history retrieval.',
      'Containerized backend services with Docker for deterministic zero-downtime rollouts.',
    ],
  },
  {
    id: 2,
    category: 'backend',
    title: 'Contact Management Ecosystem',
    desc: 'Architected a robust Contact Management system featuring secure authentication, paginated search, and multi-file upload orchestration.',
    stack: 'Next.js · Node.js · Express · PostgreSQL',
    link: 'https://github.com/Biswa-2003/Contact_manegment',
    imageSrc: '/images/project_crm.jpg',
    metrics: { Latency: '<50ms', Auth: 'JWT / OTP' },
    accent: 'var(--success)',
    glow: 'rgba(52, 211, 153, 0.4)',
    architecture: [
      'Hardened authentication infrastructure using HTTP-only JWTs, cryptographic salt hashing, and OTP verification.',
      'Designed normalized PostgreSQL relational schemas optimized with B-tree indices for sub-50ms query execution.',
      'Engineered multi-part stream pipelines handling secure document attachment uploads with MIME-type validation.',
      'Built granular Role-Based Access Control (RBAC) middleware protecting sensitive contact records.',
    ],
  },
  {
    id: 3,
    category: 'backend',
    title: 'Matrimony Platform',
    desc: 'Engineered a scalable matchmaking application with JWT authorization pipelines, dynamic image cropping, and unstructured profiles mapped to JSONB.',
    stack: 'Next.js · App Router · Express · PostgreSQL',
    link: 'https://github.com/Biswa-2003',
    imageSrc: '/images/project_matrimony.jpg',
    metrics: { Uptime: '99.99%', Database: 'JSONB Hybrid' },
    accent: '#facc15',
    glow: 'rgba(250, 204, 21, 0.4)',
    architecture: [
      'Employed hybrid relational and JSONB document modeling in PostgreSQL for dynamic custom preference filters.',
      'Implemented real-time image cropping and compression pipelines reducing payload sizes by over 60%.',
      'Designed multi-tier profile verification workflows ensuring platform data integrity and spam reduction.',
      'Integrated payment webhooks with automated idempotency keys to ensure transaction consistency.',
    ],
  },
  {
    id: 4,
    category: 'ai',
    title: 'Intelligent AI Chatbot Assistant',
    desc: 'Engineered a highly responsive AI-driven chatbot powered by large language models, featuring contextual memory and specialized tool execution.',
    stack: 'Next.js · Python · LangChain · OpenAI',
    link: 'https://github.com/Biswa-2003',
    imageSrc: '/images/project_ai_assistant.jpg',
    metrics: { Inference: '<800ms', Context: '128k Tokens' },
    accent: 'var(--violet)',
    glow: 'rgba(99, 102, 241, 0.4)',
    architecture: [
      'Orchestrated multi-turn conversational agents with sliding-window memory management and token budget guards.',
      'Integrated LangChain tool-calling agents capable of parsing user intent and querying live external databases.',
      'Built resilient streaming HTTP response pipelines delivering real-time character-by-character token output.',
      'Implemented semantic cache layers reducing OpenAI API overhead costs by 40% on repeated queries.',
    ],
  },
  {
    id: 5,
    category: 'frontend',
    title: 'SaaS Professional Portfolio',
    desc: 'Developed a fully responsive, enterprise-tier developer portfolio utilizing strict component modularity and CSS variables for theming.',
    stack: 'Next.js · React · Framer Motion · Three.js',
    link: 'https://github.com/Biswa-2003',
    imageSrc: '/images/project_saas.jpg',
    metrics: { Performance: '100/100', Motion: '60FPS' },
    accent: 'var(--pink)',
    glow: 'rgba(139, 92, 246, 0.4)',
    architecture: [
      'Constructed a 60FPS WebGL 3D canvas pipeline utilizing React Three Fiber with dynamic device-pixel-ratio scaling.',
      'Engineered a complete CSS design system powered by custom HSL tokens, glassmorphism, and responsive typography.',
      'Optimized Core Web Vitals to achieve 100/100 Lighthouse performance scores through static generation and lazy hydration.',
      'Implemented smooth GSAP scrubbed scroll sequences and Framer Motion spring physics.',
    ],
  },
  {
    id: 6,
    category: 'ai',
    title: 'AI Voice Chat Bot',
    desc: 'Production-grade bilingual AI voice agent enabling real-time natural conversations in English & Hindi with sentiment analysis and scope enforcement.',
    stack: 'Python · LiveKit Agents · GPT-4o · Deepgram · ElevenLabs',
    link: 'https://github.com/Biswa-2003/Ai_voice_chat_bot',
    imageSrc: '/images/project_ai_voice.jpg',
    metrics: { Languages: 'EN + HI', LLM: 'GPT-4o' },
    accent: '#a78bfa',
    glow: 'rgba(167, 139, 250, 0.45)',
    architecture: [
      'Engineered ultra-low-latency real-time voice streaming with LiveKit WebRTC audio pipelines and Deepgram Nova STT.',
      'Integrated GPT-4o real-time multimodal reasoning with custom system guardrails for domain scope enforcement.',
      'Employed ElevenLabs neural voice synthesis with adaptive cadence and sentiment-aware tone inflection.',
      'Benchmarked end-to-end voice round-trip latency at sub-800ms across domestic broadband and cellular connections.',
    ],
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Architectures' },
  { id: 'ai', label: 'AI & Voice' },
  { id: 'backend', label: 'Backend & APIs' },
  { id: 'realtime', label: 'Real-Time' },
];

const headerVariants = {
  hidden: { opacity: 0, y: 32, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
};

function ProjectCard({ item, active, onOpenModal }) {
  const tags = item.stack.split('·').map((t) => t.trim()).slice(0, 3);
  const metricEntries = item.metrics ? Object.entries(item.metrics) : [];
  const cardRef = useRef(null);
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e) => {
    if (!active || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlare({ x, y, opacity: 0.28 });
    
    // Smooth 3D tilt calculation
    const rotX = ((y - 50) / 50) * -7;
    const rotY = ((x - 50) / 50) * 7;
    setTilt({ rotateX: rotX, rotateY: rotY });
  };

  const handleMouseLeave = () => {
    setGlare((prev) => ({ ...prev, opacity: 0 }));
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`project-card-chassis ${active ? 'is-active-card' : ''}`}
      style={{
        position: 'relative',
        height: '100%',
        width: '100%',
        borderRadius: '24px',
        overflow: 'hidden',
        background: '#07050d',
        border: active
          ? `1px solid ${item.accent}`
          : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: active
          ? `0 30px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px ${item.glow}, inset 0 1px 0 rgba(255, 255, 255, 0.25)`
          : '0 20px 45px -10px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        transform: active
          ? `perspective(900px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(1.01, 1.01, 1.01)`
          : 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.15s ease-out, border-color 0.4s ease, box-shadow 0.4s ease',
      }}
    >
      {/* Animated Sci-Fi Sweeping Laser Scanline on Active Card */}
      {active && (
        <div
          className="project-scanline-laser"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: '2px',
            background: `linear-gradient(90deg, transparent 0%, ${item.accent} 50%, transparent 100%)`,
            boxShadow: `0 0 16px ${item.accent}, 0 0 6px #ffffff`,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
      )}

      {/* Background Image & Cinematic Gradient Scrim */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Image
          src={item.imageSrc}
          alt={item.title}
          fill
          draggable={false}
          sizes="500px"
          style={{
            objectFit: 'cover',
            opacity: active ? 0.95 : 0.72,
            transition: 'opacity 0.4s ease, transform 0.6s ease',
            transform: active ? 'scale(1.02)' : 'scale(1)',
          }}
        />
        {/* Multi-Stop Vignette Scrim */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(4, 3, 10, 0.85) 0%, rgba(4, 3, 10, 0.25) 30%, rgba(4, 3, 10, 0.85) 65%, rgba(4, 3, 10, 0.98) 100%)',
          }}
        />
        {/* Accent Glow Bleed */}
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            left: '20%',
            width: '60%',
            height: '40%',
            borderRadius: '50%',
            background: item.accent,
            opacity: active ? 0.28 : 0.08,
            filter: 'blur(50px)',
            pointerEvents: 'none',
            transition: 'opacity 0.4s ease',
          }}
        />
        {/* Interactive Specular Glare following mouse */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, ${glare.opacity}) 0%, transparent 60%)`,
            pointerEvents: 'none',
            transition: 'opacity 0.2s ease',
          }}
        />
      </div>

      {/* Top HUD Header: ID Tag & Live Status Pill */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '18px',
          right: '18px',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '9999px',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          <span
            style={{
              fontSize: '0.66rem',
              fontFamily: 'monospace',
              letterSpacing: '0.14em',
              color: '#94a3b8',
              fontWeight: 700,
            }}
          >
            SYS // 0{item.id}
          </span>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            padding: '4px 11px',
            borderRadius: '9999px',
            background: 'rgba(0, 0, 0, 0.68)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `1px solid ${item.accent}`,
            boxShadow: `0 0 12px ${item.glow}`,
          }}
        >
          <span
            style={{
              position: 'relative',
              display: 'inline-flex',
              width: '7px',
              height: '7px',
            }}
          >
            {active && (
              <span
                className="radar-pulse-ring"
                style={{
                  position: 'absolute',
                  inset: '-2px',
                  borderRadius: '50%',
                  background: item.accent,
                }}
              />
            )}
            <span
              style={{
                position: 'relative',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: item.accent,
                boxShadow: `0 0 10px ${item.accent}`,
              }}
            />
          </span>
          <span
            style={{
              fontSize: '0.64rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: item.accent,
            }}
          >
            Live Production
          </span>
        </div>
      </div>

      {/* Bottom Content Area */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          height: '100%',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '22px 24px',
        }}
      >
        {/* Metric Badges */}
        {metricEntries.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '10px',
              flexWrap: 'wrap',
            }}
          >
            {metricEntries.map(([key, val]) => (
              <span
                key={key}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '0.66rem',
                  fontFamily: 'monospace',
                }}
              >
                <span style={{ color: '#64748b' }}>{key}:</span>
                <span style={{ fontWeight: 700, color: item.accent }}>{val}</span>
              </span>
            ))}
          </div>
        )}

        {/* Project Title */}
        <h3
          style={{
            fontFamily: "var(--font-heading), 'Space Grotesk', sans-serif",
            fontSize: 'clamp(1.05rem, 3.8vw, 1.24rem)',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '6px',
            letterSpacing: '-0.02em',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.title}
        </h3>

        {/* Project Description */}
        <p
          style={{
            fontSize: '0.82rem',
            lineHeight: 1.55,
            color: '#cbd5e1',
            marginBottom: '12px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.desc}
        </p>

        {/* Tech Stack Chips */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginBottom: '16px',
          }}
        >
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: '0.68rem',
                padding: '3px 10px',
                borderRadius: '9999px',
                fontWeight: 600,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#e2e8f0',
                letterSpacing: '0.02em',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Button: Open Architecture Deep-Dive */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal(item);
          }}
          className="project-premium-cta"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '11px 16px',
            borderRadius: '12px',
            fontFamily: "var(--font-heading), 'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: '0.86rem',
            color: '#ffffff',
            background: active
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(255, 255, 255, 0.04)',
            border: active
              ? `1px solid ${item.accent}`
              : '1px solid rgba(255, 255, 255, 0.14)',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            pointerEvents: active ? 'auto' : 'none',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: active ? `0 0 15px ${item.glow}` : 'none',
          }}
        >
          <span>Explore Architecture</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function useCardSize() {
  const [size, setSize] = useState({ width: 480, height: 420, maxVisible: 5, spreadDeg: 44 });

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w < 480) setSize({ width: Math.min(320, w - 32), height: 410, maxVisible: 1, spreadDeg: 0 });
      else if (w < 640) setSize({ width: 330, height: 410, maxVisible: 3, spreadDeg: 18 });
      else if (w < 992) setSize({ width: 380, height: 420, maxVisible: 3, spreadDeg: 32 });
      else setSize({ width: 480, height: 425, maxVisible: 5, spreadDeg: 44 });
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  return size;
}

export default function Projects() {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: '-80px' });
  const { width, height, maxVisible, spreadDeg } = useCardSize();

  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedModalProject, setSelectedModalProject] = useState(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  // Filter projects by active category
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return PROJECTS;
    return PROJECTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const currentActiveProject = filteredProjects[activeProjectIndex] || filteredProjects[0] || PROJECTS[0];

  return (
    <section id="projects" className="position-relative overflow-hidden" style={{ padding: '140px 0' }}>
      {/* Dynamic Ambient Background Aura that shifts color with the active project */}
      <div
        className="position-absolute pointer-events-none"
        style={{
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -30%)',
          width: '700px',
          height: '500px',
          borderRadius: '50%',
          background: currentActiveProject?.accent || 'var(--teal)',
          opacity: 0.12,
          filter: 'blur(100px)',
          transition: 'background 0.8s ease, opacity 0.8s ease',
          zIndex: 0,
        }}
      />

      <div className="container position-relative" ref={containerRef} style={{ zIndex: 1 }}>
        {/* Section Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="mb-5 pb-2 text-center text-lg-start d-flex flex-column flex-lg-row justify-content-between align-items-lg-end"
        >
          <div style={{ maxWidth: '750px' }}>
            <span
              className="d-inline-flex align-items-center gap-2 py-2 px-4 mb-4 glass-panel rounded-full"
              style={{
                color: 'var(--teal)',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                border: '1px solid rgba(56, 189, 248, 0.25)',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--teal)',
                  boxShadow: '0 0 15px var(--teal)',
                }}
              />
              Production Case Studies
            </span>

            <h2
              className="fw-bold mb-4"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2.2rem, 4.6vw, 3.5rem)',
                letterSpacing: '-0.03em',
              }}
            >
              Engineered <span className="text-gradient">Architectures</span>
            </h2>

            <p
              className="fs-5 mb-0"
              style={{
                lineHeight: 1.7,
                color: 'var(--muted)',
                maxWidth: '620px',
                fontSize: '1.02rem',
              }}
            >
              Deep-tech deployments focusing on backend scalability, high-availability orchestration,
              and polished user experiences. Drag, click a side card, or use the arrow keys to browse.
            </p>
          </div>

          <motion.a
            href="https://github.com/Biswa-2003"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="btn-aurora d-none d-lg-flex mt-4 mt-lg-0"
            style={{ flexShrink: 0 }}
          >
            <svg fill="currentColor" viewBox="0 0 1024 1024" height="18" width="18">
              <path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9a127.5 127.5 0 0 1 38.1 91v112.5c.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" />
            </svg>
            <span>View All Repos</span>
          </motion.a>
        </motion.div>

        {/* Interactive Category Filter Pills */}
        <div className="d-flex flex-wrap justify-content-center justify-content-lg-start gap-2 mb-5">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            const count =
              cat.id === 'all'
                ? PROJECTS.length
                : PROJECTS.filter((p) => p.category === cat.id).length;

            return (
              <motion.button
                key={cat.id}
                type="button"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setActiveProjectIndex(0);
                }}
                className="btn d-inline-flex align-items-center gap-2"
                style={{
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.22) 0%, rgba(99, 102, 241, 0.25) 100%)'
                    : 'rgba(255, 255, 255, 0.04)',
                  border: isSelected
                    ? '1px solid var(--teal)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  color: isSelected ? '#ffffff' : 'var(--muted)',
                  boxShadow: isSelected ? '0 0 20px rgba(56, 189, 248, 0.35)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: isSelected ? 'var(--teal)' : 'var(--muted-2)',
                    boxShadow: isSelected ? '0 0 8px var(--teal)' : 'none',
                  }}
                />
                <span>{cat.label}</span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: 'monospace',
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    background: isSelected
                      ? 'rgba(56, 189, 248, 0.25)'
                      : 'rgba(255, 255, 255, 0.08)',
                    color: isSelected ? '#ffffff' : '#94a3b8',
                    fontWeight: 700,
                  }}
                >
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* 3D Animated Card Stack Viewport */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <CardStack
            items={filteredProjects}
            cardWidth={width}
            cardHeight={height}
            maxVisible={maxVisible}
            spreadDeg={spreadDeg}
            autoAdvance
            intervalMs={3500}
            pauseOnHover
            showDots
            onChangeIndex={(idx) => setActiveProjectIndex(idx)}
            renderCard={(item, state) => (
              <ProjectCard
                item={item}
                active={state.active}
                onOpenModal={(proj) => setSelectedModalProject(proj)}
              />
            )}
          />
        </motion.div>
      </div>

      {/* Architecture Deep-Dive Modal */}
      <AnimatePresence>
        {selectedModalProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(3, 2, 8, 0.85)',
              backdropFilter: 'blur(16px)',
              padding: 'clamp(10px, 3vw, 20px)',
            }}
            onClick={() => setSelectedModalProject(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 15 }}
              transition={{ duration: 0.25 }}
              style={{
                width: '100%',
                maxWidth: '650px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(18, 14, 34, 0.98) 0%, rgba(9, 7, 20, 0.98) 100%)',
                border: `1px solid ${selectedModalProject.accent}`,
                boxShadow: `0 30px 70px -15px rgba(0, 0, 0, 0.95), 0 0 40px ${selectedModalProject.glow}`,
                padding: 'clamp(18px, 4vw, 32px)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.12em',
                      padding: '3px 10px',
                      borderRadius: '9999px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: selectedModalProject.accent,
                      border: `1px solid ${selectedModalProject.accent}`,
                    }}
                  >
                    SYS // 0{selectedModalProject.id} &bull; PRODUCTION CASE STUDY
                  </span>
                  <h3 className="fw-bold mt-2 mb-1" style={{ fontSize: '1.5rem', color: '#ffffff' }}>
                    {selectedModalProject.title}
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }} className="mb-0">
                    {selectedModalProject.desc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedModalProject(null)}
                  className="btn btn-sm text-white"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '50%',
                    width: '34px',
                    height: '34px',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  &times;
                </button>
              </div>

              {/* Metrics Showcase */}
              <div className="d-flex gap-3 mb-4 flex-wrap">
                {selectedModalProject.metrics &&
                  Object.entries(selectedModalProject.metrics).map(([k, v]) => (
                    <div
                      key={k}
                      style={{
                        flex: '1 1 140px',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      <div style={{ fontSize: '0.72rem', color: 'var(--muted)', textTransform: 'uppercase' }}>
                        {k}
                      </div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: selectedModalProject.accent }}>
                        {v}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Architectural Highlights */}
              <h5 className="fw-bold text-white mb-3" style={{ fontSize: '0.95rem' }}>
                Architectural Engineering Decisions:
              </h5>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-4">
                {selectedModalProject.architecture?.map((pt, i) => (
                  <li key={i} className="d-flex gap-2 align-items-start" style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                    <span style={{ color: selectedModalProject.accent, marginTop: '2px' }}>&bull;</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>

              {/* Tech Stack */}
              <h5 className="fw-bold text-white mb-2" style={{ fontSize: '0.95rem' }}>
                Ecosystem & Technologies:
              </h5>
              <div className="d-flex flex-wrap gap-2 mb-4">
                {selectedModalProject.stack.split('·').map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: '0.75rem',
                      padding: '4px 11px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#e2e8f0',
                      fontWeight: 600,
                    }}
                  >
                    {t.trim()}
                  </span>
                ))}
              </div>

              {/* Action Link to GitHub */}
              <a
                href={selectedModalProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn w-100 d-flex align-items-center justify-content-center gap-2 py-3"
                style={{
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, var(--teal) 0%, var(--violet) 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  boxShadow: '0 8px 25px rgba(56, 189, 248, 0.35)',
                }}
              >
                <span>Inspect Repository Source on GitHub</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes projectScanline {
          0% { top: -5%; opacity: 0; }
          15% { opacity: 0.9; }
          85% { opacity: 0.9; }
          100% { top: 105%; opacity: 0; }
        }
        .project-scanline-laser {
          animation: projectScanline 3.4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
        }
        @keyframes radarPulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        .radar-pulse-ring {
          animation: radarPulse 1.8s cubic-bezier(0.2, 0.8, 0.4, 1) infinite;
        }
        .project-premium-cta:hover {
          background: rgba(56, 189, 248, 0.25) !important;
          border-color: #38bdf8 !important;
          color: #ffffff !important;
          box-shadow: 0 0 25px rgba(56, 189, 248, 0.5) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
}
