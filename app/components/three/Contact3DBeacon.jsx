'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';

// Glowing Beacon Quantum Core
function BeaconCore({ isInteracting, isTransmitting }) {
  const meshRef = useRef(null);
  const wireRef = useRef(null);
  const pulseRef = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Acceleration on interaction / transmission
    const speedMult = isTransmitting ? 4.5 : isInteracting ? 2.2 : 1.0;
    meshRef.current.rotation.y += delta * 0.45 * speedMult;
    meshRef.current.rotation.x += delta * 0.25 * speedMult;

    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * 0.35 * speedMult;
      wireRef.current.rotation.z += delta * 0.2 * speedMult;
    }

    // Breathing pulse
    pulseRef.current += delta * (isTransmitting ? 6 : isInteracting ? 3.5 : 2);
    const scale = 1 + Math.sin(pulseRef.current) * (isTransmitting ? 0.18 : 0.08);
    meshRef.current.scale.set(scale, scale, scale);
  });

  const coreColor = isTransmitting ? '#ffffff' : isInteracting ? '#38bdf8' : '#818cf8';
  const emissiveColor = isTransmitting ? '#38bdf8' : isInteracting ? '#0284c7' : '#6366f1';

  return (
    <group>
      {/* Faceted Holographic Core */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={emissiveColor}
          emissiveIntensity={isTransmitting ? 1.8 : isInteracting ? 1.2 : 0.7}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Outer Geometric Wireframe Lattice */}
      <mesh ref={wireRef}>
        <dodecahedronGeometry args={[1.35, 1]} />
        <meshBasicMaterial
          color={isTransmitting ? '#38bdf8' : '#38bdf8'}
          wireframe
          transparent
          opacity={isTransmitting ? 0.9 : 0.5}
        />
      </mesh>

      {/* Central Radiance Light */}
      <pointLight
        color={coreColor}
        intensity={isTransmitting ? 4.5 : isInteracting ? 2.5 : 1.4}
        distance={6}
        decay={2}
      />
    </group>
  );
}

// Multi-Axis Quantum Gimbal Rings
function GimbalRings({ isInteracting, isTransmitting }) {
  const ring1 = useRef(null);
  const ring2 = useRef(null);
  const ring3 = useRef(null);

  useFrame((_, delta) => {
    const mult = isTransmitting ? 3.5 : isInteracting ? 2.0 : 1.0;
    if (ring1.current) {
      ring1.current.rotation.x += delta * 0.5 * mult;
      ring1.current.rotation.y += delta * 0.3 * mult;
    }
    if (ring2.current) {
      ring2.current.rotation.y -= delta * 0.4 * mult;
      ring2.current.rotation.z += delta * 0.35 * mult;
    }
    if (ring3.current) {
      ring3.current.rotation.z += delta * 0.3 * mult;
      ring3.current.rotation.x -= delta * 0.25 * mult;
    }
  });

  return (
    <group>
      {/* Inner Ring (Teal / Cyan) */}
      <mesh ref={ring1}>
        <torusGeometry args={[1.75, 0.022, 16, 64]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Middle Ring (Violet / Indigo) */}
      <mesh ref={ring2} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.15, 0.025, 16, 64]} />
        <meshStandardMaterial
          color="#818cf8"
          emissive="#6366f1"
          emissiveIntensity={0.7}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Outer Ring (Electric Azure) */}
      <mesh ref={ring3} rotation={[0, Math.PI / 4, Math.PI / 6]}>
        <torusGeometry args={[2.55, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#60a5fa"
          emissive="#2563eb"
          emissiveIntensity={0.6}
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>
    </group>
  );
}

// Orbiting Signal Relay Nodes (Satellites)
function OrbitingNodes({ isInteracting, isTransmitting }) {
  const groupRef = useRef(null);
  const nodes = useMemo(() => [
    { radius: 1.9, speed: 1.1, offset: 0, size: 0.08, color: '#38bdf8' },
    { radius: 2.3, speed: 0.8, offset: Math.PI * 0.65, size: 0.07, color: '#818cf8' },
    { radius: 2.7, speed: 0.6, offset: Math.PI * 1.3, size: 0.09, color: '#60a5fa' },
    { radius: 2.0, speed: -0.9, offset: Math.PI * 0.3, size: 0.065, color: '#a78bfa' },
  ], []);

  const nodeRefs = useRef([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const mult = isTransmitting ? 3.0 : isInteracting ? 1.8 : 1.0;

    nodeRefs.current.forEach((ref, idx) => {
      if (!ref) return;
      const cfg = nodes[idx];
      const angle = t * cfg.speed * mult + cfg.offset;
      const x = Math.cos(angle) * cfg.radius;
      const z = Math.sin(angle) * cfg.radius;
      const y = Math.sin(angle * 2) * (cfg.radius * 0.35);
      ref.position.set(x, y, z);
    });
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <mesh
          key={i}
          ref={(el) => (nodeRefs.current[i] = el)}
        >
          <sphereGeometry args={[node.size, 16, 16]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={1.5}
            roughness={0.1}
          />
          <pointLight color={node.color} intensity={0.6} distance={1.5} />
        </mesh>
      ))}
    </group>
  );
}

// Expanding Translucent Transmission Pulses
function SignalTransmissionWaves({ isTransmitting }) {
  const wave1 = useRef(null);
  const wave2 = useRef(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const mult = isTransmitting ? 2.5 : 1.0;

    if (wave1.current) {
      const p1 = (t * 0.55 * mult) % 1;
      const scale1 = 0.8 + p1 * 2.8;
      wave1.current.scale.set(scale1, scale1, scale1);
      wave1.current.material.opacity = (1 - p1) * (isTransmitting ? 0.7 : 0.35);
    }

    if (wave2.current) {
      const p2 = ((t * 0.55 * mult) + 0.5) % 1;
      const scale2 = 0.8 + p2 * 2.8;
      wave2.current.scale.set(scale2, scale2, scale2);
      wave2.current.material.opacity = (1 - p2) * (isTransmitting ? 0.7 : 0.35);
    }
  });

  return (
    <group>
      <mesh ref={wave1}>
        <ringGeometry args={[0.9, 0.95, 64]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={wave2}>
        <ringGeometry args={[0.9, 0.95, 64]} />
        <meshBasicMaterial
          color="#818cf8"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// Camera & Parallax Control Rig
function BeaconParallaxRig({ isInteracting }) {
  const groupRef = useRef(null);

  useFrame(({ pointer, clock }) => {
    if (!groupRef.current) return;
    // Smooth lerp towards pointer with subtle idle breathing
    const idleY = Math.sin(clock.getElapsedTime() * 0.6) * 0.05;
    const targetX = -pointer.y * 0.35;
    const targetY = pointer.x * 0.45;

    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.05;
    groupRef.current.position.y += (idleY - groupRef.current.position.y) * 0.05;
  });

  return null;
}

export default function Contact3DBeacon({
  isInteracting = false,
  isTransmitting = false,
  height = 320,
}) {
  return (
    <div
      className="position-relative w-100"
      style={{
        height: `${height}px`,
        overflow: 'hidden',
        pointerEvents: 'auto',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5.8], fov: 48 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'auto' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 4]} intensity={1.2} color="#bae6fd" />
        <directionalLight position={[-6, -4, -2]} intensity={0.9} color="#c084fc" />

        <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.4}>
          <group>
            <BeaconCore isInteracting={isInteracting} isTransmitting={isTransmitting} />
            <GimbalRings isInteracting={isInteracting} isTransmitting={isTransmitting} />
            <OrbitingNodes isInteracting={isInteracting} isTransmitting={isTransmitting} />
            <SignalTransmissionWaves isTransmitting={isTransmitting} />
          </group>
        </Float>

        <Sparkles
          count={35}
          scale={5.5}
          size={1.8}
          speed={0.35}
          opacity={0.5}
          color="#38bdf8"
        />

        <BeaconParallaxRig isInteracting={isInteracting} />
      </Canvas>
    </div>
  );
}
