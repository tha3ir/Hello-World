function Hero() {
  const { motion } = window.Motion;
  const { ArrowUpRight, Play, Gear, Factory } = window.Icons;
  const FadingVideo = window.FadingVideo;
  const BlurText = window.BlurText;
  const Navbar = window.Navbar;

  const entrance = (delay) => ({
    initial: { filter: "blur(10px)", opacity: 0, y: 20 },
    animate: { filter: "blur(0px)", opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut", delay },
  });

  const stats = [
    { Icon: Gear, number: "12+ Years", label: "Industrial Engineering Experience" },
    { Icon: Factory, number: "90+ Booths", label: "Delivered Across the Region" },
  ];

  // [REPLACE WITH REAL CLIENT/PARTNER NAMES]
  const partners = ["AutoPro", "Elite Garage", "Prime Motors", "GulfWorks", "Trident"];

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background video — 120% scale, focal point at the top of frame */}
      <FadingVideo
        src={window.HERO_VIDEO_SRC}
        className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top z-0"
        style={{ width: "120%", height: "120%" }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <Navbar />

        {/* Hero content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center pt-24 px-4">
          {/* Badge */}
          <motion.div
            {...entrance(0.4)}
            className="liquid-glass rounded-full flex items-center gap-3 p-1"
          >
            <span className="bg-white text-black rounded-full px-3 py-1 text-xs font-semibold font-body">
              New
            </span>
            <span className="text-sm text-white/90 font-body pr-3">
              Next-Gen Paint Booths Now Available Across the Kingdom
            </span>
          </motion.div>

          {/* Headline */}
          <BlurText
            text="Engineer Beyond the Ordinary Inside Every Booth"
            className="mt-6 text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-white leading-[0.8] max-w-2xl justify-center tracking-[-4px]"
          />

          {/* Subheading */}
          <motion.p
            {...entrance(0.8)}
            className="mt-4 text-sm md:text-base text-white max-w-2xl font-body font-light leading-tight"
          >
            We design and deliver industrial paint booths and workshop equipment
            engineered for precision airflow, flawless finishes, and zero downtime
            — built for the demands of the Saudi and GCC market.
          </motion.p>

          {/* CTAs */}
          <motion.div {...entrance(1.1)} className="flex items-center gap-6 mt-6">
            <a
              href="#"
              className="liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-medium font-body text-white flex items-center gap-2"
            >
              Request a Quote
              <ArrowUpRight className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-sm font-medium font-body text-white flex items-center gap-2"
            >
              Watch It In Action
              <Play className="h-4 w-4" />
            </a>
          </motion.div>

          {/* Stats row */}
          <motion.div {...entrance(1.3)} className="flex items-stretch gap-4 mt-8">
            {stats.map(({ Icon, number, label }) => (
              <div
                key={number}
                className="liquid-glass rounded-[1.25rem] p-5 w-[220px] flex flex-col justify-between text-left text-white"
              >
                <Icon size={28} />
                <div className="mt-6">
                  <div className="font-heading italic text-4xl tracking-[-1px] leading-none">
                    {number}
                  </div>
                  <div className="text-xs font-body font-light mt-2">{label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Partners */}
        <motion.div
          {...entrance(1.4)}
          className="flex flex-col items-center gap-4 pb-8"
        >
          <div className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium font-body text-white">
            Trusted by auto body shops and workshops across Saudi Arabia and the GCC
          </div>
          <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16">
            {partners.map((name) => (
              <span
                key={name}
                className="font-heading italic text-white text-2xl md:text-3xl tracking-tight"
              >
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

window.Hero = Hero;
