/**
 * Tiny mutable store shared between DOM-side GSAP timelines and the
 * React Three Fiber scene. GSAP tweens these plain objects; the 3D scene
 * reads them every frame. No React state => no re-renders while scrolling.
 */
type Progress = { p: number };
type Spin = { v: number };

const reveals = new Map<string, Progress>();
const spins = new Map<string, Spin>();

export const canStore = {
  /** 0 → 1 entrance of the hero can on first load. */
  intro: { p: 1 } as Progress,
  /** Normalised pointer position (-1 … 1) for subtle parallax. */
  pointer: { x: 0, y: 0 },
};

/** Reveal progress for a can slot (1 = fully in place). */
export function revealFor(slotId: string): Progress {
  let r = reveals.get(slotId);
  if (!r) {
    r = { p: 1 };
    reveals.set(slotId, r);
  }
  return r;
}

/** Extra spin (radians) around the can's own axis, used for hover. */
export function spinFor(slotId: string): Spin {
  let s = spins.get(slotId);
  if (!s) {
    s = { v: 0 };
    spins.set(slotId, s);
  }
  return s;
}
