import type { Project } from "@/features/projects/schema";

export const projects: Project[] = [
  {
    slug: "northwind-analytics",
    title: "Northwind — Analytics for operators",
    summary:
      "Redesigned the reporting surface from a spreadsheet clone into a focused, opinionated dashboard.",
    description:
      "Northwind's original analytics product asked users to build every chart from scratch. We inverted the model — leading with a set of opinionated, decision-ready views. Time-to-first-insight dropped from 12 minutes to under 40 seconds.",
    role: "Lead product designer & frontend engineer",
    client: "Northwind",
    year: 2025,
    tags: ["SaaS", "Analytics", "Design system"],
    stack: ["React", "TypeScript", "Tailwind", "Postgres", "Recharts"],
    cover: { src: "", alt: "Northwind dashboard cover" },
    gallery: [],
    metrics: [
      { label: "Time to first insight", value: "-93%" },
      { label: "Weekly active reports", value: "+218%" },
      { label: "Support tickets", value: "-41%" },
    ],
    featured: true,
    status: "live",
  },
  {
    slug: "lumen-payments",
    title: "Lumen — Payments infrastructure UI",
    summary:
      "A calm, developer-first control plane for a fast-growing embedded payments API.",
    description:
      "Designed and shipped the merchant dashboard, developer console, and onboarding flows for Lumen. Focus: making a complex financial product feel legible without dumbing it down.",
    role: "Product designer & frontend engineer",
    client: "Lumen",
    year: 2024,
    tags: ["Fintech", "Developer tools", "Dashboard"],
    stack: ["Next.js", "TypeScript", "tRPC", "Stripe"],
    cover: { src: "", alt: "Lumen dashboard cover" },
    gallery: [],
    metrics: [
      { label: "Merchant activation", value: "+64%" },
      { label: "Time-to-first-charge", value: "-71%" },
    ],
    featured: true,
    status: "live",
  },
  {
    slug: "atelier-cms",
    title: "Atelier — A CMS designers actually enjoy",
    summary:
      "Rethought the content model, editor, and publishing flow for a boutique headless CMS.",
    description:
      "Rebuilt the editing experience around the writer, not the schema. Delivered a block-based editor, live preview, and a component library that agencies could extend without leaving guardrails.",
    role: "Design + engineering lead",
    client: "Atelier",
    year: 2024,
    tags: ["CMS", "Editor", "Design system"],
    stack: ["React", "TipTap", "Node", "Postgres"],
    cover: { src: "", alt: "Atelier editor cover" },
    gallery: [],
    metrics: [
      { label: "Editor NPS", value: "72" },
      { label: "Publish time", value: "-58%" },
    ],
    featured: true,
    status: "live",
  },
  {
    slug: "field-notes",
    title: "Field Notes — A journaling app for teams",
    summary:
      "A quiet, keyboard-first product for engineering teams to capture decisions.",
    description:
      "Concept product exploring how a lightweight, structured journal could replace the scattered doc-sprawl inside high-velocity teams.",
    role: "Founding designer",
    year: 2023,
    tags: ["Productivity", "Concept"],
    stack: ["React", "Tauri", "SQLite"],
    cover: { src: "", alt: "Field Notes cover" },
    gallery: [],
    featured: false,
    status: "concept",
  },
];
