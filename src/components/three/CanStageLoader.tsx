"use client";

import dynamic from "next/dynamic";
import type { Product } from "@/lib/products";

// WebGL is client-only and heavy: keep it out of the server render and the main bundle.
const CanStage = dynamic(() => import("./CanStage"), { ssr: false });

export function CanStageLoader({ products }: { products: Product[] }) {
  return <CanStage products={products} />;
}
