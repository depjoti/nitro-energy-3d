/**
 * "Slots" are invisible DOM boxes that mark where a can should sit in the
 * layout. Because they are plain CSS boxes, the 3D cans follow whatever the
 * responsive layout does — breakpoints are handled entirely in Tailwind.
 *
 * Each slot can carry CSS custom properties for its orientation:
 *   --can-rx / --can-ry / --can-rz  (degrees)
 */
export type SlotPose = {
  id: string;
  /** Document-space box (px). */
  left: number;
  top: number;
  width: number;
  height: number;
  /** Rotation in radians. */
  rx: number;
  ry: number;
  rz: number;
  /** scrollY at which the slot's section is aligned with the viewport top. */
  focus: number;
};

const DEG = Math.PI / 180;

function readDeg(style: CSSStyleDeclaration, name: string): number {
  const value = parseFloat(style.getPropertyValue(name));
  return Number.isFinite(value) ? value * DEG : 0;
}

export function measureSlots(): Map<string, SlotPose> {
  const slots = new Map<string, SlotPose>();
  const scrollY = window.scrollY;

  document.querySelectorAll<HTMLElement>("[data-can-slot]").forEach((el) => {
    const id = el.dataset.canSlot;
    const rect = el.getBoundingClientRect();
    // Hidden variants (e.g. `md:hidden`) measure as 0×0 — skip them.
    if (!id || rect.width === 0 || rect.height === 0) return;

    const style = getComputedStyle(el);
    const section = el.closest<HTMLElement>("[data-can-section]");
    const focus = section ? section.getBoundingClientRect().top + scrollY : rect.top + scrollY;

    slots.set(id, {
      id,
      left: rect.left,
      top: rect.top + scrollY,
      width: rect.width,
      height: rect.height,
      rx: readDeg(style, "--can-rx"),
      ry: readDeg(style, "--can-ry"),
      rz: readDeg(style, "--can-rz"),
      focus,
    });
  });

  return slots;
}
