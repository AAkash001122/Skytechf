import { useEffect } from 'react';
import { site } from '../config/site';

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/** Sets per-page title, description and Open Graph tags. */
export default function Seo({ title, description, path = '/' }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${site.name}` : `${site.name} | Web and Software Development Company in Mumbai`;
    document.title = fullTitle;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', `${site.url}${path}`);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
  }, [title, description, path]);
  return null;
}
