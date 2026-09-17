'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// 3 Milestone Station Configurations in 3D Space (120 deg apart)
const STATIONS = [
  {
    id: 'giet',
    title: 'GIET University',
    role: 'B.Tech CS & Engineering',
    year: '2020 – 2024',
    angle: (7 * Math.PI) / 6, // 210 deg
    radius: 3.2,
    color: '#38bdf8',
    glowColor: '#0284c7',
    glyph: '< / >',
    iconLabel: 'FOUNDATION',
  },
  {
    id: 'tech-mahindra',
    title: 'Tech Mahindra',
    role: 'Technical Engineer',
    year: '2024',
    angle: Math.PI / 2, // 90 deg
    radius: 3.2,
    color: '#6366f1',
    glowColor: '#4f46e5',
    glyph: '⚡ REPO',
    iconLabel: 'ENTERPRISE',
  },
  {
    id: 'triptales',
    title: 'Triptales Commercials',
    role: 'Full Stack Developer',
    year: '2024 – Present',
    angle: -Math.PI / 6, // -30 deg / 330 deg
    radius: 3.2,
    color: '#a855f7',
    glowColor: '#9333ea',
    glyph: '▲ PROD',
    iconLabel: 'CORE ARCH',
  },
];

// Central Quantum Chrono Core
function CentralQuantumCore({ activeId }) {
  const coreRef = useRef(null);
  const wireframeRef = useRef(null);
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const ring3Ref = useRef(null);

  const activeColor = useMemo(() => {
    if (activeId === 'giet') return new THREE.Color('#38bdf8');
    if (activeId === 'tech-mahindra') return new THREE.Color('#6366f1');
    return new THREE.Color('#a855f7');
  }, [activeId]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.45;
      coreRef.current.rotation.x = t * 0.25;
      const scale = 1 + Math.sin(t * 2.5) * 0.06;
      coreRef.current.scale.set(scale, scale, scale);
      coreRef.current.material.color.lerp(activeColor, 0.05);
      coreRef.current.material.emissive.lerp(activeColor, 0.05);
    }

    if (wireframeRef.current) {
      wireframeRef.current.rotation.y = -t * 0.35;
      wireframeRef.current.rotation.z = t * 0.2;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.6;
      ring1Ref.current.rotation.y = t * 0.3;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.5;
      ring2Ref.current.rotation.z = t * 0.4;
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = t * 0.7;
      ring3Ref.current.rotation.x = -t * 0.35;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Pulsing Faceted Icosahedron Core */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.9, 0]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={1.5}
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>

      {/* 2. Outer Geometric Wireframe Lattice */}
      <mesh ref={wireframeRef} scale={[1.25, 1.25, 1.25]}>
        <dodecahedronGeometry args={[0.9, 0]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Multi-Axis Concentric Quantum Gimbal Rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.4, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={1.8}
          metalness={0.9}
        />
      </mesh>

      <mesh ref={ring2Ref}>
        <torusGeometry args={[1.7, 0.016, 16, 64]} />
        <meshStandardMaterial
          color="#818cf8"
          emissive="#6366f1"
          emissiveIntensity={1.5}
          metalness={0.9}
        />
      </mesh>

      <mesh ref={ring3Ref}>
        <torusGeometry args={[2.0, 0.014, 16, 64]} />
        <meshBasicMaterial
          color="#c084fc"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Core Dynamic Point Light */}
      <pointLight color={activeId === 'giet' ? '#38bdf8' : activeId === 'tech-mahindra' ? '#6366f1' : '#a855f7'} intensity={7.0} distance={10} />
    </group>
  );
}

// Interactive 3D Milestone Hologram Station
function ChronoStation({ station, isSelected, onSelect }) {
  const meshRef = useRef(null);
  const ringRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  // Position along circle
  const x = Math.cos(station.angle) * station.radius;
  const z = Math.sin(station.angle) * station.radius * 0.9;
  const y = Math.sin(station.angle * 2) * 0.35;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.8;
      meshRef.current.rotation.x = t * 0.4;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -t * 1.2;
    }
  });

  return (
    <Float speed={2.0} rotationIntensity={0.2} floatIntensity={0.35}>
      <group position={[x, y, z]}>
        {/* 1. Base Energy Platform */}
        <mesh
          position={[0, -0.65, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(station.id);
          }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <cylinderGeometry args={[0.5, 0.6, 0.1, 32]} />
          <meshStandardMaterial
            color="#090e24"
            emissive={station.color}
            emissiveIntensity={isSelected || hovered ? 1.6 : 0.4}
            roughness={0.2}
            metalness={0.85}
          />
        </mesh>

        {/* Platform Glowing Energy Ring */}
        <mesh position={[0, -0.58, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.45, 0.54, 32]} />
          <meshBasicMaterial
            color={station.color}
            transparent
            opacity={isSelected || hovered ? 0.95 : 0.5}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* 2. Floating 3D Geometric Crystal Monolith */}
        <mesh
          ref={meshRef}
          position={[0, 0, 0]}
          scale={isSelected ? [1.2, 1.2, 1.2] : hovered ? [1.1, 1.1, 1.1] : [0.9, 0.9, 0.9]}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(station.id);
          }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <octahedronGeometry args={[0.42, 0]} />
          <meshStandardMaterial
            color={station.color}
            emissive={station.color}
            emissiveIntensity={isSelected ? 2.5 : hovered ? 2.0 : 1.1}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* Outer Orbital Gyro Ring */}
        <mesh ref={ringRef} position={[0, 0, 0]}>
          <torusGeometry args={[0.65, 0.014, 16, 36]} />
          <meshStandardMaterial
            color={station.color}
            emissive={station.color}
            emissiveIntensity={isSelected || hovered ? 2.2 : 0.8}
            metalness={0.9}
          />
        </mesh>

        {/* Vertical Holographic Light Beam */}
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.02, 0.15, 1.6, 16, 1, true]} />
          <meshBasicMaterial
            color={station.color}
            transparent
            opacity={isSelected ? 0.35 : hovered ? 0.25 : 0.1}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* 3. Floating 3D HTML Badge */}
        <Html
          position={[0, 1.1, 0]}
          center
          zIndexRange={[100, 0]}
          style={{ pointerEvents: 'auto', userSelect: 'none' }}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelect(station.id);
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              padding: '4px 10px',
              borderRadius: '9999px',
              background: isSelected
                ? 'rgba(6, 12, 34, 0.95)'
                : hovered
                ? 'rgba(12, 20, 50, 0.9)'
                : 'rgba(5, 8, 24, 0.85)',
              border: `1.5px solid ${isSelected ? station.color : hovered ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.2)'}`,
              boxShadow: isSelected
                ? `0 0 16px ${station.color}aa, 0 4px 14px rgba(0, 0, 0, 0.9)`
                : hovered
                ? `0 0 10px ${station.color}55, 0 2px 10px rgba(0, 0, 0, 0.7)`
                : '0 2px 8px rgba(0, 0, 0, 0.6)',
              color: '#ffffff',
              fontFamily: 'monospace',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(8px)',
              transform: isSelected ? 'scale(1.05)' : 'scale(0.95)',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: station.color,
                boxShadow: `0 0 6px ${station.color}`,
              }}
            />
            <span style={{ color: isSelected ? '#ffffff' : '#cbd5e1' }}>
              {station.title}
            </span>
            <span style={{ color: station.color, fontSize: '10px', opacity: 0.85 }}>
              • {station.year}
            </span>
          </div>
        </Html>

        {/* Local Point Light */}
        <pointLight
          color={station.color}
          intensity={isSelected ? 6.5 : hovered ? 4.5 : 2.0}
          distance={4.0}
        />
      </group>
    </Float>
  );
}

// Connective Quantum Energy Streams linking Stations to Core
function QuantumEnergyStreams({ activeId }) {
  const lines = useMemo(() => {
    return STATIONS.map((st) => {
      const x = Math.cos(st.angle) * st.radius;
      const z = Math.sin(st.angle) * st.radius * 0.9;
      const y = Math.sin(st.angle * 2) * 0.35;

      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x * 0.5, y * 0.5 + 0.5, z * 0.5),
        new THREE.Vector3(x, y - 0.65, z)
      );
      const points = curve.getPoints(36);
      const geo = new THREE.BufferGeometry().setFromPoints(points);

      return { id: st.id, geo, color: st.color };
    });
  }, []);

  return (
    <group>
      {lines.map((l) => (
        <line key={l.id} geometry={l.geo}>
          <lineBasicMaterial
            color={l.color}
            transparent
            opacity={activeId === l.id ? 0.85 : 0.25}
            blending={THREE.AdditiveBlending}
          />
        </line>
      ))}
    </group>
  );
}

// Camera Orbit and Parallax Rig
function CameraRig({ activeId }) {
  const targetRotation = useRef(0);
  const currentRotation = useRef(0);

  useFrame(({ camera, pointer }) => {
    // When a station is selected, glide camera towards station perspective
    if (activeId === 'giet') {
      targetRotation.current = Math.PI / 2 - (7 * Math.PI) / 6; // ~ -120 deg
    } else if (activeId === 'tech-mahindra') {
      targetRotation.current = 0; // facing front (90 deg station)
    } else if (activeId === 'triptales') {
      targetRotation.current = Math.PI / 2 - (-Math.PI / 6); // ~ 120 deg
    } else {
      targetRotation.current = 0;
    }

    currentRotation.current +=
      (targetRotation.current - currentRotation.current) * 0.04;

    // Pointer-driven subtle 3D tilt
    const parallaxX = pointer.x * 0.6;
    const parallaxY = pointer.y * 0.4;

    camera.position.x = Math.sin(currentRotation.current) * 7.0 + parallaxX;
    camera.position.z = Math.cos(currentRotation.current) * 7.0;
    camera.position.y = 1.8 + parallaxY;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function Experience3DCore({ activeId, onSelectMilestone }) {
  return (
    <div
      className="position-absolute w-100 h-100 pointer-events-auto"
      style={{ inset: 0, zIndex: 1 }}
    >
      <Canvas
        camera={{ position: [0, 1.8, 7.0], fov: 46 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.45} color="#dbeafe" />
        <directionalLight position={[6, 8, 4]} intensity={2.0} color="#38bdf8" />
        <directionalLight position={[-6, -6, -4]} intensity={1.6} color="#818cf8" />

        {/* Central Quantum Chrono Core */}
        <CentralQuantumCore activeId={activeId} />

        {/* Orbiting Milestone Hologram Stations */}
        {STATIONS.map((station) => (
          <ChronoStation
            key={station.id}
            station={station}
            isSelected={activeId === station.id}
            onSelect={onSelectMilestone}
          />
        ))}

        {/* Quantum Energy Streams */}
        <QuantumEnergyStreams activeId={activeId} />

        {/* Background Starfield & Floating Sparkles */}
        <Sparkles
          count={90}
          scale={[15, 12, 15]}
          size={2.0}
          speed={0.3}
          color="#38bdf8"
          opacity={0.65}
        />
        <Sparkles
          count={70}
          scale={[13, 10, 13]}
          size={1.6}
          speed={0.2}
          color="#c084fc"
          opacity={0.55}
        />

        {/* Smooth camera animation controller */}
        <CameraRig activeId={activeId} />
      </Canvas>
    </div>
  );
}
