"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLenisRef } from "@/components/providers/lenis-context";
import { navLinks } from "@/lib/navigation";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const lenisRef = useLenisRef();

  // Hide on scroll down, reveal on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > last && y > 200);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll + close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const lenis = lenisRef?.current;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenisRef]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,backdrop-filter] duration-500 ${
        hidden && !open ? "-translate-y-full" : "translate-y-0"
      } ${scrolled && !open ? "bg-black/55 backdrop-blur-md" : "bg-transparent"}`}
    >
      <nav aria-label="Main" className="container-page flex h-20 items-center justify-between md:h-24">
        <a
          href="#home"
          data-intro
          data-anim="nav"
          className="font-display text-2xl font-black italic tracking-tight text-nitro md:text-[28px]"
          aria-label="Nitro — back to top"
        >
          NITRO
        </a>

        <ul className="hidden items-center gap-[clamp(2rem,6vw,7.5rem)] lg:flex">
          {navLinks.map((link) => (
            <li key={link.href} data-intro data-anim="nav">
              <a
                href={link.href}
                className="group relative py-2 text-base text-white/90 transition-colors hover:text-white"
              >
                {link.label}
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-nitro transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3" data-intro data-anim="nav">
          <a href="#shop" className="btn btn-nitro hidden sm:inline-flex">
            Buy Now
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="relative z-50 grid size-11 place-items-center lg:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`absolute h-0.5 w-6 bg-white transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-[5px]"}`}
            />
            <span
              className={`absolute h-0.5 w-6 bg-white transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-[5px]"}`}
            />
          </button>
        </div>
      </nav>

      <div
        id={menuId}
        className={`fixed inset-0 z-40 flex flex-col justify-between bg-black/95 px-6 pt-28 pb-10 backdrop-blur-xl transition-[opacity,visibility] duration-500 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-2">
          {navLinks.map((link, i) => (
            <li
              key={link.href}
              className={`transition-[transform,opacity] duration-500 ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
              style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
            >
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display text-5xl font-black italic uppercase text-white transition-colors hover:text-nitro"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#shop" onClick={() => setOpen(false)} className="btn btn-nitro w-full">
          Buy Now
        </a>
      </div>
    </header>
  );
}
