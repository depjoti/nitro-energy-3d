"use client";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { revealFor } from "@/lib/canStore";

/**
 * All DOM-side motion lives here so sections can stay Server Components.
 * Everything is wrapped in a reduced-motion media query: users who opt out
 * get the static layout.
 */
export function PageAnimations() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Intro
      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
      intro
        .fromTo(
          "[data-anim=hero-letter]",
          { yPercent: 70, rotate: 4, autoAlpha: 0 },
          { yPercent: 0, rotate: 0, autoAlpha: 1, duration: 1.4, stagger: 0.07 },
        )
        .fromTo(
          "[data-anim=nav]",
          { y: -16, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.05 },
          0.5,
        )
        .fromTo(
          "[data-anim=hero-fade]",
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1 },
          0.8,
        );

      // Hero: the word drifts apart and up as you leave.
      const letters = gsap.utils.toArray<HTMLElement>("[data-anim=hero-letter-wrap]");
      const mid = (letters.length - 1) / 2;
      letters.forEach((el, i) => {
        gsap.to(el, {
          yPercent: -18 - Math.abs(i - mid) * 6,
          xPercent: (i - mid) * 10,
          ease: "none",
          scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: true },
        });
      });

      // About: photo wipes in, tagline lines rise one by one.
      gsap.fromTo(
        "[data-anim=about-photo]",
        { clipPath: "inset(18% 12% 18% 12% round 1.75rem)", scale: 1.08 },
        {
          clipPath: "inset(0% 0% 0% 0% round 1.75rem)",
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: "#about", start: "top 85%", end: "top 15%", scrub: 1 },
        },
      );
      gsap.fromTo(
        "[data-anim=about-line]",
        { yPercent: 105 },
        {
          yPercent: 0,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: "#about", start: "top 65%", end: "top 5%", scrub: 1 },
        },
      );

      // Products: the other four cans rise in (centre-out), then their labels.
      const reveals = gsap.utils.toArray<HTMLElement>("[data-can-reveal]");
      const centre = (reveals.length - 1) / 2;
      reveals.forEach((el, i) => {
        const state = revealFor(el.dataset.canReveal!);
        const delay = Math.abs(i - centre) < 1 ? 0 : 8;
        gsap.fromTo(
          state,
          { p: 0 },
          {
            p: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: "#shop", start: `top ${85 - delay}%`, end: `top ${20 - delay}%`, scrub: 1 },
          },
        );
      });
      gsap.fromTo(
        "[data-anim=product-info]",
        { y: 32, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          stagger: 0.06,
          ease: "power2.out",
          scrollTrigger: { trigger: "#shop", start: "top 45%", end: "top 5%", scrub: 1 },
        },
      );

      ScrollTrigger.refresh();

      return () => {
        reveals.forEach((el) => {
          revealFor(el.dataset.canReveal!).p = 1;
        });
      };
    });
  });

  return null;
}
