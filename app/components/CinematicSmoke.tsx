'use client';

import { useEffect, useRef } from 'react';
import { MotionValue } from 'framer-motion';

export interface SmokeConfig {
  /** Speed of the smoke flow & swirling (Default: 0.65) */
  speed?: number;
  /** Overall opacity of the smoke layer (Default: 0.55) */
  opacity?: number;
  /** Fullness and contrast of the smoke clouds (Default: 1.15) */
  density?: number;
  /** Primary deep navy tint (Default: #071426) */
  colorNavy?: [number, number, number];
  /** Mid-tone royal/premium blue smoke (Default: #1e40af -> RGB [0.12, 0.25, 0.68]) */
  colorBlue?: [number, number, number];
  /** Highlight soft mist wisps (Default: #93c5fd -> RGB [0.58, 0.77, 0.99]) */
  colorLight?: [number, number, number];
}

interface CinematicSmokeProps {
  scrollProgress?: MotionValue<number> | number;
  config?: SmokeConfig;
  className?: string;
}

// Minimal Vertex Shader: Fullscreen quad
const VERT_SRC = `
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main() {
    vUv = (aPosition + 1.0) * 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

// Volumetric Organic Smoke Fragment Shader with Domain Warping (fBm)
const FRAG_SRC = `
  precision highp float;
  varying vec2 vUv;

  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uScroll;
  uniform float uSpeed;
  uniform float uOpacity;
  uniform float uDensity;
  uniform vec3 uColorNavy;
  uniform vec3 uColorBlue;
  uniform vec3 uColorLight;

  // Simple 2D hash for value noise
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // Bilinear smooth noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f); // Hermite curve

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // Fractional Brownian Motion (fBm) with 3 optimized octaves
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 3; i++) {
      v += a * noise(p);
      p = rot * p * 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // Aspect-ratio corrected coordinates
    vec2 st = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);

    // Scroll parallax & camera depth
    st.y += uScroll * 0.22;
    st *= (1.0 - uScroll * 0.15); // gentle push-in

    // Drift time variables
    float t = uTime * uSpeed * 0.09;

    // Streamlined Domain Warping for silky volumetric swirls
    vec2 q = vec2(
      fbm(st * 1.4 + vec2(0.0, t * 0.7)),
      fbm(st * 1.4 + vec2(5.2, 1.3 - t * 0.5))
    );

    // Final smoke density field with soft single warp
    float smoke = fbm(st * 1.8 + 2.2 * q + vec2(1.7 - t * 0.3, 9.2 + t * 0.4));
    smoke = pow(smoke, 1.3) * uDensity;

    // Atmospheric mask: center focus behind subject, softly falling off at edges
    vec2 maskCenter = vec2(0.5, 0.5);
    float dist = length((vUv - maskCenter) * vec2(1.0, 1.25));
    float vignette = smoothstep(0.85, 0.15, dist);

    // Color gradient mapping:
    // 1. Base deep midnight blue
    // 2. Royal/premium blue body
    // 3. Subtle soft white/cyan wisps
    vec3 col = mix(uColorNavy, uColorBlue, smoothstep(0.18, 0.55, smoke));
    col = mix(col, uColorLight, smoothstep(0.58, 0.95, smoke) * 0.45);

    // Alpha calculation: soft, non-distracting mist
    float alpha = smoothstep(0.15, 0.75, smoke) * vignette * uOpacity;

    gl_FragColor = vec4(col, alpha);
  }
`;

export default function CinematicSmoke({
  scrollProgress,
  config = {},
  className = '',
}: CinematicSmokeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isVisibleRef = useRef<boolean>(true);

  // Defaults based on the requested blue-and-white theme
  const {
    speed = 0.65,
    opacity = 0.52,
    density = 1.15,
    colorNavy = [7 / 255, 20 / 255, 38 / 255],     // #071426
    colorBlue = [37 / 255, 99 / 255, 235 / 255],   // #2563EB
    colorLight = [226 / 255, 238 / 255, 255 / 255] // #E2EEFF
  } = config;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const effectiveSpeed = prefersReducedMotion ? 0.05 : speed;

    // Try WebGL
    const gl = canvas.getContext('webgl', {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      powerPreference: 'high-performance',
    });

    if (!gl) {
      // Fallback if WebGL unavailable: render nothing or simple CSS handles it
      return;
    }

    // Compile Shaders
    function createShader(type: number, src: string) {
      const shader = gl!.createShader(type);
      if (!shader) return null;
      gl!.shaderSource(shader, src);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.warn('Smoke shader error:', gl!.getShaderInfoLog(shader));
        gl!.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl.VERTEX_SHADER, VERT_SRC);
    const fs = createShader(gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Fullscreen quad geometry
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(prog, 'aPosition');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uResLoc = gl.getUniformLocation(prog, 'uResolution');
    const uTimeLoc = gl.getUniformLocation(prog, 'uTime');
    const uScrollLoc = gl.getUniformLocation(prog, 'uScroll');
    const uSpeedLoc = gl.getUniformLocation(prog, 'uSpeed');
    const uOpacityLoc = gl.getUniformLocation(prog, 'uOpacity');
    const uDensityLoc = gl.getUniformLocation(prog, 'uDensity');
    const uNavyLoc = gl.getUniformLocation(prog, 'uColorNavy');
    const uBlueLoc = gl.getUniformLocation(prog, 'uColorBlue');
    const uLightLoc = gl.getUniformLocation(prog, 'uColorLight');

    gl.uniform1f(uSpeedLoc, effectiveSpeed);
    gl.uniform1f(uOpacityLoc, opacity);
    gl.uniform1f(uDensityLoc, density);
    gl.uniform3fv(uNavyLoc, colorNavy);
    gl.uniform3fv(uBlueLoc, colorBlue);
    gl.uniform3fv(uLightLoc, colorLight);

    // Blending: Soft additive / alpha blend
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Resize handler (render at 0.55x resolution for silky performance and organic diffuse softness)
    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.2);
      const width = Math.max(1, Math.floor(rect.width * dpr * 0.55));
      const height = Math.max(1, Math.floor(rect.height * dpr * 0.55));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      gl.uniform2f(uResLoc, width, height);
    };

    resize();
    window.addEventListener('resize', resize);

    // IntersectionObserver to pause when hero is off-screen (0% GPU/CPU overhead!)
    const io = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    });
    io.observe(canvas);

    let rafId: number;
    const startTime = performance.now();

    const render = () => {
      if (isVisibleRef.current) {
        const time = (performance.now() - startTime) * 0.001;
        gl.uniform1f(uTimeLoc, time);

        // Read scroll progress without re-rendering
        let scroll = 0;
        if (typeof scrollProgress === 'number') {
          scroll = scrollProgress;
        } else if (scrollProgress && typeof scrollProgress.get === 'function') {
          scroll = scrollProgress.get();
        }
        gl.uniform1f(uScrollLoc, scroll);

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      io.disconnect();
      if (gl) {
        gl.deleteProgram(prog);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        gl.deleteBuffer(buf);
      }
    };
  }, [scrollProgress, speed, opacity, density, colorNavy, colorBlue, colorLight]);

  return (
    <canvas
      ref={canvasRef}
      className={`hero-smoke-canvas ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1, // Sits in Layer 1 atmosphere, behind the portrait and PORTFOLIO text
        mixBlendMode: 'screen', // Gives soft glowing studio mist effect
      }}
      aria-hidden="true"
    />
  );
}
