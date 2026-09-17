'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function MountainEnvironment() {
  const wireframeRef = useRef(null);

  const { terrainGeometry, peakGeometry, cragGeometry, wireframeGeometry } = useMemo(() => {
    // 1. Broad mountain terrain in background
    const width = 60;
    const height = 30;
    const segX = 64;
    const segY = 36;
    const geo = new THREE.PlaneGeometry(width, height, segX, segY);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      // Summit peak slope on the right (x: 6.8, y: 2.5)
      const dSummit = Math.hypot(x - 6.8, y - 2.5);
      const summitBase = Math.max(0, 4.2 - dSummit * 0.65);

      // Low, gentle background ridges
      const r1 = Math.sin(x * 0.16) * Math.cos(y * 0.22) * 1.5;
      const r2 = Math.sin(x * 0.38 + 1.0) * Math.cos(y * 0.4) * 0.8;

      // Base slope rising gently in the distance
      const baseSlope = (y / height + 0.5) * 1.6;

      // Valley where the road runs
      const valley = Math.max(0, 1.4 - Math.abs(y + 2.5) * 0.35);

      const z = Math.max(0, summitBase * 0.95 + r1 + r2 + baseSlope - valley);
      pos.setZ(i, z);
    }

    geo.computeVertexNormals();

    // 2. Mountain Summit Peak (Upper Right)
    const peakGeo = new THREE.ConeGeometry(3.0, 5.0, 9, 6);
    const pPos = peakGeo.attributes.position;
    for (let j = 0; j < pPos.count; j++) {
      const px = pPos.getX(j);
      const py = pPos.getY(j);
      const pz = pPos.getZ(j);
      const rugged = Math.sin(px * 3.0) * Math.cos(pz * 3.0) * 0.22;
      pPos.setX(j, px + rugged);
      pPos.setZ(j, pz + rugged);
    }
    peakGeo.computeVertexNormals();

    // 3. Second Crag
    const cragGeo = peakGeo.clone();

    // 4. Subtle Wireframe overlay
    const wireGeo = geo.clone();

    return {
      terrainGeometry: geo,
      peakGeometry: peakGeo,
      cragGeometry: cragGeo,
      wireframeGeometry: wireGeo,
    };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (wireframeRef.current) {
      wireframeRef.current.material.opacity = 0.08 + Math.sin(t * 1.2) * 0.03;
    }
  });

  return (
    <group position={[0, -1.2, -2.8]}>
      {/* 1. Dark Rocky Mountain Terrain Substrate */}
      <mesh
        geometry={terrainGeometry}
        rotation={[-Math.PI / 2.3, 0, 0]}
        position={[0, -1.6, -1]}
      >
        <meshStandardMaterial
          color="#09071c"
          roughness={0.9}
          metalness={0.25}
          flatShading
          emissive="#04020f"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* 2. Very Faint Subtle Topographic Wireframe Accent (non-intrusive) */}
      <mesh
        ref={wireframeRef}
        geometry={wireframeGeometry}
        rotation={[-Math.PI / 2.3, 0, 0]}
        position={[0, -1.58, -0.98]}
      >
        <meshBasicMaterial
          color="#38bdf8"
          wireframe
          transparent
          opacity={0.09}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Rocky Summit Peak on Upper Right */}
      <mesh
        geometry={peakGeometry}
        position={[6.8, 1.2, -3.8]}
        rotation={[0.08, 0.35, -0.04]}
      >
        <meshStandardMaterial
          color="#0b0824"
          roughness={0.88}
          metalness={0.3}
          flatShading
          emissive="#120e36"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Summit Peak subtle wireframe rim */}
      <mesh
        geometry={peakGeometry}
        position={[6.8, 1.2, -3.8]}
        rotation={[0.08, 0.35, -0.04]}
        scale={[1.01, 1.01, 1.01]}
      >
        <meshBasicMaterial
          color="#38bdf8"
          wireframe
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 4. Second Crag */}
      <mesh
        geometry={cragGeometry}
        position={[9.5, 0.4, -5.5]}
        scale={[0.8, 0.8, 0.8]}
        rotation={[0.1, -0.2, 0.05]}
      >
        <meshStandardMaterial
          color="#070518"
          roughness={0.92}
          metalness={0.2}
          flatShading
          emissive="#0a0720"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}
