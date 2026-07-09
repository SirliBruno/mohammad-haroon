import type { Profile } from "@/types/profile";
import { socials } from "@/config/socials";
import { site } from "@/config/site";

export const profile: Profile = {
  name: site.name,
  role: site.role,
  tagline: site.tagline,
  bio: "Mohammad Haroon is a product engineer and designer working at the intersection of interface, systems, and craft.",
  location: site.location,
  available: site.available,
  socials,
};
