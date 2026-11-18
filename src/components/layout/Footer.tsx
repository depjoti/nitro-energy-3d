import { SocialLinks } from "@/components/ui/SocialLinks";
import { navLinks } from "@/lib/navigation";

const MARQUEE = ["Zero sugar", "Full voltage", "Since 2002", "Unleash the energy"];

export function Footer() {
  return (
    <footer id="contact" className="relative z-20 border-t border-white/10 bg-black">
      <div id="gallery" aria-hidden className="overflow-hidden border-b border-white/10 py-6 md:py-8">
        <div className="flex w-max animate-marquee gap-10 pr-10 font-display text-5xl font-black whitespace-nowrap text-transparent uppercase italic [-webkit-text-stroke:1.5px_var(--color-nitro)] md:text-7xl">
          {[...MARQUEE, ...MARQUEE].map((word, i) => (
            <span key={i} className="flex items-center gap-10">
              {word}
              <span className="text-nitro [-webkit-text-stroke:0]">⚡</span>
            </span>
          ))}
        </div>
      </div>

      <div className="container-page grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div>
          <p className="font-display text-5xl font-black text-nitro italic md:text-6xl">NITRO</p>
          <p className="mt-4 max-w-sm text-white/60">
            Zero sugar energy, built for athletes and everyone who refuses to slow down.
          </p>
          <SocialLinks className="mt-8" />
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm tracking-[0.2em] text-white/40 uppercase">Explore</h2>
          <ul className="mt-5 space-y-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-white/80 transition-colors hover:text-nitro">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm tracking-[0.2em] text-white/40 uppercase">Contact</h2>
          <address className="mt-5 space-y-3 text-white/80 not-italic">
            <p>
              <a href="mailto:hello@nitro.example" className="transition-colors hover:text-nitro">
                hello@nitro.example
              </a>
            </p>
            <p>Mon – Fri, 9:00 – 18:00</p>
          </address>
        </div>
      </div>

      <div className="container-page flex flex-col gap-2 border-t border-white/10 py-6 text-sm text-white/40 md:flex-row md:justify-between">
        <p>© 2026 Nitro Energy. All rights reserved.</p>
        <p>Drink responsibly. Not recommended for children or pregnant women.</p>
      </div>
    </footer>
  );
}
