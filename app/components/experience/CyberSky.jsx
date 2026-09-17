'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CyberSky() {
  const starsRef = useRef(null);

  const starPositions = useMemo(() => {
    const count = 160;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 44;
      pos[i * 3 + 1] = Math.random() * 18 - 2;
      pos[i * 3 + 2] = -10 - Math.random() * 16;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = clock.getElapsedTime() * 0.008;
    }
  });

  return (
    <group>
      {/* Soft Distant Cosmic Sky Sparkles */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={starPositions.length / 3}
            array={starPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          color="#38bdf8"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Subtle Atmospheric Nebula Glow in Top Center */}
      <mesh position={[0, 4.0, -16]}>
        <planeGeometry args={[32, 14]} />
        <meshBasicMaterial
          color="#1e1b4b"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
