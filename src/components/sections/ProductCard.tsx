"use client";

import type { CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { spinFor } from "@/lib/canStore";
import { formatPrice, slotIdFor, type Product } from "@/lib/products";

/** Visual tier per position, mirroring the Figma lineup (small → large → small). */
const TIERS = {
  featured: "h-[clamp(18rem,54svh,30rem)] md:h-[min(62svh,36vw)]",
  near: "h-[clamp(12rem,32svh,18rem)] md:h-[min(48svh,28vw)]",
  far: "h-[clamp(12rem,32svh,18rem)] md:h-[min(40svh,23vw)]",
} as const;

export function ProductCard({ product, tier }: { product: Product; tier: keyof typeof TIERS }) {
  const slotId = slotIdFor(product);

  const spin = () => {
    gsap.to(spinFor(slotId), {
      v: `+=${Math.PI * 2}`,
      duration: 1.4,
      ease: "power3.out",
      overwrite: false,
    });
  };

  return (
    <li
      className={`group flex flex-col items-center text-center ${
        product.featured ? "col-span-2" : ""
      }`}
      style={{ "--accent": product.color } as CSSProperties}
      onPointerEnter={spin}
    >
      <div className="relative flex w-full justify-center">
        <div
          data-can-slot={slotId}
          data-can-reveal={product.featured ? undefined : slotId}
          className={`aspect-[340/896] [--can-rx:6] ${TIERS[tier]}`}
        />
        <span
          aria-hidden
          className={`absolute -bottom-3 left-1/2 z-0 h-6 w-[70%] max-w-56 -translate-x-1/2 rounded-[50%] blur-md ${
            product.featured ? "bg-nitro/70 shadow-[0_0_60px_10px_rgba(224,230,0,0.35)]" : "bg-white/10"
          }`}
        />
      </div>

      <div data-anim="product-info" className="relative z-20 mt-8 md:mt-10">
        <h3 className="font-display text-xl font-black uppercase italic transition-colors duration-300 group-hover:text-[var(--accent)] md:text-[clamp(1.1rem,1.6vw,2rem)]">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-white/55 md:text-base">{product.tagline}</p>
        <p className="mt-1.5 text-lg font-semibold md:text-[clamp(1rem,1.3vw,1.6rem)]">
          <span className="sr-only">Price: </span>
          {formatPrice(product.price)}
        </p>
      </div>
    </li>
  );
}
