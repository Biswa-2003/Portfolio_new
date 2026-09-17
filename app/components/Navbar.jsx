'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import MagneticButton from './MagneticButton';

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  const sections = useMemo(() => [...LINKS.map((l) => l.id), 'contact'], []);

  const smoothScrollTo = (hash, offset = 70) => {
    if (hash === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setMobileMenuOpen(false);
      return;
    }
    const target = document.querySelector(hash);
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const absoluteY = rect.top + window.pageYOffset - offset;
    window.scrollTo({ top: absoluteY, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 25);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const click = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (!href || href === '#') return;
      e.preventDefault();
      smoothScrollTo(href, 70);
    };
    document.addEventListener('click', click);
    return () => document.removeEventListener('click', click);
  }, []);

  useEffect(() => {
    const handleScrollSpy = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.38;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          if (scrollPos >= el.offsetTop) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy();
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [sections]);

  return (
    <header
      ref={navRef}
      className={`cinema-nav-wrapper ${scrolled ? 'is-scrolled' : ''}`}
      aria-label="Site Header"
    >
      <div className="cinema-nav-container">
        {/* ====================================================
            LEFT: PERSONAL BRAND / LOGO
            ==================================================== */}
        <a
          className="cinema-brand text-decoration-none"
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            smoothScrollTo('#home');
          }}
          aria-label="Biswajit Panda — Back to top"
        >
          <div className="cinema-brand-monogram">
            <span>BP</span>
          </div>
          <div className="cinema-brand-text">
            <span className="cinema-brand-name">Biswajit Panda</span>
            <span className="cinema-brand-role">
              <span className="brand-status-dot" />
              <span>Full Stack Developer</span>
            </span>
          </div>
        </a>

        {/* ====================================================
            CENTER: MINIMAL EDITORIAL NAVIGATION LINKS
            ==================================================== */}
        <nav className="cinema-nav-center d-none d-lg-flex" aria-label="Main Menu">
          <ul className="cinema-nav-list m-0 p-0">
            {LINKS.map((l) => {
              const isActive = activeSection === l.id;
              return (
                <li key={l.id} className="cinema-nav-item">
                  <a
                    href={`#${l.id}`}
                    className={`cinema-nav-link ${isActive ? 'active' : ''}`}
                  >
                    {l.label}
                    {isActive && <span className="cinema-active-bar" />}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ====================================================
            RIGHT: PROFESSIONAL REFINED CTA BUTTON
            ==================================================== */}
        <div className="cinema-nav-right d-none d-lg-flex align-items-center">
          <MagneticButton
            href="#contact"
            className="cinema-cta-btn text-decoration-none"
          >
            <span>Get in Touch</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </MagneticButton>
        </div>

        {/* ====================================================
            MOBILE MENU TOGGLE
            ==================================================== */}
        <button
          className={`cinema-mobile-toggle d-lg-none ${mobileMenuOpen ? 'open' : ''}`}
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className="toggle-line line-1" />
          <span className="toggle-line line-2" />
        </button>
      </div>

      {/* ====================================================
          MOBILE DROPDOWN DRAWER
          ==================================================== */}
      {mobileMenuOpen && (
        <div className="cinema-mobile-drawer d-lg-none">
          <ul className="cinema-mobile-list m-0 p-0">
            {LINKS.map((l) => {
              const isActive = activeSection === l.id;
              return (
                <li key={l.id} className="cinema-mobile-item">
                  <a
                    href={`#${l.id}`}
                    className={`cinema-mobile-link ${isActive ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      smoothScrollTo(`#${l.id}`);
                    }}
                  >
                    <span>{l.label}</span>
                    {isActive && <span className="cinema-mobile-dot" />}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="cinema-mobile-cta-wrap mt-3 pt-3">
            <a
              href="#contact"
              className="cinema-cta-btn w-100 justify-content-center text-decoration-none"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollTo('#contact');
              }}
            >
              <span>Get in Touch</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
