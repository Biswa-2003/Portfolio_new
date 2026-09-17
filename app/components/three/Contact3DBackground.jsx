'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';

// 3D Undulating Quantum Particle Wave Field
function QuantumParticleWave() {
  const pointsRef = useRef(null);
  const countX = 42;
  const countZ = 42;
  const numPoints = countX * countZ;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(numPoints * 3);
    const col = new Float32Array(numPoints * 3);
    const cCyan = new THREE.Color('#38bdf8');
    const cIndigo = new THREE.Color('#6366f1');
    const cViolet = new THREE.Color('#a855f7');

    let i = 0;
    for (let ix = 0; ix < countX; ix++) {
      for (let iz = 0; iz < countZ; iz++) {
        // Position on horizontal plane
        pos[i * 3] = (ix - countX / 2) * 0.52;
        pos[i * 3 + 1] = -1.8;
        pos[i * 3 + 2] = (iz - countZ / 2) * 0.52 - 3.5;

        // Gradient color across field
        const t = (ix / countX) * 0.6 + (iz / countZ) * 0.4;
        const color = new THREE.Color();
        if (t < 0.5) {
          color.copy(cCyan).lerp(cIndigo, t / 0.5);
        } else {
          color.copy(cIndigo).lerp(cViolet, (t - 0.5) / 0.5);
        }

        col[i * 3] = color.r;
        col[i * 3 + 1] = color.g;
        col[i * 3 + 2] = color.b;

        i++;
      }
    }
    return [pos, col];
  }, [numPoints]);

  useFrame(({ clock, pointer }) => {
    if (!pointsRef.current) return;
    const time = clock.getElapsedTime() * 0.75;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const array = posAttr.array;

    let i = 0;
    for (let ix = 0; ix < countX; ix++) {
      for (let iz = 0; iz < countZ; iz++) {
        const idx = i * 3 + 1;
        const x = array[i * 3];
        const z = array[i * 3 + 2];

        // Smooth wave harmonics
        const w1 = Math.sin(x * 0.32 + time) * 0.65;
        const w2 = Math.cos(z * 0.32 + time * 0.8) * 0.55;
        const w3 = Math.sin((x + z) * 0.22 + time * 1.1) * 0.35;

        // Subtle interactive pointer ripple
        const dx = x - pointer.x * 6;
        const dz = z - (-pointer.y * 6 - 3.5);
        const dist = Math.sqrt(dx * dx + dz * dz);
        const mouseRipple = Math.sin(dist * 1.2 - time * 2) * Math.exp(-dist * 0.22) * 0.45;

        array[idx] = -1.8 + w1 + w2 + w3 + mouseRipple;
        i++;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={numPoints}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={numPoints}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.075}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Floating 3D Geometric Nodes in distant background
function FloatingNodes() {
  const g1 = useRef(null);
  const g2 = useRef(null);
  const g3 = useRef(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (g1.current) {
      g1.current.rotation.x = t * 0.15;
      g1.current.rotation.y = t * 0.2;
    }
    if (g2.current) {
      g2.current.rotation.y = -t * 0.18;
      g2.current.rotation.z = t * 0.12;
    }
    if (g3.current) {
      g3.current.rotation.x = t * 0.12;
      g3.current.rotation.z = -t * 0.16;
    }
  });

  return (
    <>
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={g1} position={[-7, 2, -6]}>
          <icosahedronGeometry args={[1.2, 1]} />
          <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.22} />
        </mesh>
      </Float>

      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh ref={g2} position={[8, 3, -8]}>
          <dodecahedronGeometry args={[1.5, 0]} />
          <meshBasicMaterial color="#818cf8" wireframe transparent opacity={0.18} />
        </mesh>
      </Float>

      <Float speed={1.0} rotationIntensity={0.25} floatIntensity={0.4}>
        <mesh ref={g3} position={[0, 4.5, -9]}>
          <octahedronGeometry args={[1.1, 0]} />
          <meshBasicMaterial color="#c084fc" wireframe transparent opacity={0.2} />
        </mesh>
      </Float>
    </>
  );
}

// Subtle camera parallax responsive to pointer
function BackgroundCameraRig() {
  useFrame(({ camera, pointer }) => {
    // Smooth lerping to pointer position for 3D depth parallax
    const targetX = pointer.x * 1.2;
    const targetY = -pointer.y * 0.8 + 2.2;
    camera.position.x += (targetX - camera.position.x) * 0.035;
    camera.position.y += (targetY - camera.position.y) * 0.035;
    camera.lookAt(0, -0.6, -3.5);
  });
  return null;
}

export default function Contact3DBackground() {
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '250px' }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="position-absolute pointer-events-none"
      style={{
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        opacity: 0.88,
      }}
      aria-hidden="true"
    >
      {isInView && (
        <Canvas
          dpr={1}
          camera={{ position: [0, 2.2, 7.5], fov: 52 }}
          gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[6, 8, 4]} intensity={0.8} color="#38bdf8" />
          <directionalLight position={[-6, -4, -2]} intensity={0.6} color="#818cf8" />

          <QuantumParticleWave />
          <FloatingNodes />

          <Sparkles
            count={30}
            scale={18}
            size={1.6}
            speed={0.3}
            opacity={0.4}
            color="#38bdf8"
          />

          <BackgroundCameraRig />
        </Canvas>
      )}
    </div>
  );
}
