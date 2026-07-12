function Navbar() {
  const { ArrowUpRight } = window.Icons;

  const links = ["Home", "Products", "Solutions", "Technology", "Get a Quote"];

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-16">
      {/* Logomark */}
      <a
        href="#"
        className="liquid-glass rounded-full w-12 h-12 flex items-center justify-center shrink-0"
        aria-label="Matin home"
      >
        <span className="font-heading italic text-white text-2xl leading-none lowercase">m</span>
      </a>

      {/* Center pill (desktop only) */}
      <div className="hidden lg:flex liquid-glass rounded-full items-center px-1.5 py-1.5">
        {links.map((link) => (
          <a
            key={link}
            href="#"
            className="px-3 py-2 text-sm font-medium text-white/90 font-body"
          >
            {link}
          </a>
        ))}
        <a
          href="#"
          className="bg-white text-black rounded-full px-4 py-2 text-sm font-medium font-body flex items-center gap-1 whitespace-nowrap ml-1"
        >
          Request a Quote
          <ArrowUpRight className="h-4 w-4" />
        </a>
      </div>

      {/* Invisible spacer to balance the logomark */}
      <div className="w-12 h-12 invisible shrink-0" />
    </nav>
  );
}

window.Navbar = Navbar;
