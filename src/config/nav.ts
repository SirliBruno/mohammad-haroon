export type NavItem = { label: string; to: string };

export const primaryNav: NavItem[] = [
  { label: "الرئيسية", to: "/" },
  { label: "نبذة عني", to: "/about" },
  { label: "المشاريع", to: "/work" },
  { label: "الخدمات", to: "/services" },
  { label: "الخبرات", to: "/career" },
  { label: "المدونة", to: "/blog" },
  { label: "تواصل معي", to: "/contact" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "الأعمال",
    items: [
      { label: "المشاريع", to: "/work" },
      { label: "الخدمات", to: "/services" },
    ],
  },
  {
    title: "التعريف",
    items: [
      { label: "نبذة عني", to: "/about" },
      { label: "تواصل معي", to: "/contact" },
    ],
  },
  {
    title: "مصادر",
    items: [
      { label: "المدونة", to: "/blog" },
      { label: "الخبرات", to: "/career" },
    ],
  },
];
