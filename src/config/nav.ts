export type NavItem = { label: string; to: string };

export const primaryNav: NavItem[] = [
  { label: "Projects", to: "/work" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "Contact", to: "/contact" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Work",
    items: [
      { label: "Projects", to: "/work" },
      { label: "Services", to: "/services" },
    ],
  },
  {
    title: "About",
    items: [
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Writing",
    items: [{ label: "Blog", to: "/blog" }],
  },
];
