import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Home, Database, BarChart3, Map, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { EASE_PREMIUM, springSnappy } from "../../lib/motion";

const NAV_LINKS: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: "Home",          href: "#home",     Icon: Home      },
  { label: "Data Catalog",  href: "#catalog",  Icon: Database  },
  { label: "Data Explorer", href: "#explorer", Icon: BarChart3 },
  { label: "Map Explorer",  href: "#map",      Icon: Map       },
  { label: "Team",          href: "#team",     Icon: Users     },
];

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
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-brand/10 bg-surface/80 backdrop-blur-2xl shadow-[0_4px_24px_rgba(37,99,235,0.07)]"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <a href="#home" className="group flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand/20 bg-white p-1.5 shadow-[0_0_14px_rgba(37,99,235,0.12)] transition-all duration-300 group-hover:shadow-brand group-hover:border-brand/40">
            <img
              src={`${import.meta.env.BASE_URL}ventusvision.png`}
              alt="Ventus Vision"
              className="h-full w-full object-contain"
            />
          </div>
          <span className="text-xl font-bold tracking-tight text-fg transition-colors duration-200">
            Ventus <span className="text-brand">Vision</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-0.5 rounded-full border border-brand/15 bg-surface/70 px-1.5 py-1.5 backdrop-blur-md shadow-[0_2px_16px_rgba(37,99,235,0.08)] md:flex"
        >
          {NAV_LINKS.map(({ label, href, Icon }) => {
            const id = href.slice(1);
            const isActive = active === id;
            return (
              <a
                key={href}
                href={href}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200",
                  isActive ? "text-white" : "text-fg-muted hover:text-fg",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full"
                    style={{ background: "linear-gradient(135deg, #2563EB, #06B6D4)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
                <Icon className={cn("relative h-3.5 w-3.5 shrink-0", isActive ? "text-white" : "text-fg-subtle")} />
                <span className="relative">{label}</span>
              </a>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="hidden items-center md:flex">
          <motion.a
            href="#catalog"
            whileHover={{ scale: 1.04, boxShadow: "0 8px 24px rgba(37,99,235,0.35)" }}
            whileTap={{ scale: 0.97 }}
            transition={springSnappy}
            className="flex items-center gap-2 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white shadow-brand"
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
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-fg-muted transition-colors hover:text-fg md:hidden"
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
            className="overflow-hidden border-t border-border bg-surface/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-fg-muted transition-colors hover:bg-base hover:text-fg"
                >
                  {label}
                </a>
              ))}
              <a
                href="#catalog"
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-full bg-brand px-5 py-2.5 text-center text-sm font-semibold text-white"
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
