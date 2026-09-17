'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export default function SummitFlag({ activeId, onSelectMilestone }) {
  const isSelected = activeId === 'summit';
  const flagGeoRef = useRef(null);
  const beaconRef = useRef(null);
  const beamRef = useRef(null);

  // Waving flag cloth physics
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (flagGeoRef.current) {
      const pos = flagGeoRef.current.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        // Amplitude grows towards the fly of the flag (away from flagpole at x = -0.32)
        const factor = Math.max(0, (x + 0.32) / 0.65);
        const wave = Math.sin(t * 4.5 + x * 5.0) * 0.07 * factor;
        const ripple = Math.cos(t * 3.2 + pos.getY(i) * 6.0) * 0.03 * factor;
        pos.setZ(i, wave + ripple);
      }
      pos.needsUpdate = true;
    }

    if (beamRef.current) {
      beamRef.current.material.opacity = (isSelected ? 0.6 : 0.42) + Math.sin(t * 3.0) * 0.12;
    }

    if (beaconRef.current) {
      beaconRef.current.intensity = (isSelected ? 12.0 : 7.0) + Math.sin(t * 4.0) * 2.0;
    }
  });

  return (
    <group position={[6.8, 2.7, -3.8]}>
      {/* 1. Atmospheric Cyan Laser Beam rising from summit to space */}
      <mesh ref={beamRef} position={[0, 5.0, 0]}>
        <cylinderGeometry args={[0.04, 0.28, 10.0, 16, 1, true]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.45}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Core Intense White Laser Ray */}
      <mesh position={[0, 5.0, 0]}>
        <cylinderGeometry args={[0.012, 0.035, 10.0, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
      </mesh>

      {/* 2. Sleek Metallic Flagpole */}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.02, 0.028, 1.48, 16]} />
        <meshStandardMaterial
          color="#e2e8f0"
          metalness={0.9}
          roughness={0.15}
          emissive="#38bdf8"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Golden/White Glowing Spherical Finial on top */}
      <mesh position={[0, 1.48, 0]}>
        <sphereGeometry args={[0.042, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* 3. Waving Glowing Cyan Flag Banner */}
      <mesh position={[0.33, 1.2, 0]}>
        <planeGeometry ref={flagGeoRef} args={[0.65, 0.42, 16, 10]} />
        <meshStandardMaterial
          color="#0284c7"
          emissive="#38bdf8"
          emissiveIntensity={isSelected ? 3.0 : 2.0}
          roughness={0.25}
          metalness={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Flag glowing wireframe edge */}
      <mesh position={[0.33, 1.2, 0]}>
        <planeGeometry args={[0.65, 0.42, 4, 3]} />
        <meshBasicMaterial
          color="#bae6fd"
          wireframe
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 4. Pedestal Rock Base Platform */}
      <mesh
        position={[0, 0.04, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectMilestone?.('summit');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          if (typeof document !== 'undefined') document.body.style.cursor = 'auto';
        }}
      >
        <cylinderGeometry args={[0.5, 0.65, 0.12, 24]} />
        <meshStandardMaterial
          color="#070b1e"
          emissive="#0c4a6e"
          emissiveIntensity={isSelected ? 1.6 : 0.8}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Pedestal Glowing Energy Ring */}
      <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.45, 0.54, 32]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={isSelected ? 1.0 : 0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 5. Handwritten 'Still Building...' Annotation (matches reference image) */}
      <Html
        position={[0.55, 1.45, 0]}
        center
        distanceFactor={11}
        zIndexRange={[100, 0]}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: '26px',
            lineHeight: 1.08,
            fontWeight: 700,
            color: '#67e8f9',
            textShadow: '0 0 16px rgba(56, 189, 248, 0.9), 0 0 32px rgba(56, 189, 248, 0.5)',
            transform: 'rotate(-7deg)',
            whiteSpace: 'nowrap',
            letterSpacing: '0.03em',
            filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.9))',
          }}
        >
          Still
          <br />
          Building...
        </div>
      </Html>

      {/* Radiant Summit Point Light illuminating the peak */}
      <pointLight
        ref={beaconRef}
        position={[0, 1.2, 0]}
        color="#38bdf8"
        intensity={8.0}
        distance={12}
      />
    </group>
  );
}
