"use client";

import { Canvas, useFrame, useThree, type RootState } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import { canStore, revealFor, spinFor } from "@/lib/canStore";
import { getFeaturedProduct, slotIdFor, type Product } from "@/lib/products";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { CanModel } from "./CanModel";
import { createLabelTexture } from "./labelTexture";
import { measureSlots, type SlotPose } from "./slots";

type Slots = RefObject<Map<string, SlotPose>>;

const TAU = Math.PI * 2;
const travelEase = gsap.parseEase("power2.inOut");
const { lerp, clamp } = THREE.MathUtils;

/** px → world units at the z = 0 plane. */
function pxToWorld(state: RootState) {
  const camera = state.camera as THREE.PerspectiveCamera;
  const worldHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
  return worldHeight / state.size.height;
}

/** Drive R3F from GSAP's ticker so Lenis, ScrollTrigger and WebGL share one frame. */
function TickerDriver() {
  const advance = useThree((s) => s.advance);
  useEffect(() => {
    const tick = (time: number) => advance(time);
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [advance]);
  return null;
}

function useSlots(): Slots {
  const slots = useRef(new Map<string, SlotPose>());
  useEffect(() => {
    const measure = () => {
      slots.current = measureSlots();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    document.querySelectorAll("[data-can-slot]").forEach((el) => ro.observe(el));
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    document.fonts?.ready.then(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
    };
  }, []);
  return slots;
}

function useFonts() {
  const [fonts, setFonts] = useState<{ display: string; body: string } | null>(null);
  useEffect(() => {
    let cancelled = false;
    const root = getComputedStyle(document.documentElement);
    const display = root.getPropertyValue("--font-display-face").trim() || "sans-serif";
    const body = root.getPropertyValue("--font-outfit").trim() || "sans-serif";
    Promise.all([
      document.fonts.load(`italic 900 64px ${display}`),
      document.fonts.load(`500 32px ${body}`),
    ])
      .catch(() => undefined)
      .then(() => {
        if (!cancelled) setFonts({ display, body });
      });
    return () => {
      cancelled = true;
    };
  }, []);
  return fonts;
}

function usePointer(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      canStore.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      canStore.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);
}

/**
 * The featured can: glides between slots as the page scrolls.
 * Between two sections it interpolates their *designed* viewport positions,
 * so it stays on screen while the content scrolls past it.
 */
function TravelCan({ path, label, slots }: { path: string[]; label: THREE.Texture; slots: Slots }) {
  const outer = useRef<THREE.Group>(null);
  const orient = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const tilt = useRef({ x: 0, y: 0 });
  const hoverSpin = spinFor(path[path.length - 1]);

  useEffect(() => {
    const tween = gsap.fromTo(canStore.intro, { p: 0 }, { p: 1, duration: 2.2, ease: "power3.out", delay: 0.15 });
    return () => {
      tween.kill();
      canStore.intro.p = 1;
    };
  }, []);

  useFrame((state, delta) => {
    const o = outer.current;
    const r = orient.current;
    const s = spin.current;
    if (!o || !r || !s) return;

    const poses = path.map((id) => slots.current.get(id)).filter((p): p is SlotPose => !!p);
    if (poses.length === 0) {
      o.visible = false;
      return;
    }
    o.visible = true;

    const y = window.scrollY;
    const first = poses[0];
    const last = poses[poses.length - 1];
    let a = first;
    let b = first;
    let seg = 0;
    let t = 0;
    if (y >= last.focus) {
      a = b = last;
      seg = poses.length - 1;
    } else if (y > first.focus) {
      for (let i = 0; i < poses.length - 1; i++) {
        if (y < poses[i + 1].focus) {
          a = poses[i];
          b = poses[i + 1];
          seg = i;
          t = (y - a.focus) / Math.max(1, b.focus - a.focus);
          break;
        }
      }
    }

    const e = travelEase(clamp(t, 0, 1));
    const top = a === b ? a.top - y : lerp(a.top - a.focus, b.top - b.focus, e);
    const left = lerp(a.left, b.left, e);
    const w = lerp(a.width, b.width, e);
    const h = lerp(a.height, b.height, e);
    const length = lerp(Math.max(a.width, a.height), Math.max(b.width, b.height), e);

    const k = pxToWorld(state);
    const { width: vw, height: vh } = state.size;
    const scale = length * k;
    const intro = canStore.intro.p;
    const arc = Math.sin(e * Math.PI);
    const float = Math.sin(state.clock.elapsedTime * 1.2) * 0.012 * scale;

    o.position.set(
      (left + w / 2 - vw / 2) * k,
      -(top + h / 2 - vh / 2) * k + float - (1 - intro) * vh * k * 0.12,
      arc * 1.2,
    );
    o.scale.setScalar(scale * (0.7 + 0.3 * intro));

    const damp = 1 - Math.exp(-delta * 4);
    tilt.current.x += (canStore.pointer.y * 0.12 - tilt.current.x) * damp;
    tilt.current.y += (canStore.pointer.x * 0.2 - tilt.current.y) * damp;

    r.rotation.set(
      lerp(a.rx, b.rx, e) + tilt.current.x + arc * 0.3,
      lerp(a.ry, b.ry, e) + tilt.current.y,
      lerp(a.rz, b.rz, e),
    );
    s.rotation.y = (seg + e) * TAU - (1 - intro) * TAU * 0.75 + hoverSpin.v;
  });

  return (
    <group ref={outer}>
      <group ref={orient}>
        <group ref={spin}>
          <CanModel label={label} />
        </group>
      </group>
    </group>
  );
}

/** A can pinned to one DOM slot (product lineup, or every slot in reduced motion). */
function SlotCan({
  slotId,
  label,
  slots,
  motion,
  phase = 0,
}: {
  slotId: string;
  label: THREE.Texture;
  slots: Slots;
  motion: boolean;
  phase?: number;
}) {
  const outer = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const reveal = revealFor(slotId);
  const hoverSpin = spinFor(slotId);

  useFrame((state) => {
    const o = outer.current;
    const s = spin.current;
    if (!o || !s) return;
    const pose = slots.current.get(slotId);
    const { width: vw, height: vh } = state.size;
    const top = pose ? pose.top - window.scrollY : 0;
    const p = motion ? reveal.p : 1;
    if (!pose || p <= 0.001 || top > vh * 1.3 || top + pose.height < -vh * 0.3) {
      o.visible = false;
      return;
    }
    o.visible = true;

    const k = pxToWorld(state);
    const scale = Math.max(pose.width, pose.height) * k;
    const float = motion ? Math.sin(state.clock.elapsedTime * 1.1 + phase * 1.7) * 0.01 * scale : 0;
    const side = phase % 2 === 0 ? -1 : 1;

    o.position.set(
      (pose.left + pose.width / 2 - vw / 2) * k,
      -(top + pose.height / 2 - vh / 2) * k + float - (1 - p) * vh * k * 0.45,
      0,
    );
    o.scale.setScalar(scale * (0.8 + 0.2 * p));
    o.rotation.set(pose.rx, pose.ry, pose.rz + (1 - p) * 0.5 * side);
    s.rotation.y = (1 - p) * Math.PI * side + hoverSpin.v;
  });

  return (
    <group ref={outer} visible={false}>
      <group ref={spin}>
        <CanModel label={label} />
      </group>
    </group>
  );
}

function Cans({ products, motion }: { products: Product[]; motion: boolean }) {
  const fonts = useFonts();
  const slots = useSlots();
  const gl = useThree((s) => s.gl);
  const featured = getFeaturedProduct(products);

  const textures = useMemo(() => {
    if (!fonts) return null;
    const compact = window.innerWidth < 768;
    const maxAniso = gl.capabilities.getMaxAnisotropy();
    return new Map(
      products.map((p) => {
        const tex = createLabelTexture({
          color: p.color,
          displayFont: fonts.display,
          bodyFont: fonts.body,
          width: p.featured && !compact ? 2048 : 1024,
        });
        tex.anisotropy = maxAniso;
        return [p.id, tex] as const;
      }),
    );
  }, [fonts, products, gl]);

  useEffect(() => () => textures?.forEach((t) => t.dispose()), [textures]);

  if (!textures) return null;
  const featuredLabel = textures.get(featured.id)!;
  const travelPath = ["hero", "about", slotIdFor(featured)];

  return (
    <>
      {motion ? (
        <TravelCan path={travelPath} label={featuredLabel} slots={slots} />
      ) : (
        travelPath.map((id) => <SlotCan key={id} slotId={id} label={featuredLabel} slots={slots} motion={false} />)
      )}
      {products
        .filter((p) => !p.featured)
        .map((p, i) => (
          <SlotCan
            key={p.id}
            slotId={slotIdFor(p)}
            label={textures.get(p.id)!}
            slots={slots}
            motion={motion}
            phase={i}
          />
        ))}
    </>
  );
}

export default function CanStage({ products }: { products: Product[] }) {
  const reduced = usePrefersReducedMotion();
  usePointer(!reduced);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-10">
      <Canvas
        frameloop="never"
        dpr={[1, 2]}
        camera={{ fov: 30, position: [0, 0, 10], near: 0.1, far: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <TickerDriver />
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 5, 6]} intensity={2.2} />
        <directionalLight position={[-6, 1, 3]} intensity={1} />
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={4} position={[0, 5, 2]} scale={[10, 2, 1]} />
          <Lightformer form="rect" intensity={3} position={[-6, 1, 1]} scale={[2, 8, 1]} />
          <Lightformer form="rect" intensity={3} position={[6, 1, 1]} scale={[2, 8, 1]} />
          <Lightformer form="rect" intensity={1.5} position={[0, 0, 6]} scale={[6, 3, 1]} />
        </Environment>
        <Cans products={products} motion={!reduced} />
      </Canvas>
    </div>
  );
}
