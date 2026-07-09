import type { Profile } from "@/types/profile";
import { socials } from "@/config/socials";
import { site } from "@/config/site";

export const profile: Profile = {
  name: site.name,
  role: site.role,
  tagline: site.tagline,
  bio: "I'm Mohammad Haroon — a product engineer and designer. I help startups and founders ship interfaces that feel obvious, calm, and premium. My work lives at the intersection of design systems, frontend engineering, and product thinking.",
  location: site.location,
  available: site.available,
  socials,
};

export const values = [
  {
    title: "Craft over speed",
    description:
      "Details compound. I sweat spacing, motion, and copy the same way I sweat architecture — because that's what separates a product from a screen.",
  },
  {
    title: "Simple beats clever",
    description:
      "The best interfaces disappear. I default to boring, obvious solutions and only reach for complexity when the problem earns it.",
  },
  {
    title: "Outcomes, not deliverables",
    description:
      "I measure work by what it moves — activation, retention, revenue — not by the number of screens shipped.",
  },
  {
    title: "Systems that scale",
    description:
      "Tokens, components, and patterns that survive contact with the next hire, the next release, and the next redesign.",
  },
];

export const highlights = [
  { label: "Years shipping product", value: "8+" },
  { label: "Products launched", value: "40+" },
  { label: "Founding teams shipped with", value: "12" },
  { label: "Countries collaborated across", value: "18" },
];
