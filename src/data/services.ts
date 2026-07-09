import type { Service } from "@/features/services/schema";

export const services: Service[] = [
  {
    slug: "product-design-sprint",
    title: "Product design sprint",
    summary:
      "A focused two-week engagement to move a specific product surface from vague to shippable.",
    deliverables: [
      "Problem framing & success metrics",
      "Interaction & visual design in Figma",
      "Front-end prototype in your stack",
      "Handoff doc with rationale & open questions",
    ],
    engagement: "project",
    startingAt: "$9k",
  },
  {
    slug: "design-engineering-retainer",
    title: "Design engineering retainer",
    summary:
      "An embedded design + frontend partner for teams shipping a premium product weekly.",
    deliverables: [
      "Weekly design + implementation cycles",
      "Design system extension & maintenance",
      "Pair with your engineers on the tricky bits",
      "Async in your Linear / Slack of choice",
    ],
    engagement: "retainer",
    startingAt: "$12k / mo",
  },
  {
    slug: "advisory",
    title: "Advisory & audits",
    summary:
      "A senior lens on your product, design system, or hiring — without a long-term commitment.",
    deliverables: [
      "Product & UX audit with prioritized fixes",
      "Design system health check",
      "Hiring loop review & rubric",
      "Founder office hours",
    ],
    engagement: "advisory",
    startingAt: "$2k",
  },
];

export const serviceProcess = [
  {
    step: "01",
    title: "Discovery",
    description:
      "A short call to align on the problem, constraints, and what success looks like. If we're not a fit, I'll tell you.",
  },
  {
    step: "02",
    title: "Proposal",
    description:
      "A one-page scope: what we're shipping, what we're deliberately not, timeline, and price. Fixed, not billed hourly.",
  },
  {
    step: "03",
    title: "Ship",
    description:
      "Weekly checkpoints, working software from day one, async by default. No status meetings for their own sake.",
  },
  {
    step: "04",
    title: "Handoff",
    description:
      "You get everything — Figma, code, docs, rationale. Optional retainer to keep improving after launch.",
  },
];

export const serviceFaq = [
  {
    q: "Do you take equity?",
    a: "Occasionally, for early-stage teams I believe in — always alongside cash, never instead of it.",
  },
  {
    q: "Which stacks do you work in?",
    a: "React / TypeScript / Tailwind end-to-end. Comfortable across Next.js, TanStack, Remix, and most modern backends.",
  },
  {
    q: "Can you work with our in-house team?",
    a: "Yes — that's most of my work. I embed, pair, and hand things off cleanly.",
  },
  {
    q: "What if I only need a small piece?",
    a: "Start with an advisory session. If it grows into something bigger, we scope it then.",
  },
];
