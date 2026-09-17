'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { sceneTarget, SCENE_SECTIONS } from './sceneState';

gsap.registerPlugin(ScrollTrigger);

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;
const KEYS = ['camX', 'camY', 'camZ', 'objX', 'objY', 'rotY', 'rotX', 'hue', 'distort', 'scale', 'coreOpacity'];

export default function SmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      duration: 0.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: !reduceMotion,
      wheelMultiplier: 1.1,
      touchMultiplier: 1.2,
      syncTouch: false,
    });

    const sections = SCENE_SECTIONS
      .map((cfg) => ({ cfg, el: document.getElementById(cfg.id) }))
      .filter((s) => s.el);

    // Cache section centers to prevent forced layout reflow on every frame!
    let cachedCenters = [];
    const computeCenters = () => {
      if (!sections.length) return;
      cachedCenters = sections.map(({ el }) => el.offsetTop + el.offsetHeight / 2);
    };
    computeCenters();

    function updateScene(currentScroll) {
      if (!sections.length || !cachedCenters.length) return;
      const scrollCenter = (currentScroll !== undefined ? currentScroll : window.scrollY) + window.innerHeight / 2;

      let i = 0;
      while (i < cachedCenters.length - 1 && scrollCenter > cachedCenters[i + 1]) i++;
      const j = Math.min(i + 1, cachedCenters.length - 1);
      const rangeStart = cachedCenters[i];
      const rangeEnd = cachedCenters[j];
      const t = rangeEnd > rangeStart ? clamp((scrollCenter - rangeStart) / (rangeEnd - rangeStart), 0, 1) : 0;

      const a = sections[i].cfg;
      const b = sections[j].cfg;
      KEYS.forEach((k) => { sceneTarget[k] = lerp(a[k], b[k], t); });
    }

    lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      updateScene(e.scroll);
    });

    // Native scroll fallback for touch devices and keyboard nav
    const handleNativeScroll = () => {
      updateScene(window.scrollY);
    };
    window.addEventListener('scroll', handleNativeScroll, { passive: true });

    const tick = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(500, 33);

    updateScene(window.scrollY);
    ScrollTrigger.refresh();

    window.addEventListener('resize', computeCenters);
    ScrollTrigger.addEventListener('refresh', computeCenters);

    return () => {
      window.removeEventListener('scroll', handleNativeScroll);
      window.removeEventListener('resize', computeCenters);
      ScrollTrigger.removeEventListener('refresh', computeCenters);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
