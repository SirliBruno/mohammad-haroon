export interface DeliverableFolder {
  id: string;
  title: string;
  category: string;
  summary: string;
  cover: string;
  images: Array<{ src: string; alt: string }>;
  projectSlug?: string;
}

export interface ClientEntity {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: "هوية" | "متاجر" | "مواقع" | "أنظمة" | "مطبوعات" | "تسويق";
  categoryLabel: string;
  year: number;
  featured?: boolean;
  services: string[];
  mainSlug: string;
  folders: DeliverableFolder[];
}

export const clientEntities: ClientEntity[] = [
  {
    id: "sports-creativity",
    name: "مجمع الإبداع الرياضي",
    tagline: "هوية بصرية متكاملة، بروفايل الأنشطة، وتصاميم السوشيال ميديا",
    description: "مشروع متكامل شمل ابتكار شعار حيوي يعبر عن النشاط والطاقة، تصميم بروفايل تعريفي بأنشطة المجمع، ومجموعة تصاميم إعلانية لمنصات التواصل الاجتماعي.",
    category: "هوية",
    categoryLabel: "هوية بصرية ومطبوعات",
    year: 2022,
    featured: true,
    services: ["تصميم الهوية والشعار", "تصميم البروفايل والمطبوعات", "تصاميم السوشيال ميديا"],
    mainSlug: "sports-creativity",
    folders: [
      {
        id: "sports-identity",
        title: "الهوية البصرية والشعار",
        category: "هوية",
        summary: "بناء الرمز البصري ودليل استخدام الهوية مع نماذج موك أب واقعية.",
        cover: "/images/projects/sports-creativity/cover.png",
        images: [
          { src: "/images/projects/sports-creativity/cover.png", alt: "شعار مجمع الإبداع الرياضي" },
          { src: "/images/projects/sports-creativity/gallery-1.png", alt: "دليل الهوية وتطبيقاتها" },
          { src: "/images/projects/sports-creativity/gallery-2.png", alt: "موك اب الشعار على المطبوعات" },
          { src: "/images/projects/sports-creativity/gallery-3.png", alt: "تطبيقات الهوية على القرطاسية" }
        ],
        projectSlug: "sports-creativity"
      },
      {
        id: "sports-profile",
        title: "بروفايل المجمع والمطبوعات",
        category: "مطبوعات",
        summary: "كتيب تعريفي بالبرامج الرياضية والمرافق المتوفرة بالمجمع.",
        cover: "/images/projects/sports-creativity/gallery-1.png",
        images: [
          { src: "/images/projects/sports-creativity/gallery-1.png", alt: "صفحات بروفايل مجمع الإبداع 1" },
          { src: "/images/projects/sports-creativity/gallery-2.png", alt: "صفحات بروفايل مجمع الإبداع 2" }
        ],
        projectSlug: "sports-creativity"
      },
      {
        id: "sports-social",
        title: "تصاميم السوشيال ميديا",
        category: "تسويق",
        summary: "قوالب منشورات وبانرات إعلانية للمسابقات والفعاليات الرياضية.",
        cover: "/images/projects/sports-creativity/gallery-3.png",
        images: [
          { src: "/images/projects/sports-creativity/gallery-3.png", alt: "بوست سوشيال ميديا مجمع الإبداع" },
          { src: "/images/projects/sports-creativity/cover.png", alt: "بانر إعلاني مجمع الإبداع" }
        ],
        projectSlug: "sports-creativity"
      }
    ]
  },
  {
    id: "laviola-sweets",
    name: "متجر لافيولا سويتز",
    tagline: "تصميم متجر إلكتروني فاخر، كروت الشكر، وتطبيقات التغليف",
    description: "تصميم واجهة متجر إلكتروني متكامل للحلويات مع تجربة مستخدم سلسة وهيكل يبرز المنتجات، مع بطاقات الشكر وتطبيقات البكجينج.",
    category: "متاجر",
    categoryLabel: "متاجر إلكترونية وتغليف",
    year: 2024,
    featured: true,
    services: ["تصميم المتجر (UI/UX)", "تطبيقات التغليف وبطاقات الشكر", "تحسين مسار الطلب"],
    mainSlug: "laviola-sweets",
    folders: [
      {
        id: "laviola-store",
        title: "المتجر الإلكتروني (UI/UX)",
        category: "متاجر",
        summary: "واجهة متجر حديثة مع مسار شراء ميسر وتصنيف واضح لأصناف الحلويات.",
        cover: "/images/projects/laviola-sweets/cover.png",
        images: [
          { src: "/images/projects/laviola-sweets/cover.png", alt: "واجهة متجر لافيولا سويتز" },
          { src: "/images/projects/laviola-sweets/gallery-1.png", alt: "لقطة من متجر لافيولا سويتز 1" },
          { src: "/images/projects/laviola-sweets/gallery-2.png", alt: "لقطة من متجر لافيولا سويتز 2" }
        ],
        projectSlug: "laviola-sweets"
      },
      {
        id: "laviola-packaging",
        title: "بطاقات الشكر وتطبيقات الهوية",
        category: "هوية",
        summary: "تصميم كروت الشكر الفاخرة المرفقة مع كل طلب وتنسيق الألوان الملكية.",
        cover: "/images/projects/laviola-sweets/cover.png",
        images: [
          { src: "/images/projects/laviola-sweets/cover.png", alt: "بطاقة شكر لافيولا سويتز" },
          { src: "/images/projects/laviola-sweets/gallery-3.png", alt: "تطبيقات الهوية على العلب" }
        ],
        projectSlug: "laviola-sweets"
      }
    ]
  },
  {
    id: "ion-advertising",
    name: "وكالة أيون للدعاية والإعلان",
    tagline: "الهوية البصرية المتكاملة، دليل العلامة، وإعلانات الطرق",
    description: "تطوير هوية بصرية شاملة تعكس طابع الابتكار والإبداع لوكالة أيون، شملت الشعار، المطبوعات، وإعلانات الطرق (Billboard & Mupi).",
    category: "هوية",
    categoryLabel: "هوية بصرية وإعلانات",
    year: 2023,
    featured: true,
    services: ["تصميم الهوية ودليل العلامة", "تصاميم إعلانات الطرق", "المطبوعات والقرطاسية"],
    mainSlug: "ion-advertising",
    folders: [
      {
        id: "ion-identity",
        title: "الهوية البصرية والشعار",
        category: "هوية",
        summary: "تصميم الرمز البصري المعبر ولوحة الألوان والخطوط الرسمية للوكالة.",
        cover: "/images/projects/ion-advertising/cover.png",
        images: [
          { src: "/images/projects/ion-advertising/cover.png", alt: "إعلان خارجي لوكالة أيون" },
          { src: "/images/projects/ion-advertising/gallery-1.png", alt: "تطبيقات الهوية البصرية" },
          { src: "/images/projects/ion-advertising/gallery-2.png", alt: "لوحة ألوان وشعار أيون" }
        ],
        projectSlug: "ion-advertising"
      },
      {
        id: "ion-campaigns",
        title: "إعلانات الطرق والمطبوعات",
        category: "تسويق",
        summary: "تصاميم اللافتات الإعلانية الخارجية واللوحات الطرقية للوكالة.",
        cover: "/images/projects/ion-advertising/cover.png",
        images: [
          { src: "/images/projects/ion-advertising/cover.png", alt: "لافتة طريق وكالة أيون" },
          { src: "/images/projects/ion-advertising/gallery-3.png", alt: "مطبوعات ورقية ومغلفات أيون" }
        ],
        projectSlug: "ion-advertising"
      }
    ]
  },
  {
    id: "chardon-brand",
    name: "براند شاردون للأزياء",
    tagline: "علامة تجارية فاخرة، الشعار الرمزي، والقرطاسية",
    description: "ابتكار علامة تجارية فريدة لشاردون تجمع بين البساطة والأناقة الراقية مع تطبيقات متكاملة على الحقائب وبطاقات الأعمال.",
    category: "هوية",
    categoryLabel: "هوية بصرية وعلامات تجارية",
    year: 2024,
    featured: true,
    services: ["تصميم العلامة والشعار", "تصميم القرطاسية وبطاقات الأعمال", "تطبيقات أكياس التسوق"],
    mainSlug: "chardon-brand",
    folders: [
      {
        id: "chardon-logo",
        title: "الرمز البصري والشعار",
        category: "هوية",
        summary: "تصميم الأيقونة الهندسية والخط المخصص لاسم العلامة.",
        cover: "/images/projects/chardon-brand/cover.png",
        images: [
          { src: "/images/projects/chardon-brand/cover.png", alt: "شعار براند شاردون" },
          { src: "/images/projects/chardon-brand/gallery-1.png", alt: "موك اب شعار شاردون" }
        ],
        projectSlug: "chardon-brand"
      },
      {
        id: "chardon-stationery",
        title: "القرطاسية وتطبيقات الهوية",
        category: "مطبوعات",
        summary: "بطاقات الأعمال والمظاريف وحقائب التسوق الورقية الفاخرة.",
        cover: "/images/projects/chardon-brand/gallery-2.png",
        images: [
          { src: "/images/projects/chardon-brand/gallery-2.png", alt: "قرطاسية براند شاردون" },
          { src: "/images/projects/chardon-brand/gallery-3.png", alt: "تطبيقات الهوية والطباعة" }
        ],
        projectSlug: "chardon-brand"
      }
    ]
  },
  {
    id: "sindyan-agri",
    name: "شركة السنديان الزراعية",
    tagline: "الهوية المؤسسية، الشعار الزراعي، والمطبوعات الميدانية",
    description: "تصميم شعار وهوية متكاملة لشركة السنديان الزراعية، مع تجسيد مفاهيم النماء والإنتاج الزراعي وتطبيقها على المطبوعات واللوحات.",
    category: "هوية",
    categoryLabel: "هوية مؤسسية ومطبوعات",
    year: 2023,
    featured: true,
    services: ["تصميم الشعار الزراعي", "تصميم المطبوعات الميدانية", "دلائل استخدام الهوية"],
    mainSlug: "sindyan-agri",
    folders: [
      {
        id: "sindyan-logo",
        title: "الشعار والهوية المؤسسية",
        category: "هوية",
        summary: "رمز السنبلة والأوراق الزراعية بالألوان الخضراء الطبيعية.",
        cover: "/images/projects/sindyan-agri/cover.png",
        images: [
          { src: "/images/projects/sindyan-agri/cover.png", alt: "شعار شركة السنديان الزراعية" },
          { src: "/images/projects/sindyan-agri/gallery-1.jpg", alt: "تطبيق الشعار على البيئة الزراعية" }
        ],
        projectSlug: "sindyan-agri"
      },
      {
        id: "sindyan-prints",
        title: "المطبوعات والكتالوجات",
        category: "مطبوعات",
        summary: "تصميم بطاقات التعريف وكتالوجات المنتجات الزراعية.",
        cover: "/images/projects/sindyan-agri/gallery-2.png",
        images: [
          { src: "/images/projects/sindyan-agri/gallery-2.png", alt: "مطبوعات شركة السنديان 1" },
          { src: "/images/projects/sindyan-agri/gallery-3.png", alt: "مطبوعات شركة السنديان 2" }
        ],
        projectSlug: "sindyan-agri"
      }
    ]
  },
  {
    id: "asean-union",
    name: "اتحاد آسيان",
    tagline: "تصميم الموقع الإلكتروني الرسمي وتطبيقات الهوية الرقمية",
    description: "تصميم واجهات موقع اتحاد آسيان بأسلوب رسمي واحترافي يعزز الحضور الرقمي ويوفر تجربة تصفح سريعة وميسرة للزوار على جميع الأجهزة.",
    category: "مواقع",
    categoryLabel: "مواقع إلكترونية وهوية",
    year: 2023,
    featured: true,
    services: ["تصميم واجهات الموقع (UI/UX)", "التجاوب مع الهواتف الذكية", "الهوية الرقمية"],
    mainSlug: "asean-union",
    folders: [
      {
        id: "asean-web",
        title: "تصميم واجهة الموقع",
        category: "مواقع",
        summary: "تصميم الصفحة الرئيسية وصفحات الأنشطة والأخبار المتجاوبة.",
        cover: "/images/projects/asean-union/cover.png",
        images: [
          { src: "/images/projects/asean-union/cover.png", alt: "الموقع الرسمي لاتحاد آسيان" },
          { src: "/images/projects/asean-union/gallery-1.png", alt: "لقطة من واجهة موقع اتحاد آسيان 1" },
          { src: "/images/projects/asean-union/gallery-2.png", alt: "لقطة من واجهة موقع اتحاد آسيان 2" }
        ],
        projectSlug: "asean-union"
      },
      {
        id: "asean-branding",
        title: "الهوية الرقمية والبروفايل",
        category: "هوية",
        summary: "عناصر العرض الرقمي والمستندات الرسمية للاتحاد.",
        cover: "/images/projects/asean-union/gallery-3.png",
        images: [
          { src: "/images/projects/asean-union/gallery-3.png", alt: "الهوية الرقمية لاتحاد آسيان" }
        ],
        projectSlug: "asean-union"
      }
    ]
  },
  {
    id: "enjoy-with-us",
    name: "وكالة تمتع معنا للسياحة",
    tagline: "الهوية السياحية، بروشورات البرامج، وبوستات السوشيال ميديا",
    description: "تطوير هوية بصرية مفعمة بالحيوية لوكالة تمتع معنا مع تصميم بروشورات المزارات السياحية وبرامج الرحلات الموسمية.",
    category: "هوية",
    categoryLabel: "هوية سياحية ومطبوعات",
    year: 2023,
    services: ["تصميم الهوية والشعار", "تصميم برشورات الرحلات والمزارات", "تصاميم السوشيال ميديا"],
    mainSlug: "enjoy-with-us",
    folders: [
      {
        id: "enjoy-identity",
        title: "الهوية البصرية والشعار",
        category: "هوية",
        summary: "شعار سياحي عصري يعكس المتعة والاستكشاف في السعودية.",
        cover: "/images/projects/enjoy-with-us/cover.png",
        images: [
          { src: "/images/projects/enjoy-with-us/cover.png", alt: "شعار وكالة تمتع معنا" },
          { src: "/images/projects/enjoy-with-us/gallery-1.png", alt: "تطبيقات الهوية السياحية" }
        ],
        projectSlug: "enjoy-with-us"
      },
      {
        id: "enjoy-brochures",
        title: "برشورات وجداول الرحلات",
        category: "مطبوعات",
        summary: "تصميم بروشورات مزارات المدينة المنورة ورحلات الطائف السياحية.",
        cover: "/images/projects/taif-trip/cover.png",
        images: [
          { src: "/images/projects/taif-trip/cover.png", alt: "برشور رحلة الطائف السياحية" },
          { src: "/images/projects/taif-trip/gallery-1.png", alt: "تفاصيل برامج الرحلات السياحية" }
        ],
        projectSlug: "taif-trip"
      },
      {
        id: "enjoy-social",
        title: "تصاميم السوشيال ميديا",
        category: "تسويق",
        summary: "بوستات ترويجية لعروض المواسم والرحلات عبر إنستغرام وواتساب.",
        cover: "/images/projects/enjoy-with-us/gallery-2.png",
        images: [
          { src: "/images/projects/enjoy-with-us/gallery-2.png", alt: "بوست سوشيال ميديا تمتع معنا 1" },
          { src: "/images/projects/enjoy-with-us/gallery-3.png", alt: "بوست سوشيال ميديا تمتع معنا 2" }
        ],
        projectSlug: "enjoy-with-us"
      }
    ]
  },
  {
    id: "naktl-rice",
    name: "شركة نكتل للمنتجات الغذائية",
    tagline: "تصميم وتغليف المنتجات (Packaging) وهوية أكياس الأرز الفاخر",
    description: "تصميم متكامل لأكياس أرز نكتل البسمتي الفاخر، ركز على إبراز الجودة العالية من خلال لمسات ذهبية وموك أب واقعي للطباعة والتسويق.",
    category: "مطبوعات",
    categoryLabel: "تغليف منتجات (Packaging)",
    year: 2022,
    services: ["تصميم التغليف والعبوات", "تصميم الموك أب الواقعي", "تجهيز ملفات الطباعة"],
    mainSlug: "naktl-rice",
    folders: [
      {
        id: "naktl-pack",
        title: "تصميم كيس أرز نكتل الفاخر",
        category: "مطبوعات",
        summary: "موك أب احترافي لكيس الأرز مع تنسيق العناصر الذهبية وشعار الجودة.",
        cover: "/images/projects/naktl-rice/cover.png",
        images: [
          { src: "/images/projects/naktl-rice/cover.png", alt: "موك اب كيس رز نكتل الفاخر" },
          { src: "/images/projects/naktl-rice/gallery-1.png", alt: "تصميم كيس الرز بخلفية بيضاء" },
          { src: "/images/projects/naktl-rice/gallery-2.png", alt: "تفاصيل النقوش والزخارف" },
          { src: "/images/projects/naktl-rice/gallery-3.png", alt: "شعار وعلامة نكتل على الكيس" }
        ],
        projectSlug: "naktl-rice"
      }
    ]
  },
  {
    id: "rayhanah-mawadda",
    name: "وكالة ريحانة مودة",
    tagline: "تصاميم الحملات الإعلانية الموسمية وإعلانات العمرة",
    description: "تصميم الحملات التسويقية والإعلانات الرقمية لخدمات العمرة والضيافة، شملت بوستات تفاعلية وبانرات للواتساب ومواقع التواصل.",
    category: "تسويق",
    categoryLabel: "تصميم إعلاني وسوشيال ميديا",
    year: 2022,
    services: ["تصميم الحملات الإعلانية", "منشورات الواتساب ومواقع التواصل", "العروض الموسمية"],
    mainSlug: "rayhanah-mawadda",
    folders: [
      {
        id: "rayhana-campaigns",
        title: "تصاميم حملات العمرة والضيافة",
        category: "تسويق",
        summary: "إعلانات موسمية جذابة تعكس الروحانية وتوضح باقات وبرامج العمرة.",
        cover: "/images/projects/rayhanah-mawadda/cover.png",
        images: [
          { src: "/images/projects/rayhanah-mawadda/cover.png", alt: "إعلان ريحانة مودة لحملات العمرة" },
          { src: "/images/projects/rayhanah-mawadda/gallery-1.png", alt: "تصميم باقات العمرة المميزة" },
          { src: "/images/projects/rayhanah-mawadda/gallery-2.png", alt: "بوست إعلاني ريحانة مودة" }
        ],
        projectSlug: "rayhanah-mawadda"
      }
    ]
  },
  {
    id: "hilton-store",
    name: "متجر هيلتون",
    tagline: "تصميم واجهة المتجر الإلكتروني وبانرات العروض الترويجية",
    description: "متجر إلكتروني حديث يركز على سهولة التحويل وتجربة التسوق السريعة مع نظام بانرات ترويجي متناسق.",
    category: "متاجر",
    categoryLabel: "متاجر إلكترونية",
    year: 2023,
    services: ["تصميم المتجر (UI/UX)", "تصميم بانرات العروض", "تحسين مسار الشراء"],
    mainSlug: "hilton-store",
    folders: [
      {
        id: "hilton-ui",
        title: "واجهة المتجر الإلكتروني",
        category: "متاجر",
        summary: "شاشات التصفح، بطاقات المنتجات، وطرق الدفع السريعة.",
        cover: "/images/projects/hilton-store/cover.png",
        images: [
          { src: "/images/projects/hilton-store/cover.png", alt: "واجهة متجر هيلتون" },
          { src: "/images/projects/hilton-store/gallery-1.png", alt: "لقطة من متجر هيلتون 1" },
          { src: "/images/projects/hilton-store/gallery-2.png", alt: "لقطة من متجر هيلتون 2" }
        ],
        projectSlug: "hilton-store"
      }
    ]
  },
  {
    id: "lexlles-store",
    name: "متجر ليكسلز (Lexlles)",
    tagline: "تصميم متجر إلكتروني عصري للأزياء والمنتجات الحديثة",
    description: "واجهة متجر بأسلوب مينيمالي أنيق يبرز المنتجات ويوفر تصفحاً ممتعاً وسهلاً على مختلف مقاسات الشاشات.",
    category: "متاجر",
    categoryLabel: "متاجر إلكترونية",
    year: 2023,
    services: ["تصميم المتجر", "UI/UX", "تنظيم الأقسام"],
    mainSlug: "lexlles-store",
    folders: [
      {
        id: "lexlles-ui",
        title: "شاشات المتجر الإلكتروني",
        category: "متاجر",
        summary: "واجهات الأقسام وتفاصيل المنتجات وسلة الشراء.",
        cover: "/images/projects/lexlles-store/cover.jpg",
        images: [
          { src: "/images/projects/lexlles-store/cover.jpg", alt: "واجهة متجر ليكسلز" },
          { src: "/images/projects/lexlles-store/gallery-1.jpg", alt: "لقطة من متجر ليكسلز 1" },
          { src: "/images/projects/lexlles-store/gallery-2.jpg", alt: "لقطة من متجر ليكسلز 2" }
        ],
        projectSlug: "lexlles-store"
      }
    ]
  },
  {
    id: "company-profile-corp",
    name: "بروفايل الشركة التعريفي",
    tagline: "تصميم كتيب تعريفي رسمي (Company Profile) مطبوع ورقمي",
    description: "تصميم بروفايل شامل يوثق رؤية وأهداف وخدمات الشركة مع هيكلة بصرية متقنة تدعم الطباعة والعرض الرقمي.",
    category: "مطبوعات",
    categoryLabel: "بروفايل ومطبوعات شركات",
    year: 2022,
    services: ["تصميم البروفايل التعريفي", "هيكلة المحتوى والرسائل", "المطبوعات الرسمية"],
    mainSlug: "company-profile",
    folders: [
      {
        id: "corp-profile-pages",
        title: "صفحات البروفايل الرسمية",
        category: "مطبوعات",
        summary: "صفحات البداية، الرؤية، الخدمات، وطرق التواصل بأسلوب مهني.",
        cover: "/images/projects/company-profile/cover.png",
        images: [
          { src: "/images/projects/company-profile/cover.png", alt: "غلاف بروفايل الشركة" },
          { src: "/images/projects/company-profile/gallery-1.png", alt: "صفحة البداية والرؤية" },
          { src: "/images/projects/company-profile/gallery-2.png", alt: "صفحة الخدمات والمنتجات" },
          { src: "/images/projects/company-profile/gallery-3.png", alt: "صفحة التواصل وخريطة التواجد" }
        ],
        projectSlug: "company-profile"
      }
    ]
  },
  {
    id: "nbox-system",
    name: "منصة ونظام NBOX",
    tagline: "تصميم واجهات لوحات التحكم السحابية (Dashboard UI)",
    description: "تصميم واجهة لوحة تحكم سحابية متقدمة لإدارة البيانات والعمليات، تدعم النمط المظلم (Dark Mode) والرسوم البيانية التفاعلية.",
    category: "أنظمة",
    categoryLabel: "أنظمة ولوحات تحكم",
    year: 2024,
    services: ["تصميم لوحات التحكم (Dashboards)", "تصميم تجربة المستخدم", "رسوم بيانية وإحصائيات"],
    mainSlug: "nbox",
    folders: [
      {
        id: "nbox-dash",
        title: "لوحة التحكم والأنظمة",
        category: "أنظمة",
        summary: "شاشات الإدارة ومتابعة المؤشرات والعمليات اليومية.",
        cover: "/images/projects/nbox/cover.png",
        images: [
          { src: "/images/projects/nbox/cover.png", alt: "لوحة تحكم NBOX" },
          { src: "/images/projects/nbox/gallery-1.png", alt: "شاشة التقارير والبيانات" },
          { src: "/images/projects/nbox/gallery-2.png", alt: "واجهة إدارة المستخدمين" }
        ],
        projectSlug: "nbox"
      }
    ]
  },
  {
    id: "cent-hotels",
    name: "Cent Hotels (فنادق سينت)",
    tagline: "تصميم منصة الحجوزات الفندقية والضيافة الراقية",
    description: "واجهة منصة فندقية فخمة تسهل استعراض الغرف والمرافق وحجز الإقامات بسلاسة وتجاوب تام.",
    category: "مواقع",
    categoryLabel: "مواقع ومنصات حجز",
    year: 2023,
    services: ["تصميم منصات الحجز", "UI/UX", "تجربة تصفح الغرف"],
    mainSlug: "cent-hotels",
    folders: [
      {
        id: "cent-web",
        title: "منصة الحجوزات الفندقية",
        category: "مواقع",
        summary: "استعراض الأجنحة وتفاصيل الإقامة ومسار الحجز المباشر.",
        cover: "/images/projects/cent-hotels/cover.jpg",
        images: [
          { src: "/images/projects/cent-hotels/cover.jpg", alt: "واجهة Cent Hotels" },
          { src: "/images/projects/cent-hotels/gallery-1.jpg", alt: "تفاصيل الغرف والحجز" },
          { src: "/images/projects/cent-hotels/gallery-2.png", alt: "استعراض المرافق والخدمات" }
        ],
        projectSlug: "cent-hotels"
      }
    ]
  },
  {
    id: "dubi-coffee",
    name: "قهوة دوبي (Dubi Coffee)",
    tagline: "الهوية البصرية، تصميم الأكواب، وتصاميم السوشيال ميديا",
    description: "هوية تجارية دافئة لعلامة قهوة مختصة، شملت تصميم الشعار، الأكواب الورقية، والبوستات الإعلانية التفاعلية.",
    category: "هوية",
    categoryLabel: "هوية بصرية وضيافة",
    year: 2022,
    services: ["تصميم الشعار والهوية", "تطبيقات الأكواب والتغليف", "تصاميم السوشيال ميديا"],
    mainSlug: "dubi-coffee",
    folders: [
      {
        id: "dubi-brand",
        title: "الهوية وتطبيقات الأكواب",
        category: "هوية",
        summary: "موك اب الشعار على الأكواب والمطبوعات المخصصة للمقهى.",
        cover: "/images/projects/dubi-coffee/cover.jpg",
        images: [
          { src: "/images/projects/dubi-coffee/cover.jpg", alt: "شعار قهوة دوبي على الأكواب" },
          { src: "/images/projects/dubi-coffee/gallery-1.jpg", alt: "موك اب تطبيقات قهوة دوبي 1" },
          { src: "/images/projects/dubi-coffee/gallery-2.jpg", alt: "موك اب تطبيقات قهوة دوبي 2" }
        ],
        projectSlug: "dubi-coffee"
      }
    ]
  },
  {
    id: "stores-collection",
    name: "مجموعة المتاجر الرقمية",
    tagline: "واجهات متاجر إلكترونية متنوعة (iCrunsh, Best Option, Open Store)",
    description: "سلسلة من مشاريع تصميم واجهات المتاجر الإلكترونية لقطاعات متنوعة تركز على سرعة التصفح وتجربة شراء بديهية.",
    category: "متاجر",
    categoryLabel: "متاجر إلكترونية وتجزئة",
    year: 2023,
    services: ["تصميم المتاجر الإلكترونية", "تحسين تجربة الشراء", "واجهات الجوال السريعة"],
    mainSlug: "icrunsh-store",
    folders: [
      {
        id: "icrunsh-folder",
        title: "iCrunsh Store",
        category: "متاجر",
        summary: "واجهة متجر إلكتروني مبتكرة للمنتجات التقنية والخدمات.",
        cover: "/images/projects/icrunsh-store/cover.png",
        images: [
          { src: "/images/projects/icrunsh-store/cover.png", alt: "واجهة iCrunsh Store" },
          { src: "/images/projects/icrunsh-store/gallery-1.png", alt: "لقطة من متجر iCrunsh" }
        ],
        projectSlug: "icrunsh-store"
      },
      {
        id: "best-option-folder",
        title: "متجر بيست أوبشن",
        category: "متاجر",
        summary: "تصميم متجر يقدم خيارات شراء منظمة وسريعة.",
        cover: "/images/projects/best-option-store/cover.png",
        images: [
          { src: "/images/projects/best-option-store/cover.png", alt: "واجهة متجر بيست أوبشن" },
          { src: "/images/projects/best-option-store/gallery-1.png", alt: "لقطة من متجر بيست أوبشن" }
        ],
        projectSlug: "best-option-store"
      },
      {
        id: "open-store-folder",
        title: "اوبن ستور",
        category: "متاجر",
        summary: "واجهة متجر بسيطة ومباشرة تركز على وضوح المنتجات.",
        cover: "/images/projects/open-store/cover.png",
        images: [
          { src: "/images/projects/open-store/cover.png", alt: "واجهة اوبن ستور" },
          { src: "/images/projects/open-store/gallery-1.png", alt: "لقطة من اوبن ستور" }
        ],
        projectSlug: "open-store"
      }
    ]
  },
  {
    id: "branding-collection",
    name: "مشاريع الهوية والإعلام",
    tagline: "تصاميم شعارات وهويات رقمية (Vodge Media, Katura, Hora, Skeleton, Business Creator)",
    description: "باقة متميزة من تصاميم الهويات البصرية والشعارات التجارية المتنوعة لعلامات في قطاعات الإعلام، الضيافة، والأعمال.",
    category: "هوية",
    categoryLabel: "هويات بصرية وشعارات",
    year: 2023,
    services: ["تصميم الشعارات الرمزية", "بناء الهويات الرقمية", "المطبوعات وسوشيال ميديا"],
    mainSlug: "katura-cafe",
    folders: [
      {
        id: "katura-folder",
        title: "كاتورا كافي",
        category: "هوية",
        summary: "هوية بصرية أنيقة لمقهى عصري وتطبيقات القائمة والمطبوعات.",
        cover: "/images/projects/katura-cafe/cover.png",
        images: [
          { src: "/images/projects/katura-cafe/cover.png", alt: "شعار كاتورا كافي" },
          { src: "/images/projects/katura-cafe/gallery-1.jpg", alt: "تطبيقات هوية كاتورا كافي" }
        ],
        projectSlug: "katura-cafe"
      },
      {
        id: "hora-folder",
        title: "Hora Cafe",
        category: "هوية",
        summary: "شعار وهوية دافئة لمقهى مع تطبيقات المنشورات وبطاقات العمل.",
        cover: "/images/projects/hora-cafe/cover.png",
        images: [
          { src: "/images/projects/hora-cafe/cover.png", alt: "شعار Hora Cafe" },
          { src: "/images/projects/hora-cafe/gallery-1.png", alt: "تطبيقات Hora Cafe" }
        ],
        projectSlug: "hora-cafe"
      },
      {
        id: "vodge-folder",
        title: "Vodge Media",
        category: "هوية",
        summary: "هوية عصرية لشركة إنتاج إعلامي ورقمي.",
        cover: "/images/projects/vodge-media/cover.png",
        images: [
          { src: "/images/projects/vodge-media/cover.png", alt: "شعار Vodge Media" },
          { src: "/images/projects/vodge-media/gallery-1.png", alt: "تطبيقات Vodge Media" }
        ],
        projectSlug: "vodge-media"
      },
      {
        id: "skeleton-folder",
        title: "سكيليتون",
        category: "هوية",
        summary: "علامة تجارية جريئة للمنتجات الرياضية والأزياء.",
        cover: "/images/projects/skeleton/cover.png",
        images: [
          { src: "/images/projects/skeleton/cover.png", alt: "شعار سكيليتون" },
          { src: "/images/projects/skeleton/gallery-1.png", alt: "تطبيقات سكيليتون" }
        ],
        projectSlug: "skeleton"
      },
      {
        id: "biz-creator-folder",
        title: "Business Creator",
        category: "هوية",
        summary: "هوية بصرية ومواد تسويقية لمنصة تمكين رواد الأعمال.",
        cover: "/images/projects/business-creator/cover.png",
        images: [
          { src: "/images/projects/business-creator/cover.png", alt: "شعار Business Creator" },
          { src: "/images/projects/business-creator/gallery-1.png", alt: "تطبيقات Business Creator" }
        ],
        projectSlug: "business-creator"
      }
    ]
  }
];
