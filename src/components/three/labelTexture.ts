import * as THREE from "three";

/** Label aspect = can circumference / label height (see CanModel). */
export const LABEL_ASPECT = 1.456;

type LabelOptions = {
  color: string;
  displayFont: string;
  bodyFont: string;
  width?: number;
  seed?: number;
};

/** Deterministic PRNG so every reload paints the same label. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rgba(hex: string, alpha: number) {
  const v = hex.replace("#", "");
  const n = parseInt(
    v.length === 3
      ? v
          .split("")
          .map((c) => c + c)
          .join("")
      : v,
    16,
  );
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

function crack(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  length: number,
  width: number,
  rand: () => number,
  depth: number,
) {
  const steps = 8;
  const seg = length / steps;
  let px = x;
  let py = y;
  let a = angle;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(px, py);
  for (let s = 0; s < steps; s++) {
    a += (rand() - 0.5) * 0.9;
    px += Math.cos(a) * seg;
    py += Math.sin(a) * seg;
    ctx.lineTo(px, py);
    if (depth > 0 && rand() < 0.22) {
      ctx.stroke();
      crack(ctx, px, py, a + (rand() - 0.5) * 1.8, length * 0.45, width * 0.65, rand, depth - 1);
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(px, py);
    }
  }
  ctx.stroke();
}

/** Stylised lightning bolt, normalised to a 1×1 box centred on 0,0. */
const BOLT: [number, number][] = [
  [0.16, -0.5],
  [-0.32, 0.07],
  [-0.02, 0.07],
  [-0.2, 0.5],
  [0.33, -0.12],
  [0.03, -0.12],
  [0.3, -0.5],
];

function boltPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, k = 1) {
  ctx.beginPath();
  BOLT.forEach(([bx, by], i) => {
    const x = cx + bx * size * 0.9 * k;
    const y = cy + by * size * k;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
}

function drawBolt(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  // Outer neon glow
  ctx.shadowColor = color;
  ctx.shadowBlur = size * 0.12;
  const outer = ctx.createLinearGradient(cx - size * 0.3, cy - size * 0.5, cx + size * 0.2, cy + size * 0.5);
  outer.addColorStop(0, "#ffffff");
  outer.addColorStop(0.35, color);
  outer.addColorStop(1, rgba(color, 0.85));
  ctx.fillStyle = outer;
  boltPath(ctx, cx, cy, size);
  ctx.fill();
  ctx.fill();
  ctx.restore();

  // Dark chrome core gives the bolt a bevelled look
  ctx.save();
  const core = ctx.createLinearGradient(cx - size * 0.3, cy - size * 0.5, cx + size * 0.3, cy + size * 0.5);
  core.addColorStop(0, "#3a3a3a");
  core.addColorStop(0.5, "#0b0b0b");
  core.addColorStop(1, "#2a2a2a");
  ctx.fillStyle = core;
  boltPath(ctx, cx + size * 0.01, cy, size, 0.78);
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = size * 0.006;
  ctx.stroke();
  ctx.restore();
}

function spacedText(ctx: CanvasRenderingContext2D, text: string, cx: number, y: number, spacing: number) {
  const chars = text.split("");
  const widths = chars.map((c) => ctx.measureText(c).width);
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
  let x = cx - total / 2;
  chars.forEach((c, i) => {
    ctx.fillText(c, x, y);
    x += widths[i] + spacing;
  });
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  { color, displayFont, bodyFont }: LabelOptions,
  rand: () => number,
) {
  const cx = w / 2;
  const cy = h * 0.4;

  // Base: glossy black with a soft vertical sheen
  const base = ctx.createLinearGradient(0, 0, 0, h);
  base.addColorStop(0, "#111");
  base.addColorStop(0.5, "#050505");
  base.addColorStop(1, "#0e0e0e");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  // Coloured aura behind the bolt
  const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, h * 0.6);
  aura.addColorStop(0, rgba(color, 0.6));
  aura.addColorStop(0.35, rgba(color, 0.2));
  aura.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = aura;
  ctx.fillRect(0, 0, w, h);

  // Fine speckle texture
  for (let i = 0; i < 1600; i++) {
    ctx.fillStyle = `rgba(255,255,255,${rand() * 0.16})`;
    ctx.beginPath();
    ctx.arc(rand() * w, rand() * h, rand() * w * 0.0014 + 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Electric cracks radiating from the centre
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = w * 0.008;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (let i = 0; i < 20; i++) {
    crack(ctx, cx, cy, rand() * Math.PI * 2, h * (0.22 + rand() * 0.3), w * (0.001 + rand() * 0.0014), rand, 2);
  }
  ctx.restore();

  // Condensation droplets
  for (let i = 0; i < 180; i++) {
    const a = rand() * Math.PI * 2;
    const d = Math.sqrt(rand()) * h * 0.46;
    const x = cx + Math.cos(a) * d * 1.4;
    const y = cy + Math.sin(a) * d;
    const r = w * (0.0015 + rand() * 0.0035);
    const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, 0, x, y, r);
    g.addColorStop(0, "rgba(255,255,255,0.8)");
    g.addColorStop(0.45, rgba(color, 0.3));
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  drawBolt(ctx, cx, cy, h * 0.6, color);

  // Wordmark: silver "NI" + coloured "TRO"
  ctx.textBaseline = "alphabetic";
  ctx.font = `italic 900 ${Math.round(h * 0.15)}px ${displayFont}`;
  const wordY = h * 0.86;
  const left = "NI";
  const right = "TRO";
  const lw = ctx.measureText(left).width;
  const rw = ctx.measureText(right).width;
  const startX = cx - (lw + rw) / 2;
  const silver = ctx.createLinearGradient(0, wordY - h * 0.13, 0, wordY);
  silver.addColorStop(0, "#ffffff");
  silver.addColorStop(0.55, "#9c9c9c");
  silver.addColorStop(1, "#f2f2f2");
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = h * 0.01;
  ctx.fillStyle = silver;
  ctx.textAlign = "left";
  ctx.fillText(left, startX, wordY);
  const tint = ctx.createLinearGradient(0, wordY - h * 0.13, 0, wordY);
  tint.addColorStop(0, "#ffffff");
  tint.addColorStop(0.4, color);
  tint.addColorStop(1, rgba(color, 0.75));
  ctx.fillStyle = tint;
  ctx.fillText(right, startX + lw, wordY);
  ctx.restore();

  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.font = `500 ${Math.round(h * 0.03)}px ${bodyFont}`;
  spacedText(ctx, "ENERGY DRINK", cx, h * 0.93, h * 0.022);

  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = `600 ${Math.round(h * 0.026)}px ${bodyFont}`;
  spacedText(ctx, "ZERO SUGAR  •  FLAVOUR", cx, h * 0.07, h * 0.008);

  // Back of the can: barcode + volume
  const bx = w * 0.05;
  const by = h * 0.55;
  ctx.fillStyle = "#f5f5f5";
  ctx.fillRect(bx - w * 0.006, by - h * 0.01, w * 0.07, h * 0.18);
  ctx.fillStyle = "#111";
  let x = bx;
  while (x < bx + w * 0.058) {
    const bw = w * (0.0008 + rand() * 0.002);
    ctx.fillRect(x, by, bw, h * 0.15);
    x += bw + w * (0.0008 + rand() * 0.0015);
  }
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = `500 ${Math.round(h * 0.024)}px ${bodyFont}`;
  ctx.textAlign = "left";
  ctx.fillText("500 ML", bx, by + h * 0.22);
}

export function createLabelTexture(options: LabelOptions): THREE.CanvasTexture {
  const w = options.width ?? 2048;
  const h = Math.round(w / LABEL_ASPECT);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (ctx) drawLabel(ctx, w, h, options, mulberry32(options.seed ?? 7));

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  return texture;
}
