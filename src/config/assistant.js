// Answers for the on-site assistant. Everything here is built from src/config/site.js,
// so edit the site config and the assistant stays in sync.
import { site, whatsappLink } from './site';

const { contact } = site;

export const welcome =
  'Hi, I am the SkyTech assistant. I can tell you about our services, technologies and how to start a project. What would you like to know?';

export const quickActions = [
  { label: 'Explore Services', intent: 'services', icon: 'Layers' },
  { label: 'Our Technologies', intent: 'technologies', icon: 'Cpu' },
  { label: 'Get a Quote', intent: 'quote', icon: 'FileText' },
  { label: 'Contact Us', intent: 'contact', icon: 'Mail' },
  { label: 'About Us', intent: 'about', icon: 'Building2' },
];

const techSummary = site.techGroups
  .map((g) => `${g.title}: ${g.items.map((t) => t.name).join(', ')}`)
  .join('. ');

const replies = {
  greeting: {
    text: 'Hello! Ask me about our services, technologies, pricing or how to contact the team, or pick one of the options below.',
  },
  services: {
    text: `Our services: ${site.services.map((s) => s.title).join(', ')}. Tell me what you are planning and I will point you to the right place.`,
    links: [{ label: 'View all services', to: '/services' }],
  },
  technologies: {
    text: `${techSummary}. We choose what fits your product, not what is trendy.`,
    links: [{ label: 'See our process', to: '/services' }],
  },
  quote: {
    text: 'Happy to help. We work on fixed price, hourly or with a dedicated developer, and send a clear itemised quote after a short call. Share a few details and the team will reply within one working day.',
    links: [
      { label: 'Get a free quote', to: '/contact' },
      { label: 'Book a call', href: contact.bookCallUrl },
    ],
  },
  contact: {
    text: `You can reach us at ${contact.email} or on ${contact.phone} (WhatsApp). We are based in ${contact.location}.`,
    links: [
      { label: 'Chat on WhatsApp', href: whatsappLink() },
      { label: 'Email us', href: `mailto:${contact.email}` },
      { label: 'Contact page', to: '/contact' },
    ],
  },
  about: {
    text: site.about.intro,
    links: [{ label: 'About SkyTech', to: '/about' }],
  },
  career: {
    text: site.careers.intro,
    links: [{ label: 'See careers', to: '/career' }],
  },
  portfolio: {
    text: 'We have built a music, video and movie distribution platform, a film content management system and a music platform. The case studies have the details.',
    links: [{ label: 'View our work', to: '/portfolio' }],
  },
  timeline: { text: site.faqs[1].a, links: [{ label: 'Plan my project', to: '/contact' }] },
  ownership: { text: site.faqs[2].a },
  support: { text: site.faqs[3].a },
  fallback: {
    text: 'I am not sure about that one, but our team can help. You can ask me about services, technologies, pricing or contact options, or message the team directly.',
    links: [
      { label: 'Contact the team', to: '/contact' },
      { label: 'WhatsApp', href: whatsappLink() },
    ],
  },
};

const rules = [
  ['quote', /\b(quote|price|pricing|cost|budget|estimate|rate|charge|how much)\b/i],
  ['timeline', /\b(timeline|how long|deadline|duration|weeks?|months?|delivery time)\b/i],
  ['ownership', /\b(own|ownership|source code|ip|rights)\b/i],
  ['support', /\b(support|maintenance|maintain|after launch|bug)\b/i],
  ['career', /\b(career|job|jobs|hiring|hire|vacancy|intern|work with you|join)\b/i],
  ['portfolio', /\b(portfolio|case stud|projects?|previous work|examples?|clients?)\b/i],
  ['technologies', /\b(tech|technology|technologies|stack|react|node|mongo|postgres|python|aws|docker|javascript|typescript)\b/i],
  ['services', /\b(service|services|build|develop|website|web app|app|saas|crm|erp|cms|e-?commerce|api|software)\b/i],
  ['contact', /\b(contact|call|email|mail|phone|whatsapp|reach|talk|speak|location|address|where)\b/i],
  ['about', /\b(about|who are you|who is|team|company|skytech|what do you do)\b/i],
  ['greeting', /^\s*(hi|hello|hey|hola|namaste|good (morning|afternoon|evening))\b/i],
];

export function detectIntent(text) {
  return rules.find(([, re]) => re.test(text))?.[0] ?? 'fallback';
}

export function reply(intent) {
  return replies[intent] ?? replies.fallback;
}
