'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// =========================================================================
// MILESTONE 1: Premium Holographic 3D Code Gem (< />)
// =========================================================================
function CodeGemObject({ isSelected, onSelect }) {
  const groupRef = useRef(null);
  const coreRef = useRef(null);
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);

  useFrame((_, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.5;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.7;
      ring1Ref.current.rotation.x += delta * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.6;
      ring2Ref.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <Float speed={2.0} rotationIntensity={0.2} floatIntensity={0.35}>
      <group
        position={[-5.5, -0.65, 0.6]}
        ref={groupRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          if (typeof document !== 'undefined') document.body.style.cursor = 'auto';
        }}
      >
        {/* Core Multi-faceted Cyan Prism */}
        <mesh ref={coreRef}>
          <octahedronGeometry args={[0.38, 0]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#38bdf8"
            emissiveIntensity={isSelected ? 2.4 : 0.9}
            roughness={0.15}
            metalness={0.85}
          />
        </mesh>

        {/* 3D Modelled Glowing Code Symbol: Left Bracket '<' */}
        <group position={[-0.14, 0, 0.28]} rotation={[0, 0, Math.PI / 4]}>
          <mesh position={[0, 0.06, 0]}>
            <boxGeometry args={[0.024, 0.12, 0.024]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.06, 0, 0]}>
            <boxGeometry args={[0.12, 0.024, 0.024]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* 3D Modelled Glowing Code Symbol: Slash '/' */}
        <mesh position={[0, 0, 0.28]} rotation={[0, 0, -Math.PI / 6]}>
          <boxGeometry args={[0.022, 0.18, 0.022]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>

        {/* 3D Modelled Glowing Code Symbol: Right Bracket '>' */}
        <group position={[0.14, 0, 0.28]} rotation={[0, 0, -Math.PI * 0.75]}>
          <mesh position={[0, 0.06, 0]}>
            <boxGeometry args={[0.024, 0.12, 0.024]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.06, 0, 0]}>
            <boxGeometry args={[0.12, 0.024, 0.024]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Inner Gyroscopic Halo Ring */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[0.48, 0.016, 16, 32]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={isSelected ? 2.2 : 1.4}
            metalness={0.9}
          />
        </mesh>

        {/* Outer Orbital Orbit Ring */}
        <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[0.62, 0.014, 16, 36]} />
          <meshBasicMaterial color="#bae6fd" transparent opacity={isSelected ? 0.9 : 0.65} />
        </mesh>

        {/* Dynamic Light Pool under the object */}
        <pointLight color="#38bdf8" intensity={isSelected ? 7.0 : 3.0} distance={3.5} />
      </group>
    </Float>
  );
}

// =========================================================================
// MILESTONE 2: Premium 3D Isometric Tech Core
// =========================================================================
function IsometricCubeObject({ isSelected, onSelect }) {
  const groupRef = useRef(null);
  const cubeRef = useRef(null);
  const innerSphereRef = useRef(null);
  const ringRef = useRef(null);

  useFrame((_, delta) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.y += delta * 0.45;
      cubeRef.current.rotation.x += delta * 0.3;
    }
    if (innerSphereRef.current) {
      innerSphereRef.current.rotation.y -= delta * 0.6;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.55;
    }
  });

  return (
    <Float speed={2.2} rotationIntensity={0.22} floatIntensity={0.35}>
      <group
        position={[0.0, -0.38, 0.4]}
        ref={groupRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          if (typeof document !== 'undefined') document.body.style.cursor = 'auto';
        }}
      >
        {/* Outer Translucent Glass Isometric Cube */}
        <mesh ref={cubeRef}>
          <boxGeometry args={[0.42, 0.42, 0.42]} />
          <meshStandardMaterial
            color="#312e81"
            emissive="#6366f1"
            emissiveIntensity={isSelected ? 2.2 : 0.8}
            roughness={0.1}
            metalness={0.7}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Inner Glowing Energy Core Sphere */}
        <mesh ref={innerSphereRef}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial
            color="#a5b4fc"
            emissive="#818cf8"
            emissiveIntensity={isSelected ? 3.2 : 2.5}
            roughness={0.1}
          />
        </mesh>

        {/* Glowing Wireframe Chamfer Edges */}
        <mesh scale={1.03}>
          <boxGeometry args={[0.42, 0.42, 0.42]} />
          <meshBasicMaterial
            color="#c7d2fe"
            wireframe
            transparent
            opacity={isSelected ? 0.95 : 0.55}
          />
        </mesh>

        {/* Equatorial Holographic Ring */}
        <mesh ref={ringRef} rotation={[Math.PI / 2.3, 0, 0]}>
          <torusGeometry args={[0.58, 0.016, 16, 36]} />
          <meshStandardMaterial
            color="#818cf8"
            emissive="#6366f1"
            emissiveIntensity={isSelected ? 2.5 : 1.8}
            metalness={0.8}
          />
        </mesh>

        {/* Dynamic Light Pool under the object */}
        <pointLight color="#6366f1" intensity={isSelected ? 8.0 : 3.2} distance={3.8} />
      </group>
    </Float>
  );
}

// =========================================================================
// MILESTONE 3: Stylized 3D Cyber Executive Case
// =========================================================================
function CyberCaseObject({ isSelected, onSelect }) {
  const groupRef = useRef(null);
  const ringRef = useRef(null);

  useFrame(({ clock }, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 1.2) * 0.18;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.6;
    }
  });

  return (
    <Float speed={2.0} rotationIntensity={0.18} floatIntensity={0.35}>
      <group
        position={[5.5, 0.02, 0.1]}
        ref={groupRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          if (typeof document !== 'undefined') document.body.style.cursor = 'auto';
        }}
      >
        {/* Case Main Body - Chamfered Beveled Cuboid */}
        <mesh>
          <boxGeometry args={[0.48, 0.34, 0.18]} />
          <meshStandardMaterial
            color="#3b0764"
            emissive="#8b5cf6"
            emissiveIntensity={isSelected ? 2.2 : 0.8}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Glowing Neon Cyber Seam Trim */}
        <mesh scale={1.02}>
          <boxGeometry args={[0.48, 0.34, 0.18]} />
          <meshBasicMaterial
            color="#e9d5ff"
            wireframe
            transparent
            opacity={isSelected ? 0.95 : 0.45}
          />
        </mesh>

        {/* 3D Metallic Handle */}
        <mesh position={[0, 0.22, 0]}>
          <torusGeometry args={[0.09, 0.02, 12, 20, Math.PI]} />
          <meshStandardMaterial
            color="#c084fc"
            emissive="#a855f7"
            emissiveIntensity={isSelected ? 2.2 : 1.5}
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>

        {/* Central Glowing Cyber Latch */}
        <mesh position={[0, 0.02, 0.095]}>
          <boxGeometry args={[0.07, 0.05, 0.02]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={isSelected ? 3.0 : 2.0}
          />
        </mesh>

        {/* Floating Halo Ring */}
        <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[0.62, 0.016, 16, 36]} />
          <meshBasicMaterial color="#c084fc" transparent opacity={isSelected ? 0.9 : 0.65} />
        </mesh>

        {/* Dynamic Light Pool under the object */}
        <pointLight color="#8b5cf6" intensity={isSelected ? 8.5 : 3.5} distance={4.0} />
      </group>
    </Float>
  );
}

export default function MilestoneObjects({ activeId, onSelectMilestone }) {
  return (
    <group>
      <CodeGemObject
        isSelected={activeId === 'giet' || activeId === 'intern'}
        onSelect={() => onSelectMilestone?.('giet')}
      />
      <IsometricCubeObject
        isSelected={activeId === 'tech-mahindra' || activeId === 'software-dev'}
        onSelect={() => onSelectMilestone?.('tech-mahindra')}
      />
      <CyberCaseObject
        isSelected={activeId === 'triptales' || activeId === 'junior-dev'}
        onSelect={() => onSelectMilestone?.('triptales')}
      />
    </group>
  );
}
