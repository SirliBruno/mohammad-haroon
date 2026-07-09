import type { Testimonial } from "@/features/testimonials/schema";

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Haroon has the rare combination of taste and execution. He shipped the kind of interface we'd been trying to build for a year — in six weeks.",
    author: "Sana Iqbal",
    role: "CEO",
    company: "Northwind",
  },
  {
    id: "t2",
    quote:
      "The best design-engineering hire we've made. Opinionated where it matters, quiet where it doesn't.",
    author: "David Chen",
    role: "CTO",
    company: "Lumen",
  },
  {
    id: "t3",
    quote:
      "He treats the product like it's his own. Our activation numbers speak for themselves.",
    author: "Marta Ruiz",
    role: "Head of Product",
    company: "Atelier",
  },
];
