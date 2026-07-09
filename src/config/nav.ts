export type NavItem = { label: string; to: string };

export const primaryNav: NavItem[] = [
  { label: "Work", to: "/work" },
  { label: "Services", to: "/services" },
  { label: "Products", to: "/products" },
  { label: "Writing", to: "/writing" },
  { label: "About", to: "/about" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Explore",
    items: [
      { label: "Work", to: "/work" },
      { label: "Products", to: "/products" },
      { label: "Ideas", to: "/ideas" },
      { label: "Uses", to: "/uses" },
    ],
  },
  {
    title: "Connect",
    items: [
      { label: "Services", to: "/services" },
      { label: "Writing", to: "/writing" },
      { label: "Contact", to: "/contact" },
    ],
  },
];
