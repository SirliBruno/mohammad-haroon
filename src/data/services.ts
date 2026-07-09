import type { Service } from "@/features/services/schema";

export const services: Service[] = [
  {
    slug: "website-development",
    title: "Website Development",
    summary:
      "Fast, accessible, SEO-ready websites built on a modern stack — designed to convert and easy to maintain.",
    icon: "Globe",
    overview:
      "Custom marketing and business websites built with React, TypeScript and Tailwind. Everything from the visual design to the deployment pipeline is engineered for speed, accessibility and long-term maintainability.",
    benefits: [
      "Sub-second load times on real devices",
      "SEO fundamentals baked in from day one",
      "Accessible (WCAG 2.1 AA) by default",
      "Owned codebase — no vendor lock-in",
    ],
    features: [
      "Custom component design system",
      "Responsive layouts (mobile → 4K)",
      "CMS integration when needed",
      "Analytics & conversion tracking",
      "Contact forms & email automation",
      "Dark mode support",
    ],
    workflow: [
      { step: "01", title: "Discovery", description: "Understand goals, audience and success metrics." },
      { step: "02", title: "Design", description: "Wireframes and high-fidelity mocks in Figma." },
      { step: "03", title: "Build", description: "Ship components weekly with previews at every step." },
      { step: "04", title: "Launch", description: "QA, performance pass, deploy and handoff docs." },
    ],
    timeline: "2–5 weeks",
    technologies: ["React", "TypeScript", "Tailwind CSS", "TanStack Start", "Vite", "Cloudflare"],
    deliverables: [
      "Production-ready website",
      "Figma design source",
      "GitHub repository",
      "Deployment on your infra or ours",
      "30-day post-launch support",
    ],
    faq: [
      { q: "Do you handle hosting?", a: "Yes — I can deploy to Cloudflare, Vercel or your existing infra." },
      { q: "Can I edit content myself?", a: "Absolutely. I wire in a lightweight CMS (Sanity, Contentful, or Markdown) if you need it." },
      { q: "What about SEO?", a: "Semantic HTML, meta tags, OpenGraph, sitemap and JSON-LD are included." },
    ],
  },
  {
    slug: "wordpress-development",
    title: "WordPress Development",
    summary:
      "Custom WordPress themes, plugins and headless setups — polished, secure and easy for your team to run.",
    icon: "Layout",
    overview:
      "From bespoke themes to headless WordPress with a React frontend, I build WordPress sites that don't feel like WordPress — fast, secure and pleasant to author in.",
    benefits: [
      "Familiar editor for your team",
      "Custom blocks tailored to your brand",
      "Hardened security & regular updates",
      "Optional headless setup for extra speed",
    ],
    features: [
      "Custom theme development",
      "Gutenberg block library",
      "ACF-powered flexible content",
      "Multilingual (WPML / Polylang)",
      "Performance & caching setup",
      "Migration from other platforms",
    ],
    workflow: [
      { step: "01", title: "Audit", description: "Review content model, hosting and existing site (if any)." },
      { step: "02", title: "Design", description: "Design theme + custom blocks aligned to your brand." },
      { step: "03", title: "Develop", description: "Build the theme, blocks and integrations." },
      { step: "04", title: "Train", description: "Handover walkthrough and written documentation." },
    ],
    timeline: "3–6 weeks",
    technologies: ["WordPress", "PHP", "ACF", "Gutenberg", "MySQL", "WP-CLI"],
    deliverables: [
      "Custom WordPress theme",
      "Editor documentation",
      "Staging + production environments",
      "Automated backups configured",
      "30-day post-launch support",
    ],
    faq: [
      { q: "Do you use page builders?", a: "Only Gutenberg with custom blocks — no Elementor/Divi bloat." },
      { q: "Can you migrate my existing site?", a: "Yes — content, media and redirects are part of the scope." },
    ],
  },
  {
    slug: "woocommerce",
    title: "WooCommerce",
    summary:
      "Conversion-focused WooCommerce stores — from product design to checkout tuning and payment integration.",
    icon: "ShoppingBag",
    overview:
      "End-to-end WooCommerce stores built for conversion. Custom product templates, streamlined checkout, and integrations with the payment, shipping and marketing tools you actually use.",
    benefits: [
      "Higher conversion, lower cart abandonment",
      "Custom design — not another template",
      "Payment & shipping tailored to your market",
      "Scale-ready architecture",
    ],
    features: [
      "Custom product & category pages",
      "One-page / streamlined checkout",
      "Payment gateway integration",
      "Shipping zone & tax configuration",
      "Coupons, upsells & cross-sells",
      "Email automation (Klaviyo / Mailchimp)",
    ],
    workflow: [
      { step: "01", title: "Strategy", description: "Catalog structure, pricing, shipping and tax modeling." },
      { step: "02", title: "Design", description: "Home, PLP, PDP and checkout designed for conversion." },
      { step: "03", title: "Build", description: "Theme, plugins, integrations and payment setup." },
      { step: "04", title: "Launch", description: "Test orders, analytics, launch and monitor." },
    ],
    timeline: "4–8 weeks",
    technologies: ["WooCommerce", "WordPress", "Stripe", "PayPal", "Klaviyo", "PHP"],
    deliverables: [
      "Live store with real payments",
      "Product data import",
      "Order + email automation",
      "Analytics dashboards",
      "60-day post-launch support",
    ],
    faq: [
      { q: "Which payment providers do you support?", a: "Stripe, PayPal, Razorpay, and most regional gateways." },
      { q: "Can you migrate from Shopify?", a: "Yes — products, customers, orders and redirects." },
    ],
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    summary:
      "Research-backed interfaces that look premium and feel obvious — from flows and wireframes to polished screens.",
    icon: "Sparkles",
    overview:
      "Interface and experience design for web and mobile products. I focus on clarity, hierarchy and motion — the details that make software feel considered instead of assembled.",
    benefits: [
      "Interfaces users actually understand",
      "Consistent visual language across surfaces",
      "Design decisions grounded in real usage",
      "Developer-ready specs and tokens",
    ],
    features: [
      "User research & interviews",
      "Information architecture & flows",
      "Wireframes & high-fidelity mocks",
      "Design system & tokens",
      "Interactive prototypes",
      "Usability testing",
    ],
    workflow: [
      { step: "01", title: "Research", description: "Understand users, jobs-to-be-done and constraints." },
      { step: "02", title: "Wireframe", description: "Low-fi flows to align on structure before visuals." },
      { step: "03", title: "Design", description: "High-fidelity screens, prototype and micro-interactions." },
      { step: "04", title: "Handoff", description: "Specs, tokens and pairing with your engineers." },
    ],
    timeline: "2–6 weeks",
    technologies: ["Figma", "FigJam", "Framer", "Principle", "Notion"],
    deliverables: [
      "Figma source with organized libraries",
      "Interactive prototype",
      "Design tokens & specs",
      "Handoff documentation",
    ],
    faq: [
      { q: "Do you also implement the design?", a: "Yes — see Website Development if you need both under one roof." },
      { q: "Can you work with our existing design system?", a: "Absolutely — I extend, don't replace." },
    ],
  },
  {
    slug: "graphic-design",
    title: "Graphic Design",
    summary:
      "Brand identity, marketing assets and print — cohesive visuals that carry your product's voice everywhere.",
    icon: "Palette",
    overview:
      "Visual identity and marketing collateral: logos, brand systems, social media kits, pitch decks, and print. Designed to feel cohesive with your product, not tacked on.",
    benefits: [
      "One consistent visual language",
      "Ready-to-use templates for your team",
      "Print- and screen-ready files",
      "Room to grow — systems, not one-offs",
    ],
    features: [
      "Logo & brand identity",
      "Brand guidelines document",
      "Social media templates",
      "Pitch decks & one-pagers",
      "Print collateral (business cards, flyers)",
      "Iconography & illustration",
    ],
    workflow: [
      { step: "01", title: "Brief", description: "Understand brand personality, audience and competitors." },
      { step: "02", title: "Explore", description: "Multiple directions before narrowing to one." },
      { step: "03", title: "Refine", description: "Polish the chosen direction into a full system." },
      { step: "04", title: "Deliver", description: "Source files, exports and usage guidelines." },
    ],
    timeline: "1–4 weeks",
    technologies: ["Figma", "Illustrator", "Photoshop", "InDesign", "After Effects"],
    deliverables: [
      "Logo suite (all formats)",
      "Brand guidelines PDF",
      "Editable source files",
      "Asset library",
    ],
    faq: [
      { q: "How many logo concepts do I get?", a: "Three distinct directions, then refinement on the chosen one." },
      { q: "Do you do print production?", a: "Yes — I prep press-ready files and coordinate with your printer." },
    ],
  },
  {
    slug: "landing-pages",
    title: "Landing Pages",
    summary:
      "High-conversion landing pages designed and shipped in under two weeks — copy, design, and code included.",
    icon: "Rocket",
    overview:
      "Focused, single-purpose landing pages for launches, campaigns and paid acquisition. Every section is scoped around one goal: get the visitor to act.",
    benefits: [
      "Live in under two weeks",
      "Copy + design + code in one scope",
      "A/B test ready",
      "Fast on mobile — where it matters most",
    ],
    features: [
      "Conversion-focused copywriting",
      "Custom hero & feature sections",
      "Social proof & testimonials",
      "Lead capture forms",
      "Analytics & event tracking",
      "A/B test infrastructure",
    ],
    workflow: [
      { step: "01", title: "Brief", description: "Audience, offer and single conversion goal." },
      { step: "02", title: "Copy", description: "Draft messaging before pixels — copy drives layout." },
      { step: "03", title: "Design", description: "One direction, iterate quickly with you." },
      { step: "04", title: "Ship", description: "Deploy, connect analytics, monitor first week." },
    ],
    timeline: "5–10 days",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Vercel"],
    deliverables: [
      "Live landing page",
      "Copy in doc form",
      "Analytics dashboard",
      "Two weeks of iteration",
    ],
    faq: [
      { q: "Do you write the copy?", a: "Yes — copy is included and usually done before design." },
      { q: "Can you run A/B tests after launch?", a: "Yes — with a retainer or a follow-on sprint." },
    ],
  },
  {
    slug: "website-maintenance",
    title: "Website Maintenance",
    summary:
      "Monthly care plans that keep your site fast, secure and always improving — no surprise invoices.",
    icon: "Wrench",
    overview:
      "Ongoing maintenance and small improvements for websites and stores. Security updates, performance monitoring, backups, and a monthly budget of design/dev hours for the small changes that always come up.",
    benefits: [
      "Predictable monthly cost",
      "Peace of mind on security & backups",
      "A real person to email — not a ticket queue",
      "Continuous small improvements",
    ],
    features: [
      "Core, theme & plugin updates",
      "Uptime & performance monitoring",
      "Daily backups (offsite)",
      "Security scanning & hardening",
      "Monthly hours for content & tweaks",
      "Monthly report",
    ],
    workflow: [
      { step: "01", title: "Audit", description: "Baseline audit of security, performance and SEO." },
      { step: "02", title: "Stabilize", description: "Fix urgent issues before ongoing care begins." },
      { step: "03", title: "Maintain", description: "Monthly updates, monitoring and improvements." },
      { step: "04", title: "Report", description: "Clear monthly report on what changed and why." },
    ],
    timeline: "Ongoing (monthly)",
    technologies: ["UptimeRobot", "Cloudflare", "WP-CLI", "GitHub Actions", "Lighthouse"],
    deliverables: [
      "Monthly maintenance report",
      "Offsite backups",
      "Security & performance dashboards",
      "4–8 hours/month of design or dev work",
    ],
    faq: [
      { q: "Is there a minimum contract?", a: "Three months to start, then month-to-month." },
      { q: "What if I need more hours?", a: "Extra hours are billed at a discounted retainer rate." },
    ],
  },
];

export const serviceProcess = [
  {
    step: "01",
    title: "Discovery",
    description:
      "A short call to align on the problem, constraints, and what success looks like.",
  },
  {
    step: "02",
    title: "Proposal",
    description:
      "A one-page scope: what we're shipping, what we're deliberately not, timeline, and price.",
  },
  {
    step: "03",
    title: "Ship",
    description:
      "Weekly checkpoints, working software from day one, async by default.",
  },
  {
    step: "04",
    title: "Handoff",
    description:
      "You get everything — Figma, code, docs, rationale. Optional retainer to keep improving.",
  },
];

export const serviceFaq = [
  {
    q: "How do we start?",
    a: "Send a message via the contact page with a short brief. I reply within 48 hours with an honest take.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes — I work async with clients across time zones and align on 1–2 sync calls per week.",
  },
  {
    q: "How do you price projects?",
    a: "Fixed scope, fixed price — no hourly billing. You know the cost before we start.",
  },
  {
    q: "What if the scope changes mid-project?",
    a: "We re-scope openly. Small changes are absorbed; big ones get a short amendment.",
  },
];
