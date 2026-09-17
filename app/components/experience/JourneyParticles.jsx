'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';

export default function JourneyParticles() {
  const pointsRef = useRef(null);

  const { positions, colors } = useMemo(() => {
    const count = 120;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const c1 = new THREE.Color('#38bdf8');
    const c2 = new THREE.Color('#818cf8');
    const c3 = new THREE.Color('#c084fc');

    for (let i = 0; i < count; i++) {
      // Scatter particles along the valley and winding path
      pos[i * 3] = (Math.random() - 0.5) * 32;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12 + 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;

      const pick = Math.random();
      const c = pick < 0.5 ? c1 : pick < 0.8 ? c2 : c3;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group>
      {/* Background Starfield Sparkles */}
      <Sparkles
        count={90}
        scale={[36, 18, 20]}
        size={2.2}
        speed={0.25}
        color="#38bdf8"
        opacity={0.55}
      />
      <Sparkles
        count={60}
        scale={[28, 14, 16]}
        size={1.8}
        speed={0.18}
        color="#c084fc"
        opacity={0.45}
      />

      {/* Atmospheric Cosmic Dust Points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.075}
          vertexColors
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
