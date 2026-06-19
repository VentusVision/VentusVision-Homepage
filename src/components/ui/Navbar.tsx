import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { EASE_PREMIUM, springSnappy } from "../../lib/motion";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Platform", href: "#platform" },
  { label: "Data Streams", href: "#data" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_LINKS.map(({ href }) => href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE_PREMIUM }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled
          ? "border-b border-white/[0.06] bg-ink/80 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <a href="#home" className="group flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/40 bg-gradient-to-br from-cyan-400/20 to-blue-600/25 shadow-[0_0_14px_rgba(34,211,238,0.22)] transition-all duration-300 group-hover:shadow-[0_0_28px_rgba(34,211,238,0.5)] group-hover:border-cyan-400/60">
            <span className="text-[11px] font-extrabold tracking-tighter text-cyan-300">VV</span>
          </div>
          <span className="text-base font-bold tracking-tight text-white transition-colors duration-200">
            Ventus <span className="text-cyan-300">Vision</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-0.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-1.5 py-1.5 backdrop-blur-md md:flex"
        >
          {NAV_LINKS.map(({ label, href }) => {
            const id = href.slice(1);
            const isActive = active === id;
            return (
              <a
                key={href}
                href={href}
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200",
                  isActive ? "text-white" : "text-white/50 hover:text-white/80",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-white/10"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative">{label}</span>
              </a>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="hidden items-center md:flex">
          <motion.a
            href="#features"
            whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(34,211,238,0.45)" }}
            whileTap={{ scale: 0.97 }}
            transition={springSnappy}
            className="flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-black shadow-glow"
          >
            Explore
            <ArrowRight className="h-3.5 w-3.5" />
          </motion.a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-colors hover:text-white md:hidden"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: EASE_PREMIUM }}
            className="overflow-hidden border-t border-white/[0.06] bg-ink/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {label}
                </a>
              ))}
              <a
                href="#features"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-full bg-cyan-400 px-5 py-2.5 text-center text-sm font-semibold text-black"
              >
                Explore Marketplace
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
