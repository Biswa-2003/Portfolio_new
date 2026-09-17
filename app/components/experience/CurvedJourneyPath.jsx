'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { EXPERIENCES } from './ExperienceData';

// Dynamic 3D Spline Points with perspective depth:
// Sweeps from lower-left foreground through the 3 milestones,
// then arcs deep into the mountain valley in an S-curve to the summit peak
export const ROAD_POINTS = [
  new THREE.Vector3(-11.0, -1.8, 1.2),
  new THREE.Vector3(-8.2, -1.45, 0.9),
  new THREE.Vector3(-5.5, -1.2, 0.6),     // Milestone 1 (GIET: 2020-2024)
  new THREE.Vector3(-2.6, -1.0, 0.5),
  new THREE.Vector3(0.0, -0.85, 0.4),     // Milestone 2 (Tech Mahindra: 2024)
  new THREE.Vector3(2.8, -0.65, 0.25),
  new THREE.Vector3(5.5, -0.45, 0.1),     // Milestone 3 (Triptales: 2025)
  new THREE.Vector3(7.6, 0.1, -0.8),
  new THREE.Vector3(7.2, 0.8, -1.8),      // Loop back into depth
  new THREE.Vector3(5.6, 1.4, -2.8),      // Snake left along slope
  new THREE.Vector3(5.0, 1.9, -3.4),      // Turn back right
  new THREE.Vector3(6.0, 2.3, -3.7),      // Ascend mountain peak
  new THREE.Vector3(6.8, 2.7, -3.8),      // Summit Flag!
];

export const journeyCurve = new THREE.CatmullRomCurve3(ROAD_POINTS, false, 'centripetal', 0.5);

// Custom Shader for Animated Cyber Highway
const RoadShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColorEdge: { value: new THREE.Color('#38bdf8') },      // Teal glow
    uColorCenter: { value: new THREE.Color('#070c1e') },    // Deep dark translucent navy
    uColorRail: { value: new THREE.Color('#6366f1') },      // Violet secondary
    uColorDashes: { value: new THREE.Color('#67e8f9') },    // Neon cyan dashes
    uColorPulse: { value: new THREE.Color('#ffffff') },     // Energy pulse
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorEdge;
    uniform vec3 uColorCenter;
    uniform vec3 uColorRail;
    uniform vec3 uColorDashes;
    uniform vec3 uColorPulse;

    varying vec2 vUv;

    void main() {
      float distFromCenter = abs(vUv.x - 0.5) * 2.0; // 0.0 at center, 1.0 at edges

      // 1. Sleek Glass Road Base
      vec3 baseColor = mix(uColorCenter, uColorRail * 0.45, pow(distFromCenter, 2.0));

      // 2. Glowing Neon Edge Rails
      float edgeGlow = pow(distFromCenter, 4.0) * 2.2;
      vec3 edgeColor = uColorEdge * edgeGlow;

      // 3. Animated Dashed Center Line (flowing forward)
      float centerBand = 1.0 - smoothstep(0.0, 0.05, abs(vUv.x - 0.5));
      float dashFreq = vUv.y * 110.0 - uTime * 6.5;
      float dash = step(0.35, sin(dashFreq)) * centerBand;
      vec3 dashColor = uColorDashes * dash * 1.8;

      // 4. Moving High-Speed Energy Waves
      float wave1 = pow(max(0.0, sin(vUv.y * 8.0 - uTime * 2.8)), 24.0) * 1.6;
      float wave2 = pow(max(0.0, sin(vUv.y * 14.0 - uTime * 4.2 + 2.0)), 32.0) * 1.4;
      float wave = wave1 + wave2;
      vec3 waveColor = uColorPulse * wave * (1.0 - distFromCenter * 0.5);

      vec3 finalColor = baseColor + edgeColor + dashColor + waveColor;
      float alpha = clamp(0.72 + edgeGlow * 0.45 + dash * 0.4 + wave * 0.3, 0.0, 0.95);

      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
};

export default function CurvedJourneyPath({ activeId, onSelectMilestone }) {
  const shaderRef = useRef(null);

  // Generate flat highway ribbon mesh along the 3D curve
  const { ribbonGeo, leftRailGeo, rightRailGeo, milestones } = useMemo(() => {
    const samples = 280;
    const roadWidth = 0.54;

    const positions = [];
    const uvs = [];
    const indices = [];

    const leftRailPoints = [];
    const rightRailPoints = [];

    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      const pt = journeyCurve.getPoint(t);
      const tangent = journeyCurve.getTangent(t).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const side = new THREE.Vector3().crossVectors(tangent, up).normalize();

      const leftPt = new THREE.Vector3(
        pt.x - side.x * (roadWidth * 0.5),
        pt.y - side.y * (roadWidth * 0.5),
        pt.z - side.z * (roadWidth * 0.5)
      );

      const rightPt = new THREE.Vector3(
        pt.x + side.x * (roadWidth * 0.5),
        pt.y + side.y * (roadWidth * 0.5),
        pt.z + side.z * (roadWidth * 0.5)
      );

      positions.push(leftPt.x, leftPt.y, leftPt.z);
      positions.push(rightPt.x, rightPt.y, rightPt.z);

      uvs.push(0.0, t);
      uvs.push(1.0, t);

      leftRailPoints.push(new THREE.Vector3(leftPt.x, leftPt.y + 0.015, leftPt.z));
      rightRailPoints.push(new THREE.Vector3(rightPt.x, rightPt.y + 0.015, rightPt.z));

      if (i < samples) {
        const base = i * 2;
        indices.push(base, base + 1, base + 2);
        indices.push(base + 1, base + 3, base + 2);
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeVertexNormals();

    const curveL = new THREE.CatmullRomCurve3(leftRailPoints);
    const curveR = new THREE.CatmullRomCurve3(rightRailPoints);

    const railL = new THREE.TubeGeometry(curveL, 240, 0.018, 8, false);
    const railR = new THREE.TubeGeometry(curveR, 240, 0.018, 8, false);

    const msData = EXPERIENCES.map((exp) => {
      const pos = new THREE.Vector3(...exp.coords);
      return { ...exp, curvePos: pos };
    });

    return {
      ribbonGeo: geo,
      leftRailGeo: railL,
      rightRailGeo: railR,
      milestones: msData,
    };
  }, []);

  // Photon light pulses traveling along the highway
  const photonCount = 8;
  const photonOffsets = useMemo(() => {
    return Array.from({ length: photonCount }, (_, i) => i / photonCount);
  }, []);
  const photonMeshes = useRef([]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = elapsed;
    }

    photonMeshes.current.forEach((mesh, i) => {
      if (!mesh) return;
      const progress = (photonOffsets[i] + elapsed * 0.1) % 1.0;
      const pt = journeyCurve.getPoint(progress);
      mesh.position.set(pt.x, pt.y + 0.035, pt.z);
      const s = 0.75 + Math.sin(elapsed * 4 + i) * 0.25;
      mesh.scale.setScalar(s);
    });
  });

  return (
    <group>
      {/* 1. Flat Highway Ribbon with Custom Animated Shader */}
      <mesh geometry={ribbonGeo}>
        <shaderMaterial
          ref={shaderRef}
          attach="material"
          args={[RoadShaderMaterial]}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Electric Neon Left Rim Rail */}
      <mesh geometry={leftRailGeo}>
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#38bdf8"
          emissiveIntensity={2.0}
          roughness={0.15}
        />
      </mesh>

      {/* 3. Electric Neon Right Rim Rail */}
      <mesh geometry={rightRailGeo}>
        <meshStandardMaterial
          color="#818cf8"
          emissive="#6366f1"
          emissiveIntensity={2.0}
          roughness={0.15}
        />
      </mesh>

      {/* 4. High-Speed 3D Photon Light Beams gliding along the center lane */}
      {photonOffsets.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => (photonMeshes.current[i] = el)}
        >
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshBasicMaterial
            color={i % 3 === 2 ? '#c084fc' : '#38bdf8'}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}

      {/* 5. True 3D Holographic Sci-Fi Landing Pads on the highway */}
      {milestones.map((ms) => {
        const isSelected = activeId === ms.id;
        const color = ms.accent;

        return (
          <group key={ms.id} position={[ms.curvePos.x, ms.curvePos.y, ms.curvePos.z]}>
            {/* 3D Elevated Beveled Metallic Base Platform */}
            <mesh
              position={[0, 0.04, 0]}
              onClick={(e) => {
                e.stopPropagation();
                onSelectMilestone?.(ms.id);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                if (typeof document !== 'undefined') document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                if (typeof document !== 'undefined') document.body.style.cursor = 'auto';
              }}
            >
              <cylinderGeometry args={[0.42, 0.5, 0.08, 36]} />
              <meshStandardMaterial
                color="#0f172a"
                emissive="#0f172a"
                emissiveIntensity={0.2}
                roughness={0.25}
                metalness={0.9}
              />
            </mesh>

            {/* Recessed Glowing Lens Disk */}
            <mesh position={[0, 0.082, 0]}>
              <cylinderGeometry args={[0.34, 0.34, 0.015, 32]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isSelected ? 2.5 : 1.2}
                roughness={0.1}
                metalness={0.6}
              />
            </mesh>

            {/* Floating Cyber Ring hovering slightly above the pad */}
            <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.46, 0.014, 16, 36]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={isSelected ? 0.95 : 0.6}
              />
            </mesh>

            {/* Subtle Volumetric Light Cone projecting upward toward card */}
            <mesh position={[0, 0.45, 0]}>
              <cylinderGeometry args={[0.04, 0.12, 0.8, 16, 1, true]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={isSelected ? 0.35 : 0.12}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>

            {/* Glowing Year Typography directly below the road (matches reference image) */}
            <Html
              position={[0, -0.62, 0.45]}
              center
              distanceFactor={13}
              style={{ pointerEvents: 'auto', userSelect: 'none', cursor: 'pointer' }}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMilestone?.(ms.id);
                }}
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '22px',
                  fontWeight: 800,
                  color: color,
                  textShadow: `0 0 16px ${color}, 0 0 32px ${color}88`,
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.3s ease',
                  transform: isSelected ? 'scale(1.2)' : 'scale(1.0)',
                  userSelect: 'none',
                }}
              >
                {ms.year}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
