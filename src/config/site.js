// Edit this file to change company text, links and contact info across the whole site.
// Items marked [VERIFY] or [ADD ...] are placeholders you must replace before launch.

export const site = {
  name: 'SkyTech',
  url: 'https://skytech.example.com', // [VERIFY] your real domain
  tagline: 'We build web and software products that grow your business.',
  valueProp:
    'Custom web apps, SaaS platforms and business software, designed, built and supported by one focused team.',
  trustLine: 'Clean code. Transparent pricing. On-time delivery.',
  status: 'Available for new projects',

  contact: {
    location: 'Mumbai, India',
    email: 'akr256181@gmail.com',
    phone: '+91 84199 70652',
    whatsappNumber: '918419970652', // digits only, with country code
    whatsappMessage: 'Hi SkyTech, I would like to discuss a project.',
    bookCallUrl: 'https://cal.com/your-link', // [ADD] your Calendly / Cal.com link
  },

  socials: [
    { label: 'LinkedIn', icon: 'linkedin', url: 'https://www.linkedin.com/company/skytech' }, // [VERIFY]
    { label: 'GitHub', icon: 'github', url: 'https://github.com/skytech' }, // [VERIFY]
    { label: 'X (Twitter)', icon: 'x', url: 'https://x.com/skytech' }, // [VERIFY]
    { label: 'Instagram', icon: 'instagram', url: 'https://instagram.com/skytech' }, // [VERIFY]
  ],

  nav: [
    { label: 'Home', to: '/' },
    { label: 'Services', to: '/services' },
    { label: 'About', to: '/about' },
    { label: 'Career', to: '/career' },
    { label: 'Contact', to: '/contact' },
  ],

  services: [
    { icon: 'Code2', title: 'Custom web applications', featured: true,
      text: 'Fast, secure web apps built around how your business actually works, from first prototype to production scale.',
      points: ['Workflow automation and client portals', 'Secure sign-in and user roles', 'Architecture that scales with you'] },
    { icon: 'Layers', title: 'SaaS products', featured: true,
      text: 'Multi-tenant platforms with billing, roles and dashboards, ready to onboard your first paying customers.',
      points: ['Subscriptions and billing', 'Multi-tenant architecture', 'Usage and analytics dashboards'] },
    { icon: 'LayoutDashboard', title: 'Business software', featured: true,
      text: 'CRM, ERP, dashboards and CMS tools that replace spreadsheets and manual work.',
      points: ['CRM, ERP and CMS systems', 'Reports and live dashboards', 'Integrations with your existing tools'] },
    { icon: 'ShoppingCart', title: 'E-commerce websites',
      text: 'Fast storefronts with secure checkout, inventory and order management.',
      points: ['Secure checkout', 'Inventory and order management', 'Fast, SEO-friendly storefronts'] },
    { icon: 'Smartphone', title: 'Mobile-friendly web apps',
      text: 'Responsive, installable apps that feel native on every screen.',
      points: ['Responsive on every screen', 'Installable web apps (PWA)', 'Touch-friendly interfaces'] },
    { icon: 'Server', title: 'API and backend development',
      text: 'Clean REST APIs, databases and integrations that stay reliable under load.',
      points: ['Clean REST APIs', 'Database design', 'Third-party integrations'] },
    { icon: 'LifeBuoy', title: 'Maintenance and support',
      text: 'Updates, monitoring and quick fixes so your product keeps running smoothly.',
      points: ['Bug fixes and updates', 'Monitoring', 'Priority support'] },
  ],

  process: [
    { icon: 'Search', title: 'Discovery',
      text: 'We learn your goals, users and constraints, then agree on scope, timeline and cost before anything is built.',
      points: ['Goals and user research', 'Scope and priorities', 'Clear timeline and quote'] },
    { icon: 'PenTool', title: 'Design',
      text: 'Wireframes and clickable designs you can review and approve before any code is written.',
      points: ['Wireframes and user flows', 'Clickable prototype', 'Your sign-off before we build'] },
    { icon: 'Code2', title: 'Development',
      text: 'Short sprints with working demos, so you see real progress every week.',
      points: ['Weekly demos', 'Clean, reviewed code', 'Regular progress updates'] },
    { icon: 'ShieldCheck', title: 'Testing',
      text: 'Functional, device and performance testing to catch problems before your users do.',
      points: ['Functional and device testing', 'Performance and security checks', 'Bug fixing before launch'] },
    { icon: 'Rocket', title: 'Launch',
      text: 'Smooth deployment, domain and hosting setup, and a launch-day checklist.',
      points: ['Deployment and hosting', 'Domain and SSL setup', 'Launch-day support'] },
    { icon: 'Headset', title: 'Support',
      text: 'Ongoing maintenance, fixes and improvements as your product grows.',
      points: ['Bug fixes and updates', 'Monitoring', 'A roadmap for what comes next'] },
  ],

  techGroups: [
    { title: 'Frontend', text: 'Fast, accessible interfaces your users enjoy.',
      items: [{ name: 'React', slug: 'react' }, { name: 'Next.js', slug: 'nextjs' }, { name: 'TypeScript', slug: 'typescript' }, { name: 'Tailwind CSS', slug: 'tailwind' }] },
    { title: 'Backend', text: 'Reliable APIs and logic that scale with you.',
      items: [{ name: 'Node.js', slug: 'nodejs' }, { name: 'Express', slug: 'express' }, { name: 'Python', slug: 'python' }] },
    { title: 'Databases', text: 'Data stored safely and fetched quickly.',
      items: [{ name: 'MongoDB', slug: 'mongodb' }, { name: 'PostgreSQL', slug: 'postgresql' }] },
    { title: 'Cloud and DevOps', text: 'Smooth deployment and dependable hosting.',
      items: [{ name: 'AWS', slug: 'aws' }, { name: 'Docker', slug: 'docker' }, { name: 'Git', slug: 'git' }] },
  ],

  why: [
    { icon: 'Zap', title: 'Fast delivery', tag: 'Weekly demos',
      text: 'A clear schedule and working software every week, so you see progress early and often.' },
    { icon: 'MessagesSquare', title: 'Clear communication', tag: 'One point of contact',
      text: 'Honest updates and no jargon. You always know where things stand and what comes next.' },
    { icon: 'Blocks', title: 'Scalable code', tag: 'Clean and documented',
      text: 'Well-structured, tested code that grows with your business and is easy for any developer to pick up.' },
    { icon: 'ShieldCheck', title: 'Post-launch support', tag: 'Support plans',
      text: 'We stay with you after launch with fixes, monitoring and improvements as your product grows.' },
  ],

  engagement: [
    { title: 'Fixed price', text: 'A defined scope, timeline and budget agreed up front. Best for well-understood projects and MVPs.',
      visual: 'milestones',
      points: ['Clear scope and milestones', 'Predictable budget', 'Best for MVPs and launches'] },
    { title: 'Hourly', text: 'Flexible, pay-for-what-you-use work. Best when requirements will evolve as you learn.',
      visual: 'clock',
      points: ['Change direction anytime', 'Transparent time reports', 'Best for ongoing improvements'], highlight: true },
    { title: 'Dedicated developer', text: 'A developer who works as part of your team, full-time or part-time, month to month.',
      visual: 'team',
      points: ['Works in your tools and process', 'Scale up or down monthly', 'Best for long-term products'] },
  ],

  faqs: [
    { q: 'How much does a project cost?',
      a: 'It depends on scope and complexity. After a short discovery call we send a clear, itemised quote. You choose fixed price, hourly or a dedicated developer, with no hidden fees.' },
    { q: 'How long will my project take?',
      a: 'A focused MVP usually takes 4 to 8 weeks. Larger platforms take longer. We agree on a timeline with milestones before we start and share progress every week.' },
    { q: 'Who owns the code?',
      a: 'You do. Once the project is paid for, all source code, designs and assets are yours, and we hand over repositories and documentation.' },
    { q: 'Do you offer support after launch?',
      a: 'Yes. We offer maintenance and support plans covering bug fixes, updates, monitoring and new features.' },
    { q: 'Which technologies do you use?',
      a: 'We mostly build with React, Node.js, MongoDB and PostgreSQL, and deploy on AWS or similar. We pick what fits your product, not what is trendy.' },
  ],

  // [VERIFY] Culture statements are general. Edit them to match how you really work.
  careers: {
    intro: 'We are a small team that cares about craft. If you like owning your work and shipping real products, we would like to hear from you.',
    values: [
      { icon: 'Blocks', title: 'Real products', text: 'Work on live products for real clients, not demo projects.' },
      { icon: 'Zap', title: 'Room to grow', text: 'Learn by building, with honest feedback and room to take on more.' },
      { icon: 'MessagesSquare', title: 'Small team, direct talk', text: 'No layers or politics. Your ideas are heard and used.' },
      { icon: 'ShieldCheck', title: 'Quality first', text: 'We write clean code and review each other work.' },
    ],
    // [ADD OPEN ROLES] Leave empty to show the "send your resume" message.
    // Example: { title: 'React Developer', type: 'Full-time', location: 'Mumbai / Remote', summary: 'What the role involves.' }
    roles: [],
    hiring: [
      { title: 'Apply', text: 'Send your resume, portfolio or GitHub and a few lines about yourself.' },
      { title: 'Intro chat', text: 'A relaxed conversation about your experience and what you want to do next.' },
      { title: 'Practical task', text: 'A short task that reflects real work, so you can show what you can do.' },
      { title: 'Offer', text: 'A clear offer and a smooth start.' },
    ],
  },

  about: {
    intro:
      'SkyTech is a small software studio based in Mumbai. We help startups, growing businesses and media companies turn ideas into reliable web products.',
    story:
      'We started SkyTech because good software should not need a huge budget or a confusing process. We keep teams small, communication direct and quality high.', // [VERIFY] edit with your real story
    values: [
      { title: 'Plain talk', text: 'No buzzwords. We explain trade-offs clearly so you can decide with confidence.' },
      { title: 'Ownership', text: 'We treat your product like our own and speak up when something will not work.' },
      { title: 'Craft', text: 'Readable code, accessible interfaces and attention to detail.' },
    ],
  },
};

export const projectTypes = [
  'Custom web application',
  'SaaS product',
  'Business software (CRM/ERP/CMS)',
  'E-commerce website',
  'API / backend development',
  'Maintenance and support',
  'Something else',
];

export const budgetRanges = [
  'Not sure yet',
  'Under ₹1 lakh',
  '₹1 – 3 lakh',
  '₹3 – 10 lakh',
  '₹10 lakh+',
];

export const whatsappLink = (message = site.contact.whatsappMessage) =>
  `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
