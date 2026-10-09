import { Link } from 'react-router-dom';

const base =
  'btn-shine inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60';

const variants = {
  primary: 'bg-primary text-bg shadow-md shadow-primary/20 hover:bg-primary/85 hover:shadow-[0_0_28px_-4px_var(--color-primary)]',
  secondary: 'border border-line bg-surface/60 text-ink hover:border-accent/60 hover:bg-surface hover:shadow-[0_0_22px_-8px_var(--color-blue)]',
  light: 'bg-ink text-bg hover:bg-ink/90',
  outline: 'border border-ink/40 text-ink hover:bg-ink/10',
};

/**
 * Renders a router Link (`to`), an external anchor (`href`) or a button.
 * External links open in a new tab with rel="noopener noreferrer".
 */
export default function Button({ to, href, variant = 'primary', className = '', children, ...rest }) {
  const classes = `${base} ${variants[variant]} ${className}`;
  if (to) return <Link to={to} className={classes} {...rest}>{children}</Link>;
  if (href) {
    const external = /^https?:/.test(href);
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return <button type="button" className={classes} {...rest}>{children}</button>;
}
