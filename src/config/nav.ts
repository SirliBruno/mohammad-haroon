export type NavItem = { label: string; to: string; href?: string };

export const primaryNav: NavItem[] = [
  { label: "الخدمات", to: "/#what-i-build" },
  { label: "الأعمال", to: "/#work" },
  { label: "كيف أعمل", to: "/#how-it-works" },
  { label: "عرض 499 ريال", to: "/#offer" },
  { label: "عني", to: "/#about" },
  { label: "الأسئلة", to: "/#faq" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "التنقل",
    items: [
      { label: "الخدمات", to: "/#what-i-build" },
      { label: "الأعمال", to: "/#work" },
      { label: "كيف أعمل", to: "/#how-it-works" },
    ],
  },
  {
    title: "عني والتواصل",
    items: [
      { label: "عني", to: "/#about" },
      { label: "الأسئلة الشائعة", to: "/#faq" },
      { label: "ابدأ مشروعك", to: "/#contact-form" },
    ],
  },
];
