// Shared mutable state bridging GSAP ScrollTrigger (DOM-driven) and the
// react-three-fiber render loop (frame-driven). Deliberately not React state —
// useFrame reads this every tick, so it must not trigger re-renders.

export const sceneTarget = {
  camX: 0,
  camY: 0,
  camZ: 10.5,
  objX: 0.75,
  objY: 0.15,
  rotY: 0,
  rotX: 0,
  hue: 0, // 0 = blue, 0.5 = indigo, 1 = violet
  distort: 0.22,
  scale: 0.54,
  coreOpacity: 0.95,
};

export const pointer = { x: 0, y: 0 };

// NOTE on camX/camY vs objX/objY: the camera always calls lookAt(0,0,0), so
// panning the camera (camX/camY) only orbits the viewing angle around the
// object — the object itself stays screen-centered no matter what. To
// actually move the object to a different part of the screen you have to
// translate the object (objX/objY), which is what the Hero relies on to
// keep the orb clear of the copy. camX/camY are kept for the scroll-through
// sections purely for the subtle "reveal a different facet" orbit feel.
//
// Home has two hand-tuned presets — desktop keeps the orb as a clearly
// separated accent in the right column; mobile (where the layout stacks and
// the orb can't literally sit "below" the text, since it's one fixed
// full-viewport canvas, not a document-flow element) pushes it small and low
// so it reads as an ambient accent under the heading instead of behind it.
const HOME_DESKTOP = { objX: 0.75, objY: 0.15, camZ: 10.5, scale: 0.54, coreOpacity: 0, distort: 0.22 };
const HOME_MOBILE = { objX: 0, objY: -2.1, camZ: 9, scale: 0.3, coreOpacity: 0, distort: 0.18 };

export function setHomeVariant(isMobile) {
  const home = SCENE_SECTIONS.find((s) => s.id === 'home');
  if (!home) return;
  Object.assign(home, isMobile ? HOME_MOBILE : HOME_DESKTOP);
}

// Per-section camera / material keyframes.
// Section coordinates positioned into ambient negative spaces to avoid text collisions.
export const SCENE_SECTIONS = [
  { id: 'home', camX: 0, camY: 0, camZ: 10.5, objX: 0.75, objY: 0.15, rotY: 0, rotX: 0, hue: 0, distort: 0.22, scale: 0.54, coreOpacity: 0 },
  { id: 'about', camX: -4.5, camY: 1.2, camZ: 13, objX: -0.85, objY: 0.2, rotY: 1.1, rotX: 0.15, hue: 0.3, distort: 0.35, scale: 0.38, coreOpacity: 0.18 },
  { id: 'skills', camX: 5.4, camY: -2, camZ: 18, objX: 1.2, objY: -0.4, rotY: 2.3, rotX: -0.1, hue: 0.55, distort: 0.4, scale: 0.24, coreOpacity: 0.05 },
  { id: 'projects', camX: -3.8, camY: 1.8, camZ: 15, objX: 0.85, objY: 0.45, rotY: 3.4, rotX: 0.2, hue: 0.75, distort: 0.25, scale: 0.35, coreOpacity: 0.15 },
  { id: 'experience', camX: 4.8, camY: -1.2, camZ: 14, objX: 0.75, objY: -0.15, rotY: 4.6, rotX: -0.2, hue: 0.9, distort: 0.4, scale: 0.34, coreOpacity: 0.18 },
  { id: 'contact', camX: -3.5, camY: 0.8, camZ: 11, objX: -0.6, objY: 0.25, rotY: 5.6, rotX: 0, hue: 1, distort: 0.3, scale: 0.45, coreOpacity: 0.28 },
];
