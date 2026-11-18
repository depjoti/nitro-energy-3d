const LINES = ["Since", "2002", "Prod", "ucing"];

export function About() {
  return (
    <section
      id="about"
      data-can-section
      aria-labelledby="about-title"
      className="bg-stage relative min-h-svh overflow-hidden pt-20 pb-16 md:py-0"
    >
      <h2 id="about-title" className="sr-only">
        Since 2002 producing
      </h2>

      <div className="container-page relative flex min-h-[calc(100svh-12rem)] flex-col gap-10 md:h-svh md:min-h-0 md:flex-row md:items-center md:gap-0 md:px-0">
        {/* Tagline: in front of the can (z-20), right aligned on desktop. */}
        <p
          aria-hidden
          className="relative z-20 order-first font-display text-[18vw] leading-[0.86] font-black text-nitro uppercase italic md:absolute md:top-1/2 md:right-[4.6%] md:order-none md:-translate-y-1/2 md:text-right md:text-[9.6vw] md:leading-[0.9] min-[1920px]:text-[185px]"
        >
          {LINES.map((line) => (
            <span key={line} className="block overflow-hidden pr-[0.06em]">
              <span data-anim="about-line" className="block">
                {line}
              </span>
            </span>
          ))}
        </p>

        {/* Photo card. Placeholder until the Figma image is exported. */}
        <div className="relative z-0 aspect-[4/5] w-full md:absolute md:top-[11%] md:left-[3.4%] md:aspect-auto md:h-[83%] md:w-[46%]">
          <div
            data-anim="about-photo"
            className="absolute inset-0 overflow-hidden rounded-[1.75rem] bg-[radial-gradient(80%_60%_at_40%_30%,#3a3a3a_0%,#0d0d0d_100%)] grayscale"
          >
            <div className="absolute inset-0 bg-[repeating-linear-gradient(115deg,transparent_0_22px,rgba(255,255,255,0.025)_22px_23px)]" />
            <p className="absolute bottom-6 left-6 max-w-[16rem] text-sm leading-snug text-white/70">
              Fuelling athletes on and off the pitch for over two decades.
            </p>
          </div>
          {/* Mobile slot: across the photo. */}
          <div
            data-can-slot="about"
            className="absolute top-[22%] left-1/2 aspect-[896/340] w-[105%] -translate-x-1/2 -translate-y-1/2 [--can-rx:6] [--can-ry:-14] [--can-rz:-84] md:hidden"
          />
        </div>

        {/* Desktop slot: large can spanning the section, like the Figma. */}
        <div
          data-can-slot="about"
          className="absolute top-[52%] left-[50.7%] hidden aspect-[896/340] w-[77%] -translate-x-1/2 -translate-y-1/2 [--can-rx:4] [--can-ry:-10] [--can-rz:-90] md:block"
        />
      </div>
    </section>
  );
}
