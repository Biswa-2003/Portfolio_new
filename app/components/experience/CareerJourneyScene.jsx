'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import MountainEnvironment from './MountainEnvironment';
import CurvedJourneyPath from './CurvedJourneyPath';
import MilestoneObjects from './MilestoneObjects';
import SummitFlag from './SummitFlag';
import JourneyParticles from './JourneyParticles';
import CyberSky from './CyberSky';

function SceneCameraRig({ activeId }) {
  const currentPos = useRef(new THREE.Vector3(0, 0.5, 9.8));
  const currentLook = useRef(new THREE.Vector3(0, 0.05, 0));

  useFrame(({ camera, clock, pointer }) => {
    // Dynamic cinematic target points based on selected milestone
    let targetX = 0;
    let targetY = 0.5;
    let targetZ = 9.8;
    let lookX = 0;
    let lookY = 0.05;

    if (activeId === 'giet') {
      targetX = -2.6;
      targetY = -0.15;
      targetZ = 6.6;
      lookX = -4.8;
      lookY = -0.55;
    } else if (activeId === 'tech-mahindra') {
      targetX = 0.0;
      targetY = -0.05;
      targetZ = 6.4;
      lookX = 0.0;
      lookY = -0.45;
    } else if (activeId === 'triptales') {
      targetX = 2.6;
      targetY = 0.15;
      targetZ = 6.6;
      lookX = 4.8;
      lookY = -0.2;
    } else if (activeId === 'summit') {
      targetX = 4.8;
      targetY = 2.4;
      targetZ = 1.6;
      lookX = 7.2;
      lookY = 3.4;
    } else {
      // 'all' / Panorama Overview
      targetX = 0.0;
      targetY = 0.6;
      targetZ = 9.8;
      lookX = 0.4;
      lookY = -0.1;
    }

    // Smooth subtle pointer parallax
    const parallaxX = pointer.x * 0.35;
    const parallaxY = pointer.y * 0.15 + Math.sin(clock.getElapsedTime() * 0.4) * 0.04;

    const ease = 0.045;
    currentPos.current.x += (targetX + parallaxX - currentPos.current.x) * ease;
    currentPos.current.y += (targetY + parallaxY - currentPos.current.y) * ease;
    currentPos.current.z += (targetZ - currentPos.current.z) * ease;

    currentLook.current.x += (lookX - currentLook.current.x) * ease;
    currentLook.current.y += (lookY - currentLook.current.y) * ease;

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLook.current);
  });

  return null;
}

function SceneLighting() {
  return (
    <>
      {/* Deep Space Ambient Light */}
      <ambientLight intensity={0.5} color="#dbeafe" />

      {/* Mountain Rim Light (Cyan/Teal) */}
      <directionalLight position={[14, 12, 4]} intensity={3.2} color="#38bdf8" />

      {/* Valley Backlight (Indigo/Violet) */}
      <directionalLight position={[-12, 8, -6]} intensity={2.2} color="#818cf8" />

      {/* Highway Underglow Point Light */}
      <pointLight position={[0, -0.4, 2.5]} intensity={5.0} color="#38bdf8" distance={16} />

      {/* Summit Beacon Illumination */}
      <pointLight position={[7.2, 3.8, -4.5]} intensity={12} color="#67e8f9" distance={12} />
    </>
  );
}

export default function CareerJourneyScene({ activeId, onSelectMilestone }) {
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '200px' }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const dpr = useMemo(() => {
    if (typeof window === 'undefined') return 1;
    return Math.min(window.devicePixelRatio, 1.25);
  }, []);

  const reduceMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  return (
    <div
      ref={containerRef}
      className="position-absolute inset-0 w-100 h-100"
      style={{
        zIndex: 1,
        pointerEvents: 'auto',
      }}
    >
      {isInView && (
        <Canvas
          dpr={dpr}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          camera={{
            fov: 42,
            position: [0, 0.5, 9.8],
          }}
        >
          <color attach="background" args={['#04020a']} />
          <fog attach="fog" args={['#04020a', 8, 30]} />

          <SceneLighting />
          <SceneCameraRig activeId={activeId} />

          <CyberSky />
          <MountainEnvironment />
          <CurvedJourneyPath activeId={activeId} onSelectMilestone={onSelectMilestone} />
          <MilestoneObjects activeId={activeId} onSelectMilestone={onSelectMilestone} />
          <SummitFlag activeId={activeId} onSelectMilestone={onSelectMilestone} />
          <JourneyParticles />

          {!reduceMotion && (
            <EffectComposer multisampling={0} disableNormalPass>
              <Bloom
                intensity={0.45}
                luminanceThreshold={0.3}
                luminanceSmoothing={0.7}
              />
            </EffectComposer>
          )}
        </Canvas>
      )}
    </div>
  );
}
