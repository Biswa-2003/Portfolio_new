'use client';

import { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sparkles, Float } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import { sceneTarget, pointer } from '../../lib/sceneState';

const TEAL = new THREE.Color('#38bdf8');
const VIOLET = new THREE.Color('#6366f1');
const PINK = new THREE.Color('#8b5cf6');

function hueColor(t) {
  const c = new THREE.Color();
  if (t < 0.5) c.copy(TEAL).lerp(VIOLET, t / 0.5);
  else c.copy(VIOLET).lerp(PINK, (t - 0.5) / 0.5);
  return c;
}

function CameraRig() {
  const current = useRef({ x: 0, y: 0, z: 10.5, px: 0, py: 0 });

  useFrame(({ camera, clock }, delta) => {
    const t = current.current;
    // Delta-time based rapid damping: immediate, lockstep scroll tracking without lag
    const factor = 1 - Math.exp(-22 * Math.min(delta, 0.1));

    t.x += (sceneTarget.camX - t.x) * factor;
    t.y += (sceneTarget.camY - t.y) * factor;
    t.z += (sceneTarget.camZ - t.z) * factor;

    // Buttery-smooth lerped pointer parallax
    t.px += (pointer.x * 0.35 - t.px) * factor;
    t.py += (pointer.y * 0.22 - t.py) * factor;
    const bob = Math.sin(clock.elapsedTime * 0.35) * 0.05;

    camera.position.x = t.x + t.px;
    camera.position.y = t.y + t.py + bob;
    camera.position.z = t.z;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function HoloCore() {
  const coreRef = useRef(null);
  const wireRef = useRef(null);
  const ringRef = useRef(null);
  const groupRef = useRef(null);
  const rot = useRef({ y: 0, x: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const scale = useRef(1);
  const opacity = useRef(1);

  useFrame((_, delta) => {
    const factor = 1 - Math.exp(-22 * Math.min(delta, 0.1));
    rot.current.y += (sceneTarget.rotY - rot.current.y) * factor;
    rot.current.x += (sceneTarget.rotX - rot.current.x) * factor;
    pos.current.x += (sceneTarget.objX - pos.current.x) * factor;
    pos.current.y += (sceneTarget.objY - pos.current.y) * factor;
    scale.current += (sceneTarget.scale - scale.current) * factor;
    opacity.current += (sceneTarget.coreOpacity - opacity.current) * factor;

    if (groupRef.current) {
      groupRef.current.rotation.y = rot.current.y;
      groupRef.current.rotation.x = rot.current.x;
      groupRef.current.position.set(pos.current.x, pos.current.y, 0);
      groupRef.current.scale.setScalar(scale.current);
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * 0.12;
      wireRef.current.rotation.x += delta * 0.06;
      if (wireRef.current.material) {
        wireRef.current.material.opacity = opacity.current * 0.25;
      }
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.15;
      if (ringRef.current.material) {
        ringRef.current.material.opacity = opacity.current * 0.35;
      }
    }
    if (coreRef.current) {
      const mat = coreRef.current.material;
      mat.distort = sceneTarget.distort;
      const col = hueColor(sceneTarget.hue);
      mat.color = col;
      mat.opacity = opacity.current;
      mat.emissive = col;
      mat.emissiveIntensity = 0.28;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.4}>
        <mesh ref={coreRef}>
          <icosahedronGeometry args={[1.7, 8]} />
          <MeshDistortMaterial
            transparent
            roughness={0.28}
            metalness={0.5}
            distort={0.25}
            speed={1.2}
          />
        </mesh>
        <mesh ref={wireRef} scale={1.28}>
          <icosahedronGeometry args={[1.7, 2]} />
          <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.05} />
        </mesh>
        <mesh ref={ringRef} rotation={[Math.PI / 2.6, 0, 0]}>
          <ringGeometry args={[2.35, 2.38, 64]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.05} side={THREE.DoubleSide} />
        </mesh>
      </Float>
    </group>
  );
}

function AuroraLights() {
  const l1 = useRef(null);
  const l2 = useRef(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (l1.current) {
      l1.current.position.x = Math.sin(t * 0.3) * 5;
      l1.current.position.z = Math.cos(t * 0.3) * 5;
    }
    if (l2.current) {
      l2.current.position.x = Math.cos(t * 0.22) * 6;
      l2.current.position.y = Math.sin(t * 0.22) * 3;
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight ref={l1} position={[5, 2, 5]} intensity={18} color="#38bdf8" distance={16} />
      <pointLight ref={l2} position={[-5, -2, 3]} intensity={14} color="#8b5cf6" distance={16} />
      <pointLight position={[0, 4, -4]} intensity={12} color="#6366f1" distance={16} />
    </>
  );
}

function PointerTracker() {
  useEffect(() => {
    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
  return null;
}

export default function AuroraScene() {
  const dpr = useMemo(() => (typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.25) : 1), []);
  const reduceMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  return (
    <div className="aurora-fixed-canvas" aria-hidden="true">
      <PointerTracker />
      <Canvas
        dpr={dpr}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        camera={{ fov: 45, position: [0, 0, 10.5] }}
      >
        <color attach="background" args={['#050308']} />
        <fog attach="fog" args={['#050308', 8, 20]} />
        <AuroraLights />
        <HoloCore />
        <Sparkles count={35} scale={9} size={1.8} speed={0.2} color="#6366f1" opacity={0.35} />
        <Sparkles count={20} scale={12} size={1.2} speed={0.12} color="#38bdf8" opacity={0.25} />
        <CameraRig />
        {!reduceMotion && (
          <EffectComposer multisampling={0} disableNormalPass>
            <Bloom intensity={0.4} luminanceThreshold={0.3} luminanceSmoothing={0.7} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
