function Capabilities() {
  const { Airflow, Conveyor, Lightbulb } = window.Icons;
  const FadingVideo = window.FadingVideo;

  const cards = [
    {
      Icon: Airflow,
      title: "Precision Airflow",
      tags: ["Uniform Distribution", "Filtered Intake", "Energy Efficient", "ISO Certified"],
      body:
        "Engineered ducting and filtration deliver uniform, laminar airflow across the entire booth — eliminating dust, overspray, and inconsistent finishes.",
    },
    {
      Icon: Conveyor,
      title: "Batch Production",
      tags: ["Scale Fast", "Consistent Finish", "Time Saver", "Turnkey Ready"],
      body:
        "Run multiple vehicles through a single production line without sacrificing finish quality — built for high-throughput workshops and dealerships.",
    },
    {
      Icon: Lightbulb,
      title: "Smart Lighting",
      tags: ["LED Curing", "Even Coverage", "Long Lifespan", "Daylight Sync"],
      body:
        "Automatic LED curing and ambient lighting adjust to every panel, ensuring flawless color matching and faster cure times in any bay.",
    },
  ];

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background video — full bleed */}
      <FadingVideo
        src={window.CAPABILITIES_VIDEO_SRC}
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="relative z-10 px-8 md:px-16 lg:px-20 pt-24 pb-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="mb-auto">
          <p className="text-sm font-body text-white/80 mb-6">// Capabilities</p>
          <h2 className="font-heading italic text-white text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-[-3px]">
            Engineering
            <br />
            Evolved
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {cards.map(({ Icon, title, tags, body }) => (
            <div
              key={title}
              className="liquid-glass rounded-[1.25rem] p-6 min-h-[360px] flex flex-col"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="liquid-glass rounded-[0.75rem] w-11 h-11 flex items-center justify-center shrink-0">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%]">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90 font-body whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex-1" />

              <div className="mt-6">
                <h3 className="font-heading italic text-white text-3xl md:text-4xl tracking-[-1px] leading-none">
                  {title}
                </h3>
                <p className="mt-3 text-sm text-white/90 font-body font-light leading-snug max-w-[32ch]">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.Capabilities = Capabilities;
