import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUp,
  Mail,
  Lock,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { site, whatsappLink } from "../config/site";
import { useNotifications } from "../admin/NotificationsContext";
import { BrandIcon } from "./Icon";
import { Container } from "./Section";
import Logo from "./Logo";

const linkClass =
  "group inline-flex items-center gap-2 py-1 text-muted transition-all duration-300 hover:translate-x-1 hover:text-ink";

function FooterLink({ to, children }) {
  return (
    <Link to={to} className={linkClass}>
      <span
        aria-hidden="true"
        className="h-px w-0 bg-accent transition-all duration-300 group-hover:w-3"
      />
      {children}
    </Link>
  );
}

function Column({ title, children, className = "" }) {
  return (
    <div className={className}>
      <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-ink">
        <span aria-hidden="true" className="text-accent-text">
          /{" "}
        </span>
        {title}
      </h2>
      <ul className="mt-4 space-y-1.5 text-sm">{children}</ul>
    </div>
  );
}

const company = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Career", to: "/career" },
  { label: "Contact", to: "/contact" },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5, ease: "easeOut" },
};

export default function Footer() {
  const { contact } = site;
  // Same unread count as the admin navbar bell; null/0 for visitors (no admin session, no polling).
  const unread = useNotifications()?.unread ?? 0;
  const contactCard =
    "group flex items-center gap-3 rounded-2xl border border-ink/10 bg-ink/3 p-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:bg-accent/10";
  const iconBox =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110";

  return (
    <footer className="relative overflow-hidden border-t border-line bg-surface/40 pb-24 pt-14 sm:pb-12 sm:pt-16">
      <div
        aria-hidden="true"
        className="dot-grid pointer-events-none absolute inset-0 opacity-40"
      />
      <div
        aria-hidden="true"
        className="cta-animated absolute inset-x-0 top-0 h-px opacity-70"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-1 overflow-hidden opacity-[0.14]"
      >
        <div className="marquee flex w-max whitespace-nowrap font-mono text-[10px] tracking-[0.3em] text-success">
          {[0, 1].map((n) => (
            <span key={n} className="pr-8">
              01010011 01101011 01111001 01010100 01100101 01100011 01101000
              00100000 01001111 01001110 01001100 01001001 01001110 01000101
              00100000 11010011 00101110 10110010{" "}
            </span>
          ))}
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 right-0 h-80 w-80 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--color-blue) 14%, transparent), transparent)",
        }}
      />

      <Container className="relative">
        <motion.div
          {...fadeUp}
          className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.4fr_0.8fr_1.2fr_1.3fr] lg:gap-x-10"
        >
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Logo sizeClass="h-12 sm:h-14" />
            <p className="mt-4 max-w-sm text-sm text-muted">{site.tagline}</p>

            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-ink/15 px-3 py-1.5 text-xs text-ink/80">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              {site.status}
            </p>
            <ul className="mt-6 flex gap-2.5">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-ink/15 text-muted transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:bg-accent/10 hover:text-primary"
                  >
                    <BrandIcon name={s.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Company">
            <Column title="Company">
              {company.map((l) => (
                <li key={l.label}>
                  <FooterLink to={l.to}>{l.label}</FooterLink>
                </li>
              ))}
            </Column>
          </nav>

          <nav aria-label="Services">
            <Column title="Services">
              {site.services.map((s) => (
                <li key={s.title}>
                  <FooterLink to="/services">{s.title}</FooterLink>
                </li>
              ))}
            </Column>
          </nav>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-ink">
              <span aria-hidden="true" className="text-accent-text">
                /{" "}
              </span>
              Contact
            </h2>
            <ul className="mt-4 grid gap-2.5 text-sm sm:grid-cols-2 lg:grid-cols-1">
              <li>
                <a href={`mailto:${contact.email}`} className={contactCard}>
                  <span className={iconBox}>
                    <Mail size={18} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 wrap-break-word text-muted transition-colors group-hover:text-ink">
                    {contact.email}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={contactCard}
                >
                  <span className={iconBox}>
                    <MessageCircle size={18} aria-hidden="true" />
                  </span>
                  <span className="text-muted transition-colors group-hover:text-ink">
                    {contact.phone} <span className="text-xs">(WhatsApp)</span>
                  </span>
                </a>
              </li>
              <li className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-ink/3 p-3.5 text-muted sm:col-span-2 lg:col-span-1">
                <span className={iconBox}>
                  <MapPin size={18} aria-hidden="true" />
                </span>
                {contact.location}
              </li>
            </ul>
            <Link
              to="/contact"
              className="group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-bg transition-all duration-300 hover:bg-primary/85 hover:shadow-[0_0_30px_-6px] hover:shadow-primary sm:w-auto"
            >
              Get a Free Quote
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </motion.div>

        <div className="mt-12 flex flex-col-reverse items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <p className="text-center text-xs text-muted sm:text-left">
              © {new Date().getFullYear()} {site.name}. All rights reserved.
            </p>
            <Link
              to="/admin/login"
              aria-label={
                unread
                  ? `Admin, ${unread} unread message${unread === 1 ? "" : "s"}`
                  : "Admin login"
              }
              title={
                unread
                  ? `${unread} unread message${unread === 1 ? "" : "s"}`
                  : "Admin login"
              }
              className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-ink/10 text-muted/70 transition-colors hover:border-accent hover:text-primary"
            >
              <Lock size={14} aria-hidden="true" />
              {unread > 0 && (
                <span
                  data-footer-badge
                  aria-hidden="true"
                  className="absolute -right-2 -top-2 z-10 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-bg shadow-[0_0_0_2px_var(--color-surface)]"
                >
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
            </Link>
          </div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2.5 text-xs font-semibold text-muted transition-colors hover:border-accent hover:text-ink"
          >
            Back to top
            <ArrowUp
              size={14}
              aria-hidden="true"
              className="transition-transform group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </Container>
    </footer>
  );
}
