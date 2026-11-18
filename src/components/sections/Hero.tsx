import { SocialLinks } from "@/components/ui/SocialLinks";

const WORD = "NITRO".split("");

export function Hero() {
  return (
    <section
      id="home"
      data-can-section
      aria-labelledby="hero-title"
      className="bg-stage relative flex min-h-svh flex-col overflow-hidden pt-20 md:pt-24"
    >
      <h1 id="hero-title" className="sr-only">
        Nitro Energy Drink
      </h1>

      <div className="relative flex flex-1 items-center justify-center">
        {/* Giant wordmark sits behind the 3D can (z-0 < canvas z-10). */}
        <p
          aria-hidden
          className="relative z-0 flex select-none font-display text-[29.5vw] leading-[0.8] font-black tracking-[-0.03em] italic min-[1920px]:text-[566px]"
        >
          {WORD.map((letter, i) => (
            // Outer span: scroll parallax. Inner span: intro. Separate so the tweens never fight.
            <span key={i} data-anim="hero-letter-wrap" className="inline-block">
              <span data-intro data-anim="hero-letter" className="text-nitro-gradient inline-block pr-[0.02em]">
                {letter}
              </span>
            </span>
          ))}
        </p>

        {/*
          Where the can sits. Phones: standing, slightly tilted, so the word stays readable.
          Tablet & desktop: lying across the word, like the Figma.
        */}
        <div
          data-can-slot="hero"
          className="absolute top-1/2 left-1/2 aspect-[340/896] h-[min(50svh,118vw)] -translate-x-1/2 -translate-y-1/2 [--can-rx:6] [--can-rz:-12] md:aspect-[896/340] md:h-auto md:w-[46.7%] md:[--can-rx:0] md:[--can-ry:-6] md:[--can-rz:-90]"
        />
      </div>

      <div className="container-page relative z-20 grid grid-cols-1 items-center gap-6 pb-8 md:grid-cols-2 md:pb-[clamp(2rem,9vh,9rem)] lg:grid-cols-[1fr_auto_1fr]">
        <p
          data-intro
          data-anim="hero-fade"
          className="max-w-[29rem] text-sm leading-[1.5] text-white/85 uppercase md:col-span-2 md:text-base lg:col-span-1"
        >
          Zero sugar. Full voltage. Clean caffeine, B-vitamins and electrolytes for the ones who never slow down.
        </p>
        <div data-intro data-anim="hero-fade" className="flex gap-3 md:gap-5 lg:justify-center">
          <a href="#shop" className="btn btn-light min-w-36">
            Buy Now
          </a>
          <a href="#about" className="btn btn-outline min-w-36">
            More info
          </a>
        </div>
        <div data-intro data-anim="hero-fade" className="md:justify-self-end">
          <SocialLinks />
        </div>
      </div>
    </section>
  );
}
