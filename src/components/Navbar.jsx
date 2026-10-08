import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import { site } from '../config/site';
import Logo from './Logo';

const isCurrent = (to, pathname) => (to === '/' ? pathname === '/' : pathname.startsWith(to));

/** Floating glass navbar. A pill slides between the hovered item and the current page. */
export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(null);

  const current = site.nav.find((n) => isCurrent(n.to, pathname))?.to ?? null;
  const pillOn = hovered ?? current;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
      <nav
        aria-label="Main"
        className={`mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-2 rounded-2xl lg:gap-4 border px-3 transition-all duration-300 sm:px-4 lg:h-24 ${
          scrolled || open
            ? 'border-ink/15 bg-bg/80 shadow-xl shadow-bg/50 backdrop-blur-xl'
            : 'border-ink/10 bg-bg/40 backdrop-blur-md'
        }`}
      >
        <Logo />

        <ul className="hidden items-center gap-1 md:flex" onMouseLeave={() => setHovered(null)}>
          {site.nav.map((item) => (
            <li key={item.to} onMouseEnter={() => setHovered(item.to)}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                onFocus={() => setHovered(item.to)}
                onBlur={() => setHovered(null)}
                className={({ isActive }) =>
                  `relative block rounded-lg px-2.5 py-2 text-sm font-medium lg:px-4 transition-colors duration-200 ${
                    isActive || hovered === item.to ? 'text-ink' : 'text-muted'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {pillOn === item.to && (
                      <motion.span
                        layoutId="nav-pill"
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 rounded-lg bg-ink/10"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-dot"
                        aria-hidden="true"
                        className="absolute -bottom-0.5 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-accent"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            to="/contact"
            className="group hidden items-center gap-2 whitespace-nowrap rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-bg transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_28px_-4px] hover:shadow-primary active:scale-95 md:inline-flex lg:px-5"
          >
            Get a Free Quote
            <ArrowRight size={16} aria-hidden="true" className="hidden transition-transform group-hover:translate-x-0.5 lg:block" />
          </Link>
          <button
            type="button"
            className="rounded-lg border border-ink/10 p-2 text-ink transition-colors hover:bg-ink/10 md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 max-w-6xl rounded-2xl border border-ink/15 bg-bg/95 p-3 shadow-xl shadow-bg/50 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {site.nav.map((item, i) => (
                <motion.li
                  key={item.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.25 }}
                >
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium ${
                        isActive ? 'bg-ink/10 text-ink' : 'text-muted hover:bg-ink/5 hover:text-ink'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        {isActive && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />}
                      </>
                    )}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
            <Link
              to="/contact"
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-bg transition-transform active:scale-95"
            >
              Get a Free Quote <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
