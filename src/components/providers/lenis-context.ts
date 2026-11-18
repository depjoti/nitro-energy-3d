"use client";

import { createContext, useContext, type RefObject } from "react";
import type Lenis from "lenis";

/** Holds the Lenis instance in a ref so consumers never re-render on scroll. */
export const LenisContext = createContext<RefObject<Lenis | null> | null>(null);

export function useLenisRef() {
  return useContext(LenisContext);
}
