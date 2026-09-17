'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Globe,
  LayoutGrid,
  Cpu,
  Zap,
  Database,
  Cloud,
  Sparkles,
} from 'lucide-react';
import SphereImageGrid from '@/components/ui/img-sphere';
import { FaReact, FaNodeJs, FaGithub, FaDatabase, FaJava } from 'react-icons/fa';
import {
  SiNextdotjs, SiPostgresql, SiRedux, SiExpress, SiCss3, SiBootstrap,
  SiJsonwebtokens, SiHtml5, SiVercel, SiVisualstudiocode, SiPostman,
  SiGit, SiEslint, SiGithubactions, SiDocker, SiOpenai, SiAnthropic, SiGooglecloud,
} from 'react-icons/si';
import { BsRobot } from 'react-icons/bs';

const GROUPS = [
  {
    key: 'languages',
    label: 'Core Languages',
    items: [
      { icon: <SiHtml5 />, name: 'HTML5', desc: 'Semantic Data Structuring' },
      { icon: <SiCss3 />, name: 'CSS3', desc: 'Responsive CSS Architecture' },
      { icon: <FaReact />, name: 'JavaScript', desc: 'ES6+ Logic & Async Paradigms' },
      { icon: <FaJava />, name: 'Java', desc: 'JVM Object-Oriented Pipelines' },
      { icon: <SiPostgresql />, name: 'SQL', desc: 'Relational Schema & Query Plans' },
    ],
  },
  {
    key: 'frontend',
    label: 'Frontend Ecology',
    items: [
      { icon: <FaReact />, name: 'React', desc: 'Component State & Concurrent Mode' },
      { icon: <SiNextdotjs />, name: 'Next.js', desc: 'SSR, SSG & App Router Architecture' },
      { icon: <SiRedux />, name: 'Redux', desc: 'Predictable Global State Management' },
      { icon: <SiBootstrap />, name: 'Bootstrap / CSS', desc: 'Grid Frameworks & Token Modularity' },
    ],
  },
  {
    key: 'backend',
    label: 'Backend & APIs',
    items: [
      { icon: <FaNodeJs />, name: 'Node.js', desc: 'Non-blocking Event-Driven Runtime' },
      { icon: <SiExpress />, name: 'Express', desc: 'RESTful API Routing & Middleware' },
      { icon: <SiJsonwebtokens />, name: 'JWT', desc: 'Stateless Cryptographic Auth' },
    ],
  },
  {
    key: 'database',
    label: 'Databases',
    items: [
      { icon: <SiPostgresql />, name: 'PostgreSQL', desc: 'ACID Transactions & JSONB Indexing' },
      { icon: <FaDatabase />, name: 'pgAdmin', desc: 'Query Optimization & Schema Analysis' },
    ],
  },
  {
    key: 'tools',
    label: 'DevOps & Tooling',
    items: [
      { icon: <SiGit />, name: 'Git', desc: 'Distributed Version Control & Rebase' },
      { icon: <FaGithub />, name: 'GitHub', desc: 'PRs, Review & Organization Workflows' },
      { icon: <SiDocker />, name: 'Docker', desc: 'Multi-stage Containerization' },
      { icon: <SiVisualstudiocode />, name: 'VS Code', desc: 'Integrated Development Environment' },
      { icon: <SiPostman />, name: 'Postman', desc: 'Automated Endpoint Testing & Mocking' },
      { icon: <SiVercel />, name: 'Vercel', desc: 'Edge Deployments & Serverless Functions' },
      { icon: <SiEslint />, name: 'ESLint', desc: 'Static Analysis & Code Quality Enforcement' },
      { icon: <SiGithubactions />, name: 'CI/CD', desc: 'Automated Continuous Integration Pipelines' },
    ],
  },
  {
    key: 'ai',
    label: 'AI Integrations & LLMs',
    items: [
      { icon: <SiOpenai />, name: 'ChatGPT / GPT-4o', desc: 'Multimodal Prompting & Function Calling' },
      { icon: <BsRobot />, name: 'Antigravity AI', desc: 'Autonomous Agentic Pipelines' },
      { icon: <SiAnthropic />, name: 'Claude 3', desc: 'Long-Context Reasoning & Artifacts' },
      { icon: <SiGooglecloud />, name: 'AI Tooling & RAG', desc: 'Embeddings, Vector Search & Agent Loops' },
    ],
  },
];

// Tech Ecosystem images for 3D Sphere
const TECH_SPHERE_BASE = [
  {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    alt: 'React.js',
    title: 'React.js',
    category: 'FRONTEND',
    description: 'Component architecture, concurrent rendering, virtual DOM reconciliation, and hooks.',
  },
  {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
    alt: 'Next.js',
    title: 'Next.js (App Router)',
    category: 'FULL STACK',
    description: 'React Server Components, edge SSR/SSG, dynamic route handlers, and streaming.',
  },
  {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    alt: 'TypeScript',
    title: 'TypeScript',
    category: 'CORE LANGUAGE',
    description: 'Strict compile-time type safety, resilient API contracts, and scalable refactoring.',
  },
  {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    alt: 'Node.js',
    title: 'Node.js',
    category: 'BACKEND RUNTIME',
    description: 'Non-blocking I/O event loops, microservices, asynchronous workers, and RESTful APIs.',
  },
  {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
    alt: 'PostgreSQL',
    title: 'PostgreSQL',
    category: 'DATABASE',
    description: 'Enterprise ACID transactions, relational indexing, query plans, and JSONB structures.',
  },
  {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
    alt: 'Docker',
    title: 'Docker Containers',
    category: 'DEVOPS & CLOUD',
    description: 'Multi-stage container builds, predictable reproducible environments, and CI/CD pipelines.',
  },
  {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
    alt: 'Tailwind CSS',
    title: 'Tailwind CSS',
    category: 'DESIGN SYSTEM',
    description: 'Utility-first modern CSS, atomic styling tokens, and responsive layout primitives.',
  },
  {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    alt: 'Python',
    title: 'Python',
    category: 'AI & DATA',
    description: 'Data engineering, LLM orchestration, model integration, and automation scripts.',
  },
  {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
    alt: 'Git',
    title: 'Git Version Control',
    category: 'WORKFLOW',
    description: 'Distributed branch management, atomic commits, pull requests, and semantic versioning.',
  },
  {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg',
    alt: 'Redux',
    title: 'Redux Toolkit',
    category: 'STATE MANAGEMENT',
    description: 'Predictable immutable global state management, normalized caching, and RTK Query.',
  },
  {
    src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60',
    alt: 'Generative AI',
    title: 'Generative AI & LLMs',
    category: 'INTELLIGENT SYSTEMS',
    description: 'OpenAI GPT-4, Anthropic Claude 3, structured function calling, and RAG pipelines.',
  },
  {
    src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60',
    alt: 'Cloud Architecture',
    title: 'AWS Cloud Systems',
    category: 'INFRASTRUCTURE',
    description: 'S3 storage, CloudFront CDN, serverless lambdas, and resilient cloud architecture.',
  },
];

// Generate 48 items to populate the Fibonacci sphere evenly
const SPHERE_IMAGES = [];
for (let i = 0; i < 48; i++) {
  const base = TECH_SPHERE_BASE[i % TECH_SPHERE_BASE.length];
  SPHERE_IMAGES.push({
    id: `tech-${i + 1}`,
    ...base,
    alt: `${base.alt} (${Math.floor(i / TECH_SPHERE_BASE.length) + 1})`,
  });
}

// Background Constellation Star Dots
const COSMIC_STARS = [
  { top: '12%', left: '15%', size: 2, delay: '0s', duration: '3.2s' },
  { top: '18%', left: '82%', size: 3, delay: '0.8s', duration: '4.1s' },
  { top: '28%', left: '26%', size: 2.5, delay: '1.4s', duration: '3.6s' },
  { top: '35%', left: '74%', size: 2, delay: '2.1s', duration: '4.5s' },
  { top: '48%', left: '12%', size: 3, delay: '0.4s', duration: '3.8s' },
  { top: '62%', left: '88%', size: 2.5, delay: '1.7s', duration: '4.2s' },
  { top: '70%', left: '19%', size: 2, delay: '2.5s', duration: '3.4s' },
  { top: '78%', left: '79%', size: 3, delay: '1.1s', duration: '3.9s' },
  { top: '85%', left: '32%', size: 2, delay: '0.6s', duration: '4.7s' },
  { top: '22%', left: '48%', size: 2.5, delay: '1.9s', duration: '3.5s' },
  { top: '88%', left: '60%', size: 2, delay: '2.3s', duration: '4.0s' },
  { top: '42%', left: '92%', size: 2.5, delay: '0.9s', duration: '3.3s' },
];

export default function Skills() {
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: '-100px' });
  const [active, setActive] = useState(GROUPS[0].key);
  const [viewMode, setViewMode] = useState('sphere');
  const [sphereSize, setSphereSize] = useState(720);

  const current = useMemo(() => GROUPS.find((g) => g.key === active) || GROUPS[0], [active]);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 380) setSphereSize(280);
      else if (w < 480) setSphereSize(310);
      else if (w < 768) setSphereSize(380);
      else if (w < 1200) setSphereSize(480);
      else if (w < 1440) setSphereSize(540);
      else setSphereSize(580);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const staggerContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariant = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'tween', duration: 0.4, ease: 'easeOut' } },
  };

  return (
    <section
      id="skills"
      className="position-relative skills-master-section"
      style={{ padding: '120px 0 100px 0', overflow: 'hidden' }}
    >
      {/* ====================================================
          CINEMATIC COSMIC BACKGROUND (Animated Nebula & Celestial Orbits)
          ==================================================== */}
      <div
        className="position-absolute pointer-events-none"
        style={{ inset: 0, zIndex: 0, overflow: 'hidden' }}
        aria-hidden="true"
      >
        {/* Deep Cosmic Gradient Base */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 50%, rgba(13, 17, 38, 0.6) 0%, rgba(3, 0, 20, 0.95) 75%, #02000d 100%)',
          }}
        />

        {/* Floating Ambient Cosmic Luminous Nodes */}
        <motion.div
          animate={{
            y: [-35, 35, -35],
            x: [-25, 25, -25],
            scale: [1, 1.2, 1],
            opacity: [0.18, 0.32, 0.18],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '15%',
            left: '8%',
            width: '520px',
            height: '520px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.32) 0%, rgba(37, 99, 235, 0.14) 40%, transparent 70%)',
            pointerEvents: 'none',
            willChange: 'transform, opacity',
          }}
        />

        <motion.div
          animate={{
            y: [40, -40, 40],
            x: [30, -30, 30],
            scale: [1.15, 0.95, 1.15],
            opacity: [0.14, 0.28, 0.14],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '8%',
            width: '560px',
            height: '560px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(99, 102, 241, 0.12) 40%, transparent 70%)',
            pointerEvents: 'none',
            willChange: 'transform, opacity',
          }}
        />

        {/* Central Core Galactic Nebula behind 3D sphere */}
        <motion.div
          animate={{
            scale: [0.95, 1.08, 0.95],
            opacity: [0.22, 0.36, 0.22],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '56%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'clamp(420px, 55vw, 820px)',
            height: 'clamp(420px, 55vw, 820px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(56, 189, 248, 0.26) 0%, rgba(99, 102, 241, 0.15) 35%, rgba(139, 92, 246, 0.06) 55%, transparent 72%)',
            pointerEvents: 'none',
            willChange: 'transform, opacity',
          }}
        />

        {/* Multi-Orbital Planetary Celestial Rings */}
        <svg
          style={{
            position: 'absolute',
            top: '56%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'clamp(620px, 80vw, 1150px)',
            height: 'clamp(620px, 80vw, 1150px)',
            pointerEvents: 'none',
          }}
          className="celestial-orbit-svg"
          viewBox="0 0 1000 1000"
          fill="none"
        >
          <ellipse cx="500" cy="500" rx="480" ry="215" transform="rotate(-26 500 500)" stroke="rgba(56, 189, 248, 0.22)" strokeWidth="1.2" strokeDasharray="6 14" />
          <ellipse cx="500" cy="500" rx="400" ry="180" transform="rotate(32 500 500)" stroke="rgba(139, 92, 246, 0.24)" strokeWidth="1.2" />
          <ellipse cx="500" cy="500" rx="320" ry="140" transform="rotate(-12 500 500)" stroke="rgba(56, 189, 248, 0.28)" strokeWidth="1.2" strokeDasharray="4 10" />
          <circle cx="260" cy="400" r="3" fill="#38bdf8" opacity="0.7" />
          <circle cx="740" cy="600" r="3" fill="#818cf8" opacity="0.7" />
          <circle cx="500" cy="285" r="2.5" fill="#38bdf8" opacity="0.6" />
        </svg>

        {/* Twinkling Cosmic Star Particles */}
        {COSMIC_STARS.map((star, i) => (
          <div
            key={`star-${i}`}
            style={{
              position: 'absolute',
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              borderRadius: '50%',
              backgroundColor: '#e0f2fe',
              boxShadow: `0 0 ${star.size * 3}px rgba(56, 189, 248, 0.8)`,
              animation: `cosmicTwinkle ${star.duration} ease-in-out infinite`,
              animationDelay: star.delay,
            }}
          />
        ))}

        {/* Subtle Cyber Grid Texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 35%, transparent 80%)',
            opacity: 0.5,
          }}
        />
      </div>

      <div className="container-fluid px-lg-5 position-relative" ref={containerRef} style={{ zIndex: 1 }}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-4 pb-2"
        >
          <span className="d-inline-block py-2 px-4 mb-3 rounded-full glass-panel" style={{ color: 'var(--teal)', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Technological Stack
          </span>
          <h2 className="fw-bold mb-3" style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', letterSpacing: '-0.03em' }}>
            The <span className="text-gradient">Technical Arsenal</span>
          </h2>
          <p className="mx-auto mb-4" style={{ maxWidth: '720px', fontSize: '1.12rem', color: '#a1a1aa', lineHeight: 1.7 }}>
            A high-performance architecture built on battle-tested frameworks and cutting-edge paradigms for enterprise-ready production.
          </p>

          {/* Interactive Mode Switcher */}
          <div className="d-inline-flex align-items-center gap-1 gap-sm-2 p-1 rounded-full glass-panel" style={{ background: '#050308', border: '1px solid rgba(56, 189, 248, 0.25)', maxWidth: '100%' }}>
            <button
              onClick={() => setViewMode('sphere')}
              className="btn btn-sm d-inline-flex align-items-center gap-1 gap-sm-2 border-0"
              style={{
                borderRadius: '9999px',
                padding: '7px clamp(12px, 3vw, 20px)',
                background: viewMode === 'sphere' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'transparent',
                color: viewMode === 'sphere' ? '#ffffff' : '#94a3b8',
                fontWeight: viewMode === 'sphere' ? 700 : 500,
                fontSize: 'clamp(0.78rem, 2.5vw, 0.85rem)',
                transition: 'all 0.25s ease',
              }}
            >
              <Globe size={14} />
              <span className="d-none d-sm-inline">3D Interactive Sphere</span>
              <span className="d-inline d-sm-none">3D Sphere</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className="btn btn-sm d-inline-flex align-items-center gap-1 gap-sm-2 border-0"
              style={{
                borderRadius: '9999px',
                padding: '7px clamp(12px, 3vw, 20px)',
                background: viewMode === 'grid' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'transparent',
                color: viewMode === 'grid' ? '#ffffff' : '#94a3b8',
                fontWeight: viewMode === 'grid' ? 700 : 500,
                fontSize: 'clamp(0.78rem, 2.5vw, 0.85rem)',
                transition: 'all 0.25s ease',
              }}
            >
              <LayoutGrid size={14} />
              <span className="d-none d-sm-inline">Categorized Grid</span>
              <span className="d-inline d-sm-none">Grid</span>
            </button>
          </div>
        </motion.div>

        {/* VIEW 1: Balanced 3D Celestial Orbit Theater */}
        {viewMode === 'sphere' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="skills-orbit-theater-layout">
              {/* LEFT FLANK: Floating Architectural Pillars */}
              <div className="skills-flank-column left">
                <div className="flank-axis-header">
                  <span className="flank-axis-index">01 // ARCHITECTURE</span>
                  <span className="flank-axis-dot" />
                </div>

                <div className="flank-capsules-group">
                  <div className="aero-capsule">
                    <div className="capsule-icon-gem"><Cpu size={16} /></div>
                    <div className="capsule-meta">
                      <div className="capsule-title-row">
                        <span className="capsule-name">Frontend Systems</span>
                        <span className="capsule-chip">Next 14 · React 18</span>
                      </div>
                      <span className="capsule-detail">Component systems, App Router & strict TypeScript</span>
                    </div>
                  </div>

                  <div className="aero-capsule">
                    <div className="capsule-icon-gem"><Zap size={16} /></div>
                    <div className="capsule-meta">
                      <div className="capsule-title-row">
                        <span className="capsule-name">Backend Runtime</span>
                        <span className="capsule-chip">Node · Express</span>
                      </div>
                      <span className="capsule-detail">REST microservices, JWT auth & async pipelines</span>
                    </div>
                  </div>

                  <div className="aero-capsule">
                    <div className="capsule-icon-gem"><Database size={16} /></div>
                    <div className="capsule-meta">
                      <div className="capsule-title-row">
                        <span className="capsule-name">Relational Data</span>
                        <span className="capsule-chip">PostgreSQL · ACID</span>
                      </div>
                      <span className="capsule-detail">Complex relational modeling, indexing & normalization</span>
                    </div>
                  </div>
                </div>

                <div className="flank-axis-footer">
                  <span className="axis-badge-pill">● LATENCY &lt; 50MS TARGET</span>
                </div>
              </div>

              {/* CENTER: Pure 3D Interactive Sphere */}
              <div className="skills-center-orbit">
                <SphereImageGrid
                  images={SPHERE_IMAGES}
                  containerSize={sphereSize}
                  sphereRadius={sphereSize * 0.38}
                  dragSensitivity={0.85}
                  momentumDecay={0.96}
                  maxRotationSpeed={6}
                  baseImageScale={0.13}
                  hoverScale={1.35}
                  perspective={1100}
                  autoRotate={true}
                  autoRotateSpeed={0.25}
                />
              </div>

              {/* RIGHT FLANK: Floating System Capabilities */}
              <div className="skills-flank-column right">
                <div className="flank-axis-header">
                  <span className="flank-axis-index">02 // CAPABILITIES</span>
                  <span className="flank-axis-dot" />
                </div>

                <div className="flank-capsules-group">
                  <div className="aero-capsule">
                    <div className="capsule-icon-gem"><Cloud size={16} /></div>
                    <div className="capsule-meta">
                      <div className="capsule-title-row">
                        <span className="capsule-name">Cloud &amp; DevOps</span>
                        <span className="capsule-chip">Docker · AWS</span>
                      </div>
                      <span className="capsule-detail">Containerized environments &amp; CI/CD deployment</span>
                    </div>
                  </div>

                  <div className="aero-capsule">
                    <div className="capsule-icon-gem"><BsRobot size={16} /></div>
                    <div className="capsule-meta">
                      <div className="capsule-title-row">
                        <span className="capsule-name">Applied AI Systems</span>
                        <span className="capsule-chip">GPT-4 · Claude 3</span>
                      </div>
                      <span className="capsule-detail">Structured function calling &amp; RAG agent workflows</span>
                    </div>
                  </div>

                  <div className="aero-capsule">
                    <div className="capsule-icon-gem"><Sparkles size={16} /></div>
                    <div className="capsule-meta">
                      <div className="capsule-title-row">
                        <span className="capsule-name">Fluid Interactions</span>
                        <span className="capsule-chip">GSAP · Framer</span>
                      </div>
                      <span className="capsule-detail">Scroll-driven physics, micro-interactions &amp; 60 FPS</span>
                    </div>
                  </div>
                </div>

                <div className="flank-axis-footer">
                  <span className="axis-badge-pill">● 99.9% PRODUCTION READY</span>
                </div>
              </div>
            </div>

            {/* Bottom Architecture Protocol Telemetry Badges */}
            <div className="d-none d-md-flex flex-wrap justify-content-center align-items-center gap-3 mt-4 pt-2">
              <span className="glass-panel px-3 py-1.5" style={{ borderRadius: '9999px', fontSize: '0.74rem', fontFamily: 'monospace', color: '#94a3b8', border: '1px solid rgba(56, 189, 248, 0.18)' }}>
                ⚡ HIGH CONCURRENCY ENGINE
              </span>
              <span className="glass-panel px-3 py-1.5" style={{ borderRadius: '9999px', fontSize: '0.74rem', fontFamily: 'monospace', color: '#94a3b8', border: '1px solid rgba(56, 189, 248, 0.18)' }}>
                🔒 TLS 1.3 &amp; JWT CRYPTOGRAPHIC AUTH
              </span>
              <span className="glass-panel px-3 py-1.5" style={{ borderRadius: '9999px', fontSize: '0.74rem', fontFamily: 'monospace', color: '#94a3b8', border: '1px solid rgba(56, 189, 248, 0.18)' }}>
                🤖 AUTONOMOUS AGENTIC LOOPS
              </span>
              <span className="glass-panel px-3 py-1.5" style={{ borderRadius: '9999px', fontSize: '0.74rem', fontFamily: 'monospace', color: '#94a3b8', border: '1px solid rgba(56, 189, 248, 0.18)' }}>
                🌐 GLOBAL EDGE CDN ARCHITECTURE
              </span>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: Clean Categorized Grid */}
        {viewMode === 'grid' && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="d-flex flex-wrap justify-content-center gap-2 mb-5"
            >
              {GROUPS.map((g) => {
                const isActive = active === g.key;
                return (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={g.key}
                    className="position-relative border-0"
                    onClick={() => setActive(g.key)}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '100px',
                      background: isActive ? 'linear-gradient(120deg, var(--teal), var(--violet))' : 'transparent',
                      color: isActive ? '#050308' : 'var(--muted)',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.85rem',
                      transition: 'color 0.2s ease',
                      cursor: 'pointer',
                    }}
                  >
                    {g.label}
                  </motion.button>
                );
              })}
            </motion.div>

            <motion.div
              key={active}
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="row g-4"
              style={{ minHeight: '320px' }}
            >
              {current.items.map((it, i) => (
                <motion.div key={`${it.name}-${i}`} variants={itemVariant} className="col-12 col-sm-6 col-lg-4">
                  <motion.div
                    whileHover={{ y: -8, boxShadow: '0 20px 40px var(--secondary-glow)' }}
                    className="h-100 p-4 glass-panel d-flex align-items-start gap-3"
                    style={{ borderRadius: '16px', position: 'relative', overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        width: '60px',
                        height: '60px',
                        background: 'var(--secondary-glow)',
                        filter: 'blur(30px)',
                        opacity: 0.6,
                      }}
                    />
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: '58px',
                        height: '58px',
                        borderRadius: '14px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--border)',
                        color: 'var(--teal)',
                        fontSize: '1.7rem',
                        flexShrink: 0,
                      }}
                    >
                      {it.icon}
                    </div>
                    <div>
                      <h5 className="fw-bold mb-1" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}>
                        {it.name}
                      </h5>
                      <p className="mb-0" style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.6 }}>
                        {it.desc}
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
