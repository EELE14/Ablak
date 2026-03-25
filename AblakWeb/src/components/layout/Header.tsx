/* Copyright (c) 2026 eele14. All Rights Reserved. */
import { useEffect, useState } from "react";
import { Copy, Check, Menu, X } from "lucide-react";
import { watchViewport } from "ablak";
import { cn } from "../../lib/utils";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS_FULL: NavLink[] = [
  { label: "Parallax", href: "#parallax" },
  { label: "Cursor", href: "#cursor" },
  { label: "Scroll", href: "#scroll" },
  { label: "Tilt", href: "#tilt" },
  { label: "Velocity", href: "#velocity" },
  { label: "Position", href: "#position" },
  { label: "API", href: "#api" },
];

const NAV_LINKS_MOBILE: NavLink[] = [
  { label: "The name", href: "#the-name" },
  { label: "What it gives", href: "#what-it-gives-you" },
  { label: "The loop", href: "#the-render-loop" },
  { label: "The API", href: "#the-api" },
  { label: "Tilt", href: "#tilt" },
];

interface HeaderProps {
  mobileOnly?: boolean;
}

export function Header({ mobileOnly = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    return watchViewport(
      ({ scroll }) => {
        const over = scroll.top > 30;
        setScrolled((prev) => (prev === over ? prev : over));
      },
      { only: ["scroll"] },
    );
  }, []);

  const navLinks = mobileOnly ? NAV_LINKS_MOBILE : NAV_LINKS_FULL;

  function handleCopy() {
    void navigator.clipboard.writeText("npm install ablak-ts").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleNavClick() {
    setMenuOpen(false);
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 pt-2">
      <div className="relative max-w-6xl mx-auto px-4">
        <div
          className={cn(
            "relative z-10 flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-300",
            scrolled || menuOpen
              ? "glass border border-white/10 shadow-lg shadow-black/20"
              : "bg-transparent",
          )}
        >
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gradient">ablak</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-zinc-100 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop npm button */}
          <button
            onClick={handleCopy}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono hover:bg-indigo-500/20 transition-colors"
          >
            {copied ? (
              <Check size={12} className="text-green-400" />
            ) : (
              <Copy size={12} />
            )}
            npm install ablak-ts
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div
          className="md:hidden absolute left-2 right-2"
          style={{
            top: "calc(100% + 8px)",
            transform: menuOpen ? "translateY(0)" : "translateY(-250%)",
            animation: menuOpen
              ? "header-dropdown-in 280ms cubic-bezier(0.16, 1, 0.3, 1) forwards"
              : "none",
            pointerEvents: menuOpen ? "auto" : "none",
            zIndex: 0,
          }}
        >
          <div className="glass border border-white/10 rounded-2xl px-5 py-4 shadow-lg shadow-black/20">
            <nav className="flex flex-col gap-1 mb-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <button
              onClick={() => {
                handleCopy();
                handleNavClick();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono hover:bg-indigo-500/20 transition-colors"
            >
              {copied ? (
                <Check size={12} className="text-green-400" />
              ) : (
                <Copy size={12} />
              )}
              npm install ablak-ts
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
