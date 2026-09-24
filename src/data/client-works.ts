export type DeliverableImage = {
  src: string;
  alt: string;
  type?: "image" | "instagram";
  instagramUrl?: string;
  shortcode?: string;
};

export interface DeliverableFolder {
  id: string;
  title: string;
  category: string;
  summary: string;
  cover: string;
  images: DeliverableImage[];
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
  totalFiles?: number;
  cover?: string;
  folders: DeliverableFolder[];
}

export const clientEntities: ClientEntity[] = [
  {
    "id": "dropship-sa",
    "name": "موقع DropShip.sa",
    "tagline": "تنفيذ بروفايل موقع دروب شيب، بزنز كارد، بنرات الموقع، تصاميم سوشيال ميديا لـ موقع DropShip.sa",
    "description": "مجموعة مشاريع وتصاميم متميزة تم تنفيذها لـ موقع DropShip.sa، تشمل مجلدات العمل المنظمة (بروفايل موقع دروب شيب • بزنز كارد • بنرات الموقع • تصاميم سوشيال ميديا).",
    "category": "مواقع",
    "categoryLabel": "مواقع وأنظمة",
    "year": 2024,
    "featured": true,
    "services": [
      "بروفايل موقع دروب شيب",
      "بزنز كارد",
      "بنرات الموقع",
      "تصاميم سوشيال ميديا"
    ],
    "mainSlug": "dropship-sa",
    "totalFiles": 23,
    "folders": [
      {
        "id": "dropship-sa-folder-1",
        "title": "بروفايل موقع دروب شيب",
        "category": "مطبوعات",
        "summary": "أعمال بروفايل موقع دروب شيب الخاصة بـ موقع DropShip.sa.",
        "cover": "/images/organized/dropship-sa/folder-1/img-1.webp",
        "images": [
          {
            "src": "/images/organized/dropship-sa/folder-1/img-1.webp",
            "alt": "موقع DropShip.sa - بروفايل موقع دروب شيب (Artboard 1)"
          },
          {
            "src": "/images/organized/dropship-sa/folder-1/img-2.webp",
            "alt": "موقع DropShip.sa - بروفايل موقع دروب شيب (Artboard 2)"
          },
          {
            "src": "/images/organized/dropship-sa/folder-1/img-3.webp",
            "alt": "موقع DropShip.sa - بروفايل موقع دروب شيب (Artboard 3)"
          },
          {
            "src": "/images/organized/dropship-sa/folder-1/img-4.webp",
            "alt": "موقع DropShip.sa - بروفايل موقع دروب شيب (Artboard 4)"
          },
          {
            "src": "/images/organized/dropship-sa/folder-1/img-5.webp",
            "alt": "موقع DropShip.sa - بروفايل موقع دروب شيب (Artboard 5)"
          },
          {
            "src": "/images/organized/dropship-sa/folder-1/img-6.webp",
            "alt": "موقع DropShip.sa - بروفايل موقع دروب شيب (Artboard 7)"
          },
          {
            "src": "/images/organized/dropship-sa/folder-1/img-7.webp",
            "alt": "موقع DropShip.sa - بروفايل موقع دروب شيب (Artboard 8)"
          },
          {
            "src": "/images/organized/dropship-sa/folder-1/img-8.webp",
            "alt": "موقع DropShip.sa - بروفايل موقع دروب شيب (Artboard 9)"
          }
        ],
        "projectSlug": "dropship-sa"
      },
      {
        "id": "dropship-sa-folder-2",
        "title": "بزنز كارد",
        "category": "مطبوعات",
        "summary": "أعمال بزنز كارد الخاصة بـ موقع DropShip.sa.",
        "cover": "/images/organized/dropship-sa/folder-2/img-1.webp",
        "images": [
          {
            "src": "/images/organized/dropship-sa/folder-2/img-1.webp",
            "alt": "موقع DropShip.sa - بزنز كارد (كرت دروب شيب انجليزي عربي)"
          }
        ],
        "projectSlug": "dropship-sa"
      },
      {
        "id": "dropship-sa-folder-3",
        "title": "بنرات الموقع",
        "category": "تسويق",
        "summary": "أعمال بنرات الموقع الخاصة بـ موقع DropShip.sa.",
        "cover": "/images/organized/dropship-sa/folder-3/img-1.webp",
        "images": [
          {
            "src": "/images/organized/dropship-sa/folder-3/img-1.webp",
            "alt": "موقع DropShip.sa - بنرات الموقع (1)"
          },
          {
            "src": "/images/organized/dropship-sa/folder-3/img-2.webp",
            "alt": "موقع DropShip.sa - بنرات الموقع (2)"
          },
          {
            "src": "/images/organized/dropship-sa/folder-3/img-3.webp",
            "alt": "موقع DropShip.sa - بنرات الموقع (Artboard 1)"
          },
          {
            "src": "/images/organized/dropship-sa/folder-3/img-4.webp",
            "alt": "موقع DropShip.sa - بنرات الموقع (Artboard 2)"
          },
          {
            "src": "/images/organized/dropship-sa/folder-3/img-5.webp",
            "alt": "موقع DropShip.sa - بنرات الموقع (أفضل أساليب جذب العملاء)"
          },
          {
            "src": "/images/organized/dropship-sa/folder-3/img-6.webp",
            "alt": "موقع DropShip.sa - بنرات الموقع (الدخول إلى السوق)"
          },
          {
            "src": "/images/organized/dropship-sa/folder-3/img-7.webp",
            "alt": "موقع DropShip.sa - بنرات الموقع (لا تبدأ متجرك الإلكتروني الا بعد تطبيق 3 خطوات مهمة !)"
          }
        ],
        "projectSlug": "dropship-sa"
      },
      {
        "id": "dropship-sa-folder-4",
        "title": "تصاميم سوشيال ميديا",
        "category": "تسويق",
        "summary": "أعمال تصاميم سوشيال ميديا الخاصة بـ موقع DropShip.sa.",
        "cover": "/images/organized/dropship-sa/folder-4/img-1.webp",
        "images": [
          {
            "src": "/images/organized/dropship-sa/folder-4/img-1.webp",
            "alt": "موقع DropShip.sa - تصاميم سوشيال ميديا (1)"
          },
          {
            "src": "/images/organized/dropship-sa/folder-4/img-2.webp",
            "alt": "موقع DropShip.sa - تصاميم سوشيال ميديا (1ء)"
          },
          {
            "src": "/images/organized/dropship-sa/folder-4/img-3.webp",
            "alt": "موقع DropShip.sa - تصاميم سوشيال ميديا (2z)"
          },
          {
            "src": "/images/organized/dropship-sa/folder-4/img-4.webp",
            "alt": "موقع DropShip.sa - تصاميم سوشيال ميديا (3ء)"
          },
          {
            "src": "/images/organized/dropship-sa/folder-4/img-5.webp",
            "alt": "موقع DropShip.sa - تصاميم سوشيال ميديا (ghjkfrtghijk)"
          },
          {
            "src": "/images/organized/dropship-sa/folder-4/img-6.webp",
            "alt": "موقع DropShip.sa - تصاميم سوشيال ميديا (استشارة)"
          },
          {
            "src": "/images/organized/dropship-sa/folder-4/img-7.webp",
            "alt": "موقع DropShip.sa - تصاميم سوشيال ميديا (حقق ارباح عالية من الدروب شيب)"
          }
        ],
        "projectSlug": "dropship-sa"
      }
    ]
  },
  {
    "id": "business-creator",
    "name": "مسرعة الاعمال - Bussiness Creator",
    "tagline": "تنفيذ الهوية والتصاميم المعتمدة، بروفايل  Bussiness Creator، بزنز كارد، بنرات الموقع، تصاميم السوشيال ميديا، شعار Business Creaator لـ مسرعة الاعمال - Bussiness Creator",
    "description": "مجموعة مشاريع وتصاميم متميزة تم تنفيذها لـ مسرعة الاعمال - Bussiness Creator، تشمل مجلدات العمل المنظمة (الهوية والتصاميم المعتمدة • بروفايل  Bussiness Creator • بزنز كارد • بنرات الموقع • تصاميم السوشيال ميديا • شعار Business Creaator).",
    "category": "مواقع",
    "categoryLabel": "مواقع وأنظمة",
    "year": 2024,
    "featured": true,
    "services": [
      "الهوية والتصاميم المعتمدة",
      "بروفايل  Bussiness Creator",
      "بزنز كارد",
      "بنرات الموقع",
      "تصاميم السوشيال ميديا",
      "شعار Business Creaator"
    ],
    "mainSlug": "business-creator",
    "totalFiles": 20,
    "folders": [
      {
        "id": "business-creator-main",
        "title": "الهوية والتصاميم المعتمدة",
        "category": "مواقع",
        "summary": "ملفات وتصاميم مسرعة الاعمال - Bussiness Creator.",
        "cover": "/images/organized/business-creator/assets/img-1.webp",
        "images": [
          {
            "src": "/images/organized/business-creator/assets/img-1.webp",
            "alt": "مسرعة الاعمال - Bussiness Creator - انفوجرافبك  برنامج المطاعم والكوفيهات تعديل"
          }
        ],
        "projectSlug": "business-creator"
      },
      {
        "id": "business-creator-folder-1",
        "title": "بروفايل  Bussiness Creator",
        "category": "مطبوعات",
        "summary": "أعمال بروفايل  Bussiness Creator الخاصة بـ مسرعة الاعمال - Bussiness Creator.",
        "cover": "/images/organized/business-creator/folder-1/img-1.webp",
        "images": [
          {
            "src": "/images/organized/business-creator/folder-1/img-1.webp",
            "alt": "مسرعة الاعمال - Bussiness Creator - بروفايل  Bussiness Creator (1)"
          },
          {
            "src": "/images/organized/business-creator/folder-1/img-2.webp",
            "alt": "مسرعة الاعمال - Bussiness Creator - بروفايل  Bussiness Creator (2)"
          },
          {
            "src": "/images/organized/business-creator/folder-1/img-3.webp",
            "alt": "مسرعة الاعمال - Bussiness Creator - بروفايل  Bussiness Creator (333)"
          },
          {
            "src": "/images/organized/business-creator/folder-1/img-4.webp",
            "alt": "مسرعة الاعمال - Bussiness Creator - بروفايل  Bussiness Creator (4)"
          },
          {
            "src": "/images/organized/business-creator/folder-1/img-5.webp",
            "alt": "مسرعة الاعمال - Bussiness Creator - بروفايل  Bussiness Creator (5)"
          },
          {
            "src": "/images/organized/business-creator/folder-1/img-6.webp",
            "alt": "مسرعة الاعمال - Bussiness Creator - بروفايل  Bussiness Creator (8)"
          },
          {
            "src": "/images/organized/business-creator/folder-1/img-7.webp",
            "alt": "مسرعة الاعمال - Bussiness Creator - بروفايل  Bussiness Creator (888)"
          }
        ],
        "projectSlug": "business-creator"
      },
      {
        "id": "business-creator-folder-2",
        "title": "بزنز كارد",
        "category": "مطبوعات",
        "summary": "أعمال بزنز كارد الخاصة بـ مسرعة الاعمال - Bussiness Creator.",
        "cover": "/images/organized/business-creator/folder-2/img-1.webp",
        "images": [
          {
            "src": "/images/organized/business-creator/folder-2/img-1.webp",
            "alt": "مسرعة الاعمال - Bussiness Creator - بزنز كارد (سشسش)"
          }
        ],
        "projectSlug": "business-creator"
      },
      {
        "id": "business-creator-folder-3",
        "title": "بنرات الموقع",
        "category": "تسويق",
        "summary": "أعمال بنرات الموقع الخاصة بـ مسرعة الاعمال - Bussiness Creator.",
        "cover": "/images/organized/business-creator/folder-3/img-1.webp",
        "images": [
          {
            "src": "/images/organized/business-creator/folder-3/img-1.webp",
            "alt": "مسرعة الاعمال - Bussiness Creator - بنرات الموقع (release your dream)"
          },
          {
            "src": "/images/organized/business-creator/folder-3/img-2.webp",
            "alt": "مسرعة الاعمال - Bussiness Creator - بنرات الموقع (your dream become true with us)"
          },
          {
            "src": "/images/organized/business-creator/folder-3/img-3.webp",
            "alt": "مسرعة الاعمال - Bussiness Creator - بنرات الموقع (بنر برنامح الكوفيهات)"
          },
          {
            "src": "/images/organized/business-creator/folder-3/img-4.webp",
            "alt": "مسرعة الاعمال - Bussiness Creator - بنرات الموقع (غلاف الفيسبوك)"
          }
        ],
        "projectSlug": "business-creator"
      },
      {
        "id": "business-creator-folder-4",
        "title": "تصاميم السوشيال ميديا",
        "category": "تسويق",
        "summary": "أعمال تصاميم السوشيال ميديا الخاصة بـ مسرعة الاعمال - Bussiness Creator.",
        "cover": "/images/organized/business-creator/folder-4/img-1.webp",
        "images": [
          {
            "src": "/images/organized/business-creator/folder-4/img-1.webp",
            "alt": "مسرعة الاعمال - Bussiness Creator - تصاميم السوشيال ميديا (0)"
          },
          {
            "src": "/images/organized/business-creator/folder-4/img-2.webp",
            "alt": "مسرعة الاعمال - Bussiness Creator - تصاميم السوشيال ميديا (1)"
          },
          {
            "src": "/images/organized/business-creator/folder-4/img-3.webp",
            "alt": "مسرعة الاعمال - Bussiness Creator - تصاميم السوشيال ميديا (2)"
          },
          {
            "src": "/images/organized/business-creator/folder-4/img-4.webp",
            "alt": "مسرعة الاعمال - Bussiness Creator - تصاميم السوشيال ميديا (Artboard 1)"
          }
        ],
        "projectSlug": "business-creator"
      },
      {
        "id": "business-creator-folder-5",
        "title": "شعار Business Creaator",
        "category": "هوية",
        "summary": "أعمال شعار Business Creaator الخاصة بـ مسرعة الاعمال - Bussiness Creator.",
        "cover": "/images/organized/business-creator/folder-5/img-1.webp",
        "images": [
          {
            "src": "/images/organized/business-creator/folder-5/img-1.webp",
            "alt": "مسرعة الاعمال - Bussiness Creator - شعار Business Creaator (ssss)"
          },
          {
            "src": "/images/organized/business-creator/folder-5/img-2.webp",
            "alt": "مسرعة الاعمال - Bussiness Creator - شعار Business Creaator (التعديل الاخير 3)"
          },
          {
            "src": "/images/organized/business-creator/folder-5/img-3.webp",
            "alt": "مسرعة الاعمال - Bussiness Creator - شعار Business Creaator (نموذح 7)"
          }
        ],
        "projectSlug": "business-creator"
      }
    ]
  },
  {
    "id": "ion-advertising",
    "name": "أيون للدعاية والاعلان",
    "tagline": "تنفيذ صور الهوية، موك اب للهوية، نموذج 2 للهوية لـ أيون للدعاية والاعلان",
    "description": "مجموعة مشاريع وتصاميم متميزة تم تنفيذها لـ أيون للدعاية والاعلان، تشمل مجلدات العمل المنظمة (صور الهوية • موك اب للهوية • نموذج 2 للهوية).",
    "category": "هوية",
    "categoryLabel": "هوية بصرية وشعارات",
    "year": 2024,
    "featured": true,
    "services": [
      "صور الهوية",
      "موك اب للهوية",
      "نموذج 2 للهوية"
    ],
    "mainSlug": "ion-advertising",
    "totalFiles": 15,
    "folders": [
      {
        "id": "ion-advertising-folder-1",
        "title": "صور الهوية",
        "category": "هوية",
        "summary": "أعمال صور الهوية الخاصة بـ أيون للدعاية والاعلان.",
        "cover": "/images/organized/ion-advertising/folder-1/img-1.webp",
        "images": [
          {
            "src": "/images/organized/ion-advertising/folder-1/img-1.webp",
            "alt": "أيون للدعاية والاعلان - صور الهوية (1)"
          },
          {
            "src": "/images/organized/ion-advertising/folder-1/img-2.webp",
            "alt": "أيون للدعاية والاعلان - صور الهوية (3)"
          },
          {
            "src": "/images/organized/ion-advertising/folder-1/img-3.webp",
            "alt": "أيون للدعاية والاعلان - صور الهوية (الشعار باللون البرتقالي)"
          },
          {
            "src": "/images/organized/ion-advertising/folder-1/img-4.webp",
            "alt": "أيون للدعاية والاعلان - صور الهوية (الشعار باللون الروزي)"
          },
          {
            "src": "/images/organized/ion-advertising/folder-1/img-5.webp",
            "alt": "أيون للدعاية والاعلان - صور الهوية (توافق الالوان)"
          }
        ],
        "projectSlug": "ion-advertising"
      },
      {
        "id": "ion-advertising-folder-3",
        "title": "موك اب للهوية",
        "category": "هوية",
        "summary": "أعمال موك اب للهوية الخاصة بـ أيون للدعاية والاعلان.",
        "cover": "/images/organized/ion-advertising/folder-3/img-1.webp",
        "images": [
          {
            "src": "/images/organized/ion-advertising/folder-3/img-1.webp",
            "alt": "أيون للدعاية والاعلان - موك اب للهوية (108)"
          },
          {
            "src": "/images/organized/ion-advertising/folder-3/img-2.webp",
            "alt": "أيون للدعاية والاعلان - موك اب للهوية (228)"
          },
          {
            "src": "/images/organized/ion-advertising/folder-3/img-3.webp",
            "alt": "أيون للدعاية والاعلان - موك اب للهوية (Aug_25_-_White_And_Green_Envelope_01)"
          },
          {
            "src": "/images/organized/ion-advertising/folder-3/img-4.webp",
            "alt": "أيون للدعاية والاعلان - موك اب للهوية (ui-mobile-screen-mockupsforfree)"
          }
        ],
        "projectSlug": "ion-advertising"
      },
      {
        "id": "ion-advertising-folder-4",
        "title": "نموذج 2 للهوية",
        "category": "هوية",
        "summary": "أعمال نموذج 2 للهوية الخاصة بـ أيون للدعاية والاعلان.",
        "cover": "/images/organized/ion-advertising/folder-4/img-1.webp",
        "images": [
          {
            "src": "/images/organized/ion-advertising/folder-4/img-1.webp",
            "alt": "أيون للدعاية والاعلان - نموذج 2 للهوية (2)"
          },
          {
            "src": "/images/organized/ion-advertising/folder-4/img-2.webp",
            "alt": "أيون للدعاية والاعلان - نموذج 2 للهوية (5)"
          },
          {
            "src": "/images/organized/ion-advertising/folder-4/img-3.webp",
            "alt": "أيون للدعاية والاعلان - نموذج 2 للهوية (6)"
          },
          {
            "src": "/images/organized/ion-advertising/folder-4/img-4.webp",
            "alt": "أيون للدعاية والاعلان - نموذج 2 للهوية (7)"
          },
          {
            "src": "/images/organized/ion-advertising/folder-4/img-5.webp",
            "alt": "أيون للدعاية والاعلان - نموذج 2 للهوية (اكثر من فكرة)"
          },
          {
            "src": "/images/organized/ion-advertising/folder-4/img-6.webp",
            "alt": "أيون للدعاية والاعلان - نموذج 2 للهوية (سيبغسيبلف)"
          }
        ],
        "projectSlug": "ion-advertising"
      }
    ]
  },
  {
    "id": "asean-union",
    "name": "شركة اتحاد آسيان للتجارة",
    "tagline": "تنفيذ بروفايل الشركة، بنرات الموقع لـ شركة اتحاد آسيان للتجارة",
    "description": "مجموعة مشاريع وتصاميم متميزة تم تنفيذها لـ شركة اتحاد آسيان للتجارة، تشمل مجلدات العمل المنظمة (بروفايل الشركة • بنرات الموقع).",
    "category": "مواقع",
    "categoryLabel": "مواقع وأنظمة",
    "year": 2024,
    "featured": true,
    "services": [
      "بروفايل الشركة",
      "بنرات الموقع"
    ],
    "mainSlug": "asean-union",
    "totalFiles": 13,
    "folders": [
      {
        "id": "asean-union-folder-1",
        "title": "بروفايل الشركة",
        "category": "مطبوعات",
        "summary": "أعمال بروفايل الشركة الخاصة بـ شركة اتحاد آسيان للتجارة.",
        "cover": "/images/organized/asean-union/folder-1/img-1.webp",
        "images": [
          {
            "src": "/images/organized/asean-union/folder-1/img-1.webp",
            "alt": "شركة اتحاد آسيان للتجارة - بروفايل الشركة (#بدايـــــــــــــــــــتنا)"
          },
          {
            "src": "/images/organized/asean-union/folder-1/img-2.webp",
            "alt": "شركة اتحاد آسيان للتجارة - بروفايل الشركة (الاهداف والرؤية)"
          },
          {
            "src": "/images/organized/asean-union/folder-1/img-3.webp",
            "alt": "شركة اتحاد آسيان للتجارة - بروفايل الشركة (الخدمات)"
          },
          {
            "src": "/images/organized/asean-union/folder-1/img-4.webp",
            "alt": "شركة اتحاد آسيان للتجارة - بروفايل الشركة (المنتجات)"
          }
        ],
        "projectSlug": "asean-union"
      },
      {
        "id": "asean-union-folder-2",
        "title": "بنرات الموقع",
        "category": "تسويق",
        "summary": "أعمال بنرات الموقع الخاصة بـ شركة اتحاد آسيان للتجارة.",
        "cover": "/images/organized/asean-union/folder-2/img-1.webp",
        "images": [
          {
            "src": "/images/organized/asean-union/folder-2/img-1.webp",
            "alt": "شركة اتحاد آسيان للتجارة - بنرات الموقع (298100472_1203334670446335_3638739370456709390_n)"
          },
          {
            "src": "/images/organized/asean-union/folder-2/img-2.webp",
            "alt": "شركة اتحاد آسيان للتجارة - بنرات الموقع (cf6ea8d4-175d-4a57-8f10-bf00a97f75c9)"
          },
          {
            "src": "/images/organized/asean-union/folder-2/img-3.webp",
            "alt": "شركة اتحاد آسيان للتجارة - بنرات الموقع (hgkihzd)"
          },
          {
            "src": "/images/organized/asean-union/folder-2/img-4.webp",
            "alt": "شركة اتحاد آسيان للتجارة - بنرات الموقع (إتحاد آسيــان للتجـارة)"
          },
          {
            "src": "/images/organized/asean-union/folder-2/img-5.webp",
            "alt": "شركة اتحاد آسيان للتجارة - بنرات الموقع (قهوة دوبي)"
          },
          {
            "src": "/images/organized/asean-union/folder-2/img-6.webp",
            "alt": "شركة اتحاد آسيان للتجارة - بنرات الموقع (مرقة الدجاج دوبي)"
          },
          {
            "src": "/images/organized/asean-union/folder-2/img-7.webp",
            "alt": "شركة اتحاد آسيان للتجارة - بنرات الموقع (مرقة الدجاج دوبي2)"
          },
          {
            "src": "/images/organized/asean-union/folder-2/img-8.webp",
            "alt": "شركة اتحاد آسيان للتجارة - بنرات الموقع (مرقة خضار دوبي)"
          },
          {
            "src": "/images/organized/asean-union/folder-2/img-9.webp",
            "alt": "شركة اتحاد آسيان للتجارة - بنرات الموقع (منتجات دوبي)"
          }
        ],
        "projectSlug": "asean-union"
      }
    ]
  },
  {
    "id": "cent-hotel",
    "name": "فندق سنت العزيزية",
    "tagline": "تنفيذ الهوية والتصاميم المعتمدة، بزنز كارد، بنرات، تصميم بروفايل سلسلة فنادق سنت العزيزية لـ فندق سنت العزيزية",
    "description": "مجموعة مشاريع وتصاميم متميزة تم تنفيذها لـ فندق سنت العزيزية، تشمل مجلدات العمل المنظمة (الهوية والتصاميم المعتمدة • بزنز كارد • بنرات • تصميم بروفايل سلسلة فنادق سنت العزيزية).",
    "category": "مطبوعات",
    "categoryLabel": "مطبوعات وتغليف",
    "year": 2024,
    "featured": true,
    "services": [
      "الهوية والتصاميم المعتمدة",
      "بزنز كارد",
      "بنرات",
      "تصميم بروفايل سلسلة فنادق سنت العزيزية"
    ],
    "mainSlug": "cent-hotel",
    "totalFiles": 13,
    "folders": [
      {
        "id": "cent-hotel-main",
        "title": "الهوية والتصاميم المعتمدة",
        "category": "مطبوعات",
        "summary": "ملفات وتصاميم فندق سنت العزيزية.",
        "cover": "/images/organized/cent-hotel/assets/img-1.webp",
        "images": [
          {
            "src": "/images/organized/cent-hotel/assets/img-1.webp",
            "alt": "فندق سنت العزيزية - فندق سنــت العزيزية الوجه الاول"
          }
        ],
        "projectSlug": "cent-hotel"
      },
      {
        "id": "cent-hotel-folder-1",
        "title": "بزنز كارد",
        "category": "مطبوعات",
        "summary": "أعمال بزنز كارد الخاصة بـ فندق سنت العزيزية.",
        "cover": "/images/organized/cent-hotel/folder-1/img-1.webp",
        "images": [
          {
            "src": "/images/organized/cent-hotel/folder-1/img-1.webp",
            "alt": "فندق سنت العزيزية - بزنز كارد (الوجة الثاني)"
          }
        ],
        "projectSlug": "cent-hotel"
      },
      {
        "id": "cent-hotel-folder-2",
        "title": "بنرات",
        "category": "تسويق",
        "summary": "أعمال بنرات الخاصة بـ فندق سنت العزيزية.",
        "cover": "/images/organized/cent-hotel/folder-2/img-1.webp",
        "images": [
          {
            "src": "/images/organized/cent-hotel/folder-2/img-1.webp",
            "alt": "فندق سنت العزيزية - بنرات (نموذج 1)"
          },
          {
            "src": "/images/organized/cent-hotel/folder-2/img-2.webp",
            "alt": "فندق سنت العزيزية - بنرات (نموذج)"
          },
          {
            "src": "/images/organized/cent-hotel/folder-2/img-3.webp",
            "alt": "فندق سنت العزيزية - بنرات (يءسشسش)"
          },
          {
            "src": "/images/organized/cent-hotel/folder-2/img-4.webp",
            "alt": "فندق سنت العزيزية - بنرات (يضصيضي)"
          }
        ],
        "projectSlug": "cent-hotel"
      },
      {
        "id": "cent-hotel-folder-3",
        "title": "تصميم بروفايل سلسلة فنادق سنت العزيزية",
        "category": "مطبوعات",
        "summary": "أعمال تصميم بروفايل سلسلة فنادق سنت العزيزية الخاصة بـ فندق سنت العزيزية.",
        "cover": "/images/organized/cent-hotel/folder-3/img-1.webp",
        "images": [
          {
            "src": "/images/organized/cent-hotel/folder-3/img-1.webp",
            "alt": "فندق سنت العزيزية - تصميم بروفايل سلسلة فنادق سنت العزيزية (12.13)"
          },
          {
            "src": "/images/organized/cent-hotel/folder-3/img-2.webp",
            "alt": "فندق سنت العزيزية - تصميم بروفايل سلسلة فنادق سنت العزيزية (19 & 20)"
          },
          {
            "src": "/images/organized/cent-hotel/folder-3/img-3.webp",
            "alt": "فندق سنت العزيزية - تصميم بروفايل سلسلة فنادق سنت العزيزية (6.7)"
          },
          {
            "src": "/images/organized/cent-hotel/folder-3/img-4.webp",
            "alt": "فندق سنت العزيزية - تصميم بروفايل سلسلة فنادق سنت العزيزية (موك اب 1)"
          },
          {
            "src": "/images/organized/cent-hotel/folder-3/img-5.webp",
            "alt": "فندق سنت العزيزية - تصميم بروفايل سلسلة فنادق سنت العزيزية (موك اب 2)"
          },
          {
            "src": "/images/organized/cent-hotel/folder-3/img-6.webp",
            "alt": "فندق سنت العزيزية - تصميم بروفايل سلسلة فنادق سنت العزيزية (موك ابالخلف 2)"
          },
          {
            "src": "/images/organized/cent-hotel/folder-3/img-7.webp",
            "alt": "فندق سنت العزيزية - تصميم بروفايل سلسلة فنادق سنت العزيزية (يي)"
          }
        ],
        "projectSlug": "cent-hotel"
      }
    ]
  },
  {
    "id": "laviola-sweets",
    "name": "متجر لافيولا سويتز",
    "tagline": "تنفيذ تصاميم السوشيال ميديا، تصميم بطاقة شكر، صور الشعار لـ متجر لافيولا سويتز",
    "description": "مجموعة مشاريع وتصاميم متميزة تم تنفيذها لـ متجر لافيولا سويتز، تشمل مجلدات العمل المنظمة (تصاميم السوشيال ميديا • تصميم بطاقة شكر • صور الشعار).",
    "category": "متاجر",
    "categoryLabel": "متاجر إلكترونية",
    "year": 2024,
    "featured": true,
    "services": [
      "تصاميم السوشيال ميديا",
      "تصميم بطاقة شكر",
      "صور الشعار"
    ],
    "mainSlug": "laviola-sweets",
    "totalFiles": 11,
    "folders": [
      {
        "id": "laviola-sweets-folder-1",
        "title": "تصاميم السوشيال ميديا",
        "category": "تسويق",
        "summary": "أعمال تصاميم السوشيال ميديا الخاصة بـ متجر لافيولا سويتز.",
        "cover": "/images/organized/laviola-sweets/folder-1/img-1.webp",
        "images": [
          {
            "src": "/images/organized/laviola-sweets/folder-1/img-1.webp",
            "alt": "متجر لافيولا سويتز - تصاميم السوشيال ميديا (2711)"
          },
          {
            "src": "/images/organized/laviola-sweets/folder-1/img-2.webp",
            "alt": "متجر لافيولا سويتز - تصاميم السوشيال ميديا (تيك توك)"
          },
          {
            "src": "/images/organized/laviola-sweets/folder-1/img-3.webp",
            "alt": "متجر لافيولا سويتز - تصاميم السوشيال ميديا (سنابشات)"
          },
          {
            "src": "/images/organized/laviola-sweets/folder-1/img-4.webp",
            "alt": "متجر لافيولا سويتز - تصاميم السوشيال ميديا (شوكولاتة الاعراس)"
          },
          {
            "src": "/images/organized/laviola-sweets/folder-1/img-5.webp",
            "alt": "متجر لافيولا سويتز - تصاميم السوشيال ميديا (شوكولاتة المناسبات)"
          },
          {
            "src": "/images/organized/laviola-sweets/folder-1/img-6.webp",
            "alt": "متجر لافيولا سويتز - تصاميم السوشيال ميديا (للمناســــــــــــــــــــــــبات)"
          }
        ],
        "projectSlug": "laviola-sweets"
      },
      {
        "id": "laviola-sweets-folder-2",
        "title": "تصميم بطاقة شكر",
        "category": "متاجر",
        "summary": "أعمال تصميم بطاقة شكر الخاصة بـ متجر لافيولا سويتز.",
        "cover": "/images/organized/laviola-sweets/folder-2/img-1.webp",
        "images": [
          {
            "src": "/images/organized/laviola-sweets/folder-2/img-1.webp",
            "alt": "متجر لافيولا سويتز - تصميم بطاقة شكر (1)"
          },
          {
            "src": "/images/organized/laviola-sweets/folder-2/img-2.webp",
            "alt": "متجر لافيولا سويتز - تصميم بطاقة شكر (2)"
          }
        ],
        "projectSlug": "laviola-sweets"
      },
      {
        "id": "laviola-sweets-folder-3",
        "title": "صور الشعار",
        "category": "هوية",
        "summary": "أعمال صور الشعار الخاصة بـ متجر لافيولا سويتز.",
        "cover": "/images/organized/laviola-sweets/folder-3/img-1.webp",
        "images": [
          {
            "src": "/images/organized/laviola-sweets/folder-3/img-1.webp",
            "alt": "متجر لافيولا سويتز - صور الشعار (لافيولا الجديد  عربي - انجليزيشس)"
          },
          {
            "src": "/images/organized/laviola-sweets/folder-3/img-2.webp",
            "alt": "متجر لافيولا سويتز - صور الشعار (لافيولا الجديد)"
          },
          {
            "src": "/images/organized/laviola-sweets/folder-3/img-3.webp",
            "alt": "متجر لافيولا سويتز - صور الشعار (لافيولا)"
          }
        ],
        "projectSlug": "laviola-sweets"
      }
    ]
  },
  {
    "id": "dr-tomador-dental",
    "name": "إدارة حساب دكتورة الاسنان تماضر",
    "tagline": "تنفيذ تصميم سوشيال ميديا، تصميم شعار لـ إدارة حساب دكتورة الاسنان تماضر",
    "description": "مجموعة مشاريع وتصاميم متميزة تم تنفيذها لـ إدارة حساب دكتورة الاسنان تماضر، تشمل مجلدات العمل المنظمة (تصميم سوشيال ميديا • تصميم شعار).",
    "category": "تسويق",
    "categoryLabel": "إعلانات وسوشيال ميديا",
    "year": 2024,
    "featured": true,
    "services": [
      "تصميم سوشيال ميديا",
      "تصميم شعار"
    ],
    "mainSlug": "dr-tomador-dental",
    "totalFiles": 11,
    "folders": [
      {
        "id": "dr-tomador-dental-folder-1",
        "title": "تصميم سوشيال ميديا",
        "category": "تسويق",
        "summary": "أعمال تصميم سوشيال ميديا الخاصة بـ إدارة حساب دكتورة الاسنان تماضر.",
        "cover": "/images/organized/dr-tomador-dental/folder-1/img-1.webp",
        "images": [
          {
            "src": "/images/organized/dr-tomador-dental/folder-1/img-1.webp",
            "alt": "إدارة حساب دكتورة الاسنان تماضر - تصميم سوشيال ميديا (1)"
          },
          {
            "src": "/images/organized/dr-tomador-dental/folder-1/img-2.webp",
            "alt": "إدارة حساب دكتورة الاسنان تماضر - تصميم سوشيال ميديا (1)"
          },
          {
            "src": "/images/organized/dr-tomador-dental/folder-1/img-3.webp",
            "alt": "إدارة حساب دكتورة الاسنان تماضر - تصميم سوشيال ميديا (2 (1))"
          },
          {
            "src": "/images/organized/dr-tomador-dental/folder-1/img-4.webp",
            "alt": "إدارة حساب دكتورة الاسنان تماضر - تصميم سوشيال ميديا (2)"
          },
          {
            "src": "/images/organized/dr-tomador-dental/folder-1/img-5.webp",
            "alt": "إدارة حساب دكتورة الاسنان تماضر - تصميم سوشيال ميديا (الفرشاة المناسبة 2)"
          },
          {
            "src": "/images/organized/dr-tomador-dental/folder-1/img-6.webp",
            "alt": "إدارة حساب دكتورة الاسنان تماضر - تصميم سوشيال ميديا (الفرشاة المناسبة)"
          },
          {
            "src": "/images/organized/dr-tomador-dental/folder-1/img-7.webp",
            "alt": "إدارة حساب دكتورة الاسنان تماضر - تصميم سوشيال ميديا (كيفية استخراج الناب المضمور شرح 2)"
          },
          {
            "src": "/images/organized/dr-tomador-dental/folder-1/img-8.webp",
            "alt": "إدارة حساب دكتورة الاسنان تماضر - تصميم سوشيال ميديا (مرتين يوميا)"
          }
        ],
        "projectSlug": "dr-tomador-dental"
      },
      {
        "id": "dr-tomador-dental-folder-2",
        "title": "تصميم شعار",
        "category": "هوية",
        "summary": "أعمال تصميم شعار الخاصة بـ إدارة حساب دكتورة الاسنان تماضر.",
        "cover": "/images/organized/dr-tomador-dental/folder-2/img-1.webp",
        "images": [
          {
            "src": "/images/organized/dr-tomador-dental/folder-2/img-1.webp",
            "alt": "إدارة حساب دكتورة الاسنان تماضر - تصميم شعار (1)"
          },
          {
            "src": "/images/organized/dr-tomador-dental/folder-2/img-2.webp",
            "alt": "إدارة حساب دكتورة الاسنان تماضر - تصميم شعار (sadfasdf)"
          },
          {
            "src": "/images/organized/dr-tomador-dental/folder-2/img-3.webp",
            "alt": "إدارة حساب دكتورة الاسنان تماضر - تصميم شعار (سيسي)"
          }
        ],
        "projectSlug": "dr-tomador-dental"
      }
    ]
  },
  {
    "id": "sports-creativity",
    "name": "هوية مجمع الابداع الرياضي",
    "tagline": "تنفيذ بروفايل مجمع الابداع الرياضي، صور الهوية، مطبوعات لـ هوية مجمع الابداع الرياضي",
    "description": "مجموعة مشاريع وتصاميم متميزة تم تنفيذها لـ هوية مجمع الابداع الرياضي، تشمل مجلدات العمل المنظمة (بروفايل مجمع الابداع الرياضي • صور الهوية • مطبوعات).",
    "category": "هوية",
    "categoryLabel": "هوية بصرية وشعارات",
    "year": 2024,
    "featured": true,
    "services": [
      "بروفايل مجمع الابداع الرياضي",
      "صور الهوية",
      "مطبوعات"
    ],
    "mainSlug": "sports-creativity",
    "totalFiles": 10,
    "folders": [
      {
        "id": "sports-creativity-folder-1",
        "title": "بروفايل مجمع الابداع الرياضي",
        "category": "مطبوعات",
        "summary": "أعمال بروفايل مجمع الابداع الرياضي الخاصة بـ هوية مجمع الابداع الرياضي.",
        "cover": "/images/organized/sports-creativity/folder-1/img-1.webp",
        "images": [
          {
            "src": "/images/organized/sports-creativity/folder-1/img-1.webp",
            "alt": "هوية مجمع الابداع الرياضي - بروفايل مجمع الابداع الرياضي (موك اب 2)"
          },
          {
            "src": "/images/organized/sports-creativity/folder-1/img-2.webp",
            "alt": "هوية مجمع الابداع الرياضي - بروفايل مجمع الابداع الرياضي (موك اب 3)"
          },
          {
            "src": "/images/organized/sports-creativity/folder-1/img-3.webp",
            "alt": "هوية مجمع الابداع الرياضي - بروفايل مجمع الابداع الرياضي (موك اب)"
          }
        ],
        "projectSlug": "sports-creativity"
      },
      {
        "id": "sports-creativity-folder-2",
        "title": "صور الهوية",
        "category": "هوية",
        "summary": "أعمال صور الهوية الخاصة بـ هوية مجمع الابداع الرياضي.",
        "cover": "/images/organized/sports-creativity/folder-2/img-1.webp",
        "images": [
          {
            "src": "/images/organized/sports-creativity/folder-2/img-1.webp",
            "alt": "هوية مجمع الابداع الرياضي - صور الهوية (بخلفية الملعب بالعرض)"
          },
          {
            "src": "/images/organized/sports-creativity/folder-2/img-2.webp",
            "alt": "هوية مجمع الابداع الرياضي - صور الهوية (بخلفية الملعب)"
          },
          {
            "src": "/images/organized/sports-creativity/folder-2/img-3.webp",
            "alt": "هوية مجمع الابداع الرياضي - صور الهوية (موك اب الاكليشة)"
          },
          {
            "src": "/images/organized/sports-creativity/folder-2/img-4.webp",
            "alt": "هوية مجمع الابداع الرياضي - صور الهوية (موك اب صورتين)"
          },
          {
            "src": "/images/organized/sports-creativity/folder-2/img-5.webp",
            "alt": "هوية مجمع الابداع الرياضي - صور الهوية (موك اب)"
          }
        ],
        "projectSlug": "sports-creativity"
      },
      {
        "id": "sports-creativity-folder-3",
        "title": "مطبوعات",
        "category": "مطبوعات",
        "summary": "أعمال مطبوعات الخاصة بـ هوية مجمع الابداع الرياضي.",
        "cover": "/images/organized/sports-creativity/folder-3/img-1.webp",
        "images": [
          {
            "src": "/images/organized/sports-creativity/folder-3/img-1.webp",
            "alt": "هوية مجمع الابداع الرياضي - مطبوعات (الخلفية)"
          },
          {
            "src": "/images/organized/sports-creativity/folder-3/img-2.webp",
            "alt": "هوية مجمع الابداع الرياضي - مطبوعات (المقدمة)"
          }
        ],
        "projectSlug": "sports-creativity"
      }
    ]
  },
  {
    "id": "hora-cafe",
    "name": "Hora Cafe",
    "tagline": "تنفيذ تصميم كوب شتوي، تصميم منيو لـ Hora Cafe",
    "description": "مجموعة مشاريع وتصاميم متميزة تم تنفيذها لـ Hora Cafe، تشمل مجلدات العمل المنظمة (تصميم كوب شتوي • تصميم منيو).",
    "category": "مطبوعات",
    "categoryLabel": "مطبوعات وتغليف",
    "year": 2024,
    "featured": true,
    "services": [
      "تصميم كوب شتوي",
      "تصميم منيو"
    ],
    "mainSlug": "hora-cafe",
    "totalFiles": 9,
    "folders": [
      {
        "id": "hora-cafe-folder-1",
        "title": "تصميم كوب شتوي",
        "category": "مطبوعات",
        "summary": "أعمال تصميم كوب شتوي الخاصة بـ Hora Cafe.",
        "cover": "/images/organized/hora-cafe/folder-1/img-1.webp",
        "images": [
          {
            "src": "/images/organized/hora-cafe/folder-1/img-1.webp",
            "alt": "Hora Cafe - تصميم كوب شتوي (موك اب 2)"
          },
          {
            "src": "/images/organized/hora-cafe/folder-1/img-2.webp",
            "alt": "Hora Cafe - تصميم كوب شتوي (موك اب هورا جديد)"
          },
          {
            "src": "/images/organized/hora-cafe/folder-1/img-3.webp",
            "alt": "Hora Cafe - تصميم كوب شتوي (موك اب)"
          },
          {
            "src": "/images/organized/hora-cafe/folder-1/img-4.webp",
            "alt": "Hora Cafe - تصميم كوب شتوي (موك تب هورا جديد 2)"
          }
        ],
        "projectSlug": "hora-cafe"
      },
      {
        "id": "hora-cafe-folder-2",
        "title": "تصميم منيو",
        "category": "مطبوعات",
        "summary": "أعمال تصميم منيو الخاصة بـ Hora Cafe.",
        "cover": "/images/organized/hora-cafe/folder-2/img-1.webp",
        "images": [
          {
            "src": "/images/organized/hora-cafe/folder-2/img-1.webp",
            "alt": "Hora Cafe - تصميم منيو (1)"
          },
          {
            "src": "/images/organized/hora-cafe/folder-2/img-2.webp",
            "alt": "Hora Cafe - تصميم منيو (الافطار)"
          },
          {
            "src": "/images/organized/hora-cafe/folder-2/img-3.webp",
            "alt": "Hora Cafe - تصميم منيو (القهوة المقطرة والموهيتو باللون الابيض)"
          },
          {
            "src": "/images/organized/hora-cafe/folder-2/img-4.webp",
            "alt": "Hora Cafe - تصميم منيو (المشروبات الباردة باللون الرمادي)"
          },
          {
            "src": "/images/organized/hora-cafe/folder-2/img-5.webp",
            "alt": "Hora Cafe - تصميم منيو (لوب شورو رمادي)"
          }
        ],
        "projectSlug": "hora-cafe"
      }
    ]
  },
  {
    "id": "tamatta-agency",
    "name": "وكالة تمتع للدعاية والإعلان",
    "tagline": "تنفيذ بروفايل، بزنز كارد لـ وكالة تمتع للدعاية والإعلان",
    "description": "مجموعة مشاريع وتصاميم متميزة تم تنفيذها لـ وكالة تمتع للدعاية والإعلان، تشمل مجلدات العمل المنظمة (بروفايل • بزنز كارد).",
    "category": "مطبوعات",
    "categoryLabel": "مطبوعات وتغليف",
    "year": 2024,
    "featured": true,
    "services": [
      "بروفايل",
      "بزنز كارد"
    ],
    "mainSlug": "tamatta-agency",
    "totalFiles": 8,
    "folders": [
      {
        "id": "tamatta-agency-folder-1",
        "title": "بروفايل",
        "category": "مطبوعات",
        "summary": "أعمال بروفايل الخاصة بـ وكالة تمتع للدعاية والإعلان.",
        "cover": "/images/organized/tamatta-agency/folder-1/img-1.webp",
        "images": [
          {
            "src": "/images/organized/tamatta-agency/folder-1/img-1.webp",
            "alt": "وكالة تمتع للدعاية والإعلان - بروفايل (1)"
          },
          {
            "src": "/images/organized/tamatta-agency/folder-1/img-2.webp",
            "alt": "وكالة تمتع للدعاية والإعلان - بروفايل (2)"
          },
          {
            "src": "/images/organized/tamatta-agency/folder-1/img-3.webp",
            "alt": "وكالة تمتع للدعاية والإعلان - بروفايل (3)"
          },
          {
            "src": "/images/organized/tamatta-agency/folder-1/img-4.webp",
            "alt": "وكالة تمتع للدعاية والإعلان - بروفايل (5)"
          },
          {
            "src": "/images/organized/tamatta-agency/folder-1/img-5.webp",
            "alt": "وكالة تمتع للدعاية والإعلان - بروفايل (6)"
          }
        ],
        "projectSlug": "tamatta-agency"
      },
      {
        "id": "tamatta-agency-folder-2",
        "title": "بزنز كارد",
        "category": "مطبوعات",
        "summary": "أعمال بزنز كارد الخاصة بـ وكالة تمتع للدعاية والإعلان.",
        "cover": "/images/organized/tamatta-agency/folder-2/img-1.webp",
        "images": [
          {
            "src": "/images/organized/tamatta-agency/folder-2/img-1.webp",
            "alt": "وكالة تمتع للدعاية والإعلان - بزنز كارد (1)"
          },
          {
            "src": "/images/organized/tamatta-agency/folder-2/img-2.webp",
            "alt": "وكالة تمتع للدعاية والإعلان - بزنز كارد (بزنز كارد نموذج 2)"
          },
          {
            "src": "/images/organized/tamatta-agency/folder-2/img-3.webp",
            "alt": "وكالة تمتع للدعاية والإعلان - بزنز كارد (رائد عبد العزيز 2)"
          }
        ],
        "projectSlug": "tamatta-agency"
      }
    ]
  },
  {
    "id": "rayouf-perfumes",
    "name": "عطور ريوف",
    "tagline": "تنفيذ تصميم بنرات المنتجات لـ عطور ريوف",
    "description": "مجموعة مشاريع وتصاميم متميزة تم تنفيذها لـ عطور ريوف، تشمل مجلدات العمل المنظمة (تصميم بنرات المنتجات).",
    "category": "متاجر",
    "categoryLabel": "متاجر إلكترونية",
    "year": 2024,
    "featured": true,
    "services": [
      "تصميم بنرات المنتجات"
    ],
    "mainSlug": "rayouf-perfumes",
    "totalFiles": 7,
    "folders": [
      {
        "id": "rayouf-perfumes-folder-1",
        "title": "تصميم بنرات المنتجات",
        "category": "تسويق",
        "summary": "أعمال تصميم بنرات المنتجات الخاصة بـ عطور ريوف.",
        "cover": "/images/organized/rayouf-perfumes/folder-1/img-1.webp",
        "images": [
          {
            "src": "/images/organized/rayouf-perfumes/folder-1/img-1.webp",
            "alt": "عطور ريوف - تصميم بنرات المنتجات (بنر يوم التأسيس)"
          },
          {
            "src": "/images/organized/rayouf-perfumes/folder-1/img-2.webp",
            "alt": "عطور ريوف - تصميم بنرات المنتجات (عطور m1 m2)"
          },
          {
            "src": "/images/organized/rayouf-perfumes/folder-1/img-3.webp",
            "alt": "عطور ريوف - تصميم بنرات المنتجات (فخــامــة)"
          },
          {
            "src": "/images/organized/rayouf-perfumes/folder-1/img-4.webp",
            "alt": "عطور ريوف - تصميم بنرات المنتجات (موك اب عطور ريوف)"
          },
          {
            "src": "/images/organized/rayouf-perfumes/folder-1/img-5.webp",
            "alt": "عطور ريوف - تصميم بنرات المنتجات (‏‏عطر اورماندا - نسخة)"
          },
          {
            "src": "/images/organized/rayouf-perfumes/folder-1/img-6.webp",
            "alt": "عطور ريوف - تصميم بنرات المنتجات (‏‏عطر رماح - نسخة)"
          },
          {
            "src": "/images/organized/rayouf-perfumes/folder-1/img-7.webp",
            "alt": "عطور ريوف - تصميم بنرات المنتجات (‏‏عطر لكجري - نسخة)"
          }
        ],
        "projectSlug": "rayouf-perfumes"
      }
    ]
  },
  {
    "id": "nbox-store",
    "name": "متجر NBOX",
    "tagline": "تنفيذ البنرات، تصاميم سوشيال ميديا لـ متجر NBOX",
    "description": "مجموعة مشاريع وتصاميم متميزة تم تنفيذها لـ متجر NBOX، تشمل مجلدات العمل المنظمة (البنرات • تصاميم سوشيال ميديا).",
    "category": "متاجر",
    "categoryLabel": "متاجر إلكترونية",
    "year": 2024,
    "featured": true,
    "services": [
      "البنرات",
      "تصاميم سوشيال ميديا"
    ],
    "mainSlug": "nbox-store",
    "totalFiles": 7,
    "folders": [
      {
        "id": "nbox-store-folder-1",
        "title": "البنرات",
        "category": "تسويق",
        "summary": "أعمال البنرات الخاصة بـ متجر NBOX.",
        "cover": "/images/organized/nbox-store/folder-1/img-1.webp",
        "images": [
          {
            "src": "/images/organized/nbox-store/folder-1/img-1.webp",
            "alt": "متجر NBOX - البنرات (Artboard 1)"
          },
          {
            "src": "/images/organized/nbox-store/folder-1/img-2.webp",
            "alt": "متجر NBOX - البنرات (Artboard 2)"
          },
          {
            "src": "/images/organized/nbox-store/folder-1/img-3.webp",
            "alt": "متجر NBOX - البنرات (Artboard 3)"
          },
          {
            "src": "/images/organized/nbox-store/folder-1/img-4.webp",
            "alt": "متجر NBOX - البنرات (Artboard 4)"
          }
        ],
        "projectSlug": "nbox-store"
      },
      {
        "id": "nbox-store-folder-2",
        "title": "تصاميم سوشيال ميديا",
        "category": "تسويق",
        "summary": "أعمال تصاميم سوشيال ميديا الخاصة بـ متجر NBOX.",
        "cover": "/images/organized/nbox-store/folder-2/img-1.webp",
        "images": [
          {
            "src": "/images/organized/nbox-store/folder-2/img-1.webp",
            "alt": "متجر NBOX - تصاميم سوشيال ميديا (2)"
          },
          {
            "src": "/images/organized/nbox-store/folder-2/img-2.webp",
            "alt": "متجر NBOX - تصاميم سوشيال ميديا (Artboard 1)"
          },
          {
            "src": "/images/organized/nbox-store/folder-2/img-3.webp",
            "alt": "متجر NBOX - تصاميم سوشيال ميديا (Artboard 5)"
          }
        ],
        "projectSlug": "nbox-store"
      }
    ]
  },
  {
    "id": "xo-hash",
    "name": "XO Hash",
    "tagline": "تنفيذ صور الهوية، موك اب للهوية لـ XO Hash",
    "description": "مجموعة مشاريع وتصاميم متميزة تم تنفيذها لـ XO Hash، تشمل مجلدات العمل المنظمة (صور الهوية • موك اب للهوية).",
    "category": "هوية",
    "categoryLabel": "هوية بصرية وشعارات",
    "year": 2024,
    "featured": true,
    "services": [
      "صور الهوية",
      "موك اب للهوية"
    ],
    "mainSlug": "xo-hash",
    "totalFiles": 6,
    "folders": [
      {
        "id": "xo-hash-folder-1",
        "title": "صور الهوية",
        "category": "هوية",
        "summary": "أعمال صور الهوية الخاصة بـ XO Hash.",
        "cover": "/images/organized/xo-hash/folder-1/img-1.webp",
        "images": [
          {
            "src": "/images/organized/xo-hash/folder-1/img-1.webp",
            "alt": "XO Hash - صور الهوية (مع كتابة شعار XO Hashtag)"
          },
          {
            "src": "/images/organized/xo-hash/folder-1/img-2.webp",
            "alt": "XO Hash - صور الهوية (مع كتابة شعار افقي XO Hashtag)"
          }
        ],
        "projectSlug": "xo-hash"
      },
      {
        "id": "xo-hash-folder-2",
        "title": "موك اب للهوية",
        "category": "هوية",
        "summary": "أعمال موك اب للهوية الخاصة بـ XO Hash.",
        "cover": "/images/organized/xo-hash/folder-2/img-1.webp",
        "images": [
          {
            "src": "/images/organized/xo-hash/folder-2/img-1.webp",
            "alt": "XO Hash - موك اب للهوية (2)"
          },
          {
            "src": "/images/organized/xo-hash/folder-2/img-2.webp",
            "alt": "XO Hash - موك اب للهوية (3)"
          },
          {
            "src": "/images/organized/xo-hash/folder-2/img-3.webp",
            "alt": "XO Hash - موك اب للهوية (4)"
          },
          {
            "src": "/images/organized/xo-hash/folder-2/img-4.webp",
            "alt": "XO Hash - موك اب للهوية (5)"
          }
        ],
        "projectSlug": "xo-hash"
      }
    ]
  },
  {
    "id": "shardon-brand",
    "name": "براند شاردون - SHARDON",
    "tagline": "تنفيذ الهوية والتصاميم المعتمدة لـ براند شاردون - SHARDON",
    "description": "مجموعة مشاريع وتصاميم متميزة تم تنفيذها لـ براند شاردون - SHARDON، تشمل مجلدات العمل المنظمة (الهوية والتصاميم المعتمدة).",
    "category": "هوية",
    "categoryLabel": "هوية بصرية وشعارات",
    "year": 2024,
    "featured": true,
    "services": [
      "الهوية والتصاميم المعتمدة"
    ],
    "mainSlug": "shardon-brand",
    "totalFiles": 5,
    "folders": [
      {
        "id": "shardon-brand-main",
        "title": "الهوية والتصاميم المعتمدة",
        "category": "هوية",
        "summary": "ملفات وتصاميم براند شاردون - SHARDON.",
        "cover": "/images/organized/shardon-brand/assets/img-1.webp",
        "images": [
          {
            "src": "/images/organized/shardon-brand/assets/img-1.webp",
            "alt": "براند شاردون - SHARDON - 5555"
          },
          {
            "src": "/images/organized/shardon-brand/assets/img-2.webp",
            "alt": "براند شاردون - SHARDON - الشعار مع الكتابة 2"
          },
          {
            "src": "/images/organized/shardon-brand/assets/img-3.webp",
            "alt": "براند شاردون - SHARDON - شرح الشعار"
          },
          {
            "src": "/images/organized/shardon-brand/assets/img-4.webp",
            "alt": "براند شاردون - SHARDON - شسيبشسيب"
          },
          {
            "src": "/images/organized/shardon-brand/assets/img-5.webp",
            "alt": "براند شاردون - SHARDON - موك اب"
          }
        ],
        "projectSlug": "shardon-brand"
      }
    ]
  },
  {
    "id": "luster-rawnaq",
    "name": "رونق Luster",
    "tagline": "تنفيذ تصميم سوشيال ميديا، صور الشعار لـ رونق Luster",
    "description": "مجموعة مشاريع وتصاميم متميزة تم تنفيذها لـ رونق Luster، تشمل مجلدات العمل المنظمة (تصميم سوشيال ميديا • صور الشعار).",
    "category": "هوية",
    "categoryLabel": "هوية بصرية وشعارات",
    "year": 2024,
    "featured": true,
    "services": [
      "تصميم سوشيال ميديا",
      "صور الشعار"
    ],
    "mainSlug": "luster-rawnaq",
    "totalFiles": 5,
    "folders": [
      {
        "id": "luster-rawnaq-folder-1",
        "title": "تصميم سوشيال ميديا",
        "category": "تسويق",
        "summary": "أعمال تصميم سوشيال ميديا الخاصة بـ رونق Luster.",
        "cover": "/images/organized/luster-rawnaq/folder-1/img-1.webp",
        "images": [
          {
            "src": "/images/organized/luster-rawnaq/folder-1/img-1.webp",
            "alt": "رونق Luster - تصميم سوشيال ميديا (بوستر لوستر)"
          },
          {
            "src": "/images/organized/luster-rawnaq/folder-1/img-2.webp",
            "alt": "رونق Luster - تصميم سوشيال ميديا (عرض)"
          }
        ],
        "projectSlug": "luster-rawnaq"
      },
      {
        "id": "luster-rawnaq-folder-2",
        "title": "صور الشعار",
        "category": "هوية",
        "summary": "أعمال صور الشعار الخاصة بـ رونق Luster.",
        "cover": "/images/organized/luster-rawnaq/folder-2/img-1.webp",
        "images": [
          {
            "src": "/images/organized/luster-rawnaq/folder-2/img-1.webp",
            "alt": "رونق Luster - صور الشعار (2)"
          },
          {
            "src": "/images/organized/luster-rawnaq/folder-2/img-2.webp",
            "alt": "رونق Luster - صور الشعار (zzzz)"
          },
          {
            "src": "/images/organized/luster-rawnaq/folder-2/img-3.webp",
            "alt": "رونق Luster - صور الشعار (خلفية بيضا)"
          }
        ],
        "projectSlug": "luster-rawnaq"
      }
    ]
  },
  {
    "id": "laza-restaurant",
    "name": "مطعم لازا البخاري",
    "tagline": "تنفيذ تصميم  سوشيال ميديا، منيو المطعم لـ مطعم لازا البخاري",
    "description": "مجموعة مشاريع وتصاميم متميزة تم تنفيذها لـ مطعم لازا البخاري، تشمل مجلدات العمل المنظمة (تصميم  سوشيال ميديا • منيو المطعم).",
    "category": "تسويق",
    "categoryLabel": "إعلانات وسوشيال ميديا",
    "year": 2024,
    "featured": true,
    "services": [
      "تصميم  سوشيال ميديا",
      "منيو المطعم"
    ],
    "mainSlug": "laza-restaurant",
    "totalFiles": 5,
    "folders": [
      {
        "id": "laza-restaurant-folder-1",
        "title": "تصميم  سوشيال ميديا",
        "category": "تسويق",
        "summary": "أعمال تصميم  سوشيال ميديا الخاصة بـ مطعم لازا البخاري.",
        "cover": "/images/organized/laza-restaurant/folder-1/img-1.webp",
        "images": [
          {
            "src": "/images/organized/laza-restaurant/folder-1/img-1.webp",
            "alt": "مطعم لازا البخاري - تصميم  سوشيال ميديا (النموذج الثاني)"
          },
          {
            "src": "/images/organized/laza-restaurant/folder-1/img-2.webp",
            "alt": "مطعم لازا البخاري - تصميم  سوشيال ميديا (رز بيلاف بالدجاج)"
          },
          {
            "src": "/images/organized/laza-restaurant/folder-1/img-3.webp",
            "alt": "مطعم لازا البخاري - تصميم  سوشيال ميديا (عرض الشخصين (1))"
          }
        ],
        "projectSlug": "laza-restaurant"
      },
      {
        "id": "laza-restaurant-folder-2",
        "title": "منيو المطعم",
        "category": "مطبوعات",
        "summary": "أعمال منيو المطعم الخاصة بـ مطعم لازا البخاري.",
        "cover": "/images/organized/laza-restaurant/folder-2/img-1.webp",
        "images": [
          {
            "src": "/images/organized/laza-restaurant/folder-2/img-1.webp",
            "alt": "مطعم لازا البخاري - منيو المطعم (الاطباق الرئيسية بإبراز بعض الأطباق تكبير الخط )"
          },
          {
            "src": "/images/organized/laza-restaurant/folder-2/img-2.webp",
            "alt": "مطعم لازا البخاري - منيو المطعم (النمموذج الاول)"
          }
        ],
        "projectSlug": "laza-restaurant"
      }
    ]
  },
  {
    "id": "sindyan-agri",
    "name": "هوية شركة سنديان الزراعية",
    "tagline": "تنفيذ الهوية والتصاميم المعتمدة لـ هوية شركة سنديان الزراعية",
    "description": "مجموعة مشاريع وتصاميم متميزة تم تنفيذها لـ هوية شركة سنديان الزراعية، تشمل مجلدات العمل المنظمة (الهوية والتصاميم المعتمدة).",
    "category": "هوية",
    "categoryLabel": "هوية بصرية وشعارات",
    "year": 2024,
    "featured": true,
    "services": [
      "الهوية والتصاميم المعتمدة"
    ],
    "mainSlug": "sindyan-agri",
    "totalFiles": 4,
    "folders": [
      {
        "id": "sindyan-agri-main",
        "title": "الهوية والتصاميم المعتمدة",
        "category": "هوية",
        "summary": "ملفات وتصاميم هوية شركة سنديان الزراعية.",
        "cover": "/images/organized/sindyan-agri/assets/img-1.webp",
        "images": [
          {
            "src": "/images/organized/sindyan-agri/assets/img-1.webp",
            "alt": "هوية شركة سنديان الزراعية - الخطوط المستخدمة"
          },
          {
            "src": "/images/organized/sindyan-agri/assets/img-2.webp",
            "alt": "هوية شركة سنديان الزراعية - بالأبيض"
          },
          {
            "src": "/images/organized/sindyan-agri/assets/img-3.webp",
            "alt": "هوية شركة سنديان الزراعية - مربع شعار سنديان الخليج"
          },
          {
            "src": "/images/organized/sindyan-agri/assets/img-4.webp",
            "alt": "هوية شركة سنديان الزراعية - موك اب شعار شركة السنديان"
          }
        ],
        "projectSlug": "sindyan-agri"
      }
    ]
  },
  {
    "id": "lawn-agency",
    "name": "هوية وكالة لون للدعاية والإعلان",
    "tagline": "تنفيذ الهوية والتصاميم المعتمدة لـ هوية وكالة لون للدعاية والإعلان",
    "description": "مجموعة مشاريع وتصاميم متميزة تم تنفيذها لـ هوية وكالة لون للدعاية والإعلان، تشمل مجلدات العمل المنظمة (الهوية والتصاميم المعتمدة).",
    "category": "هوية",
    "categoryLabel": "هوية بصرية وشعارات",
    "year": 2024,
    "featured": true,
    "services": [
      "الهوية والتصاميم المعتمدة"
    ],
    "mainSlug": "lawn-agency",
    "totalFiles": 4,
    "folders": [
      {
        "id": "lawn-agency-main",
        "title": "الهوية والتصاميم المعتمدة",
        "category": "هوية",
        "summary": "ملفات وتصاميم هوية وكالة لون للدعاية والإعلان.",
        "cover": "/images/organized/lawn-agency/assets/img-1.webp",
        "images": [
          {
            "src": "/images/organized/lawn-agency/assets/img-1.webp",
            "alt": "هوية وكالة لون للدعاية والإعلان - الشعار الثابت"
          },
          {
            "src": "/images/organized/lawn-agency/assets/img-2.webp",
            "alt": "هوية وكالة لون للدعاية والإعلان - الفكرة الثانية تعديل جداوي2"
          },
          {
            "src": "/images/organized/lawn-agency/assets/img-3.webp",
            "alt": "هوية وكالة لون للدعاية والإعلان - رمز الوكالة"
          },
          {
            "src": "/images/organized/lawn-agency/assets/img-4.webp",
            "alt": "هوية وكالة لون للدعاية والإعلان - موك اب"
          }
        ],
        "projectSlug": "lawn-agency"
      }
    ]
  },
  {
    "id": "rayhanah-mawadda",
    "name": "شركة ريحانة مودة  للسفر",
    "tagline": "تنفيذ تصميم بروشورات اعلانية لـ شركة ريحانة مودة  للسفر",
    "description": "مجموعة مشاريع وتصاميم متميزة تم تنفيذها لـ شركة ريحانة مودة  للسفر، تشمل مجلدات العمل المنظمة (تصميم بروشورات اعلانية).",
    "category": "مطبوعات",
    "categoryLabel": "مطبوعات وتغليف",
    "year": 2024,
    "featured": true,
    "services": [
      "تصميم بروشورات اعلانية"
    ],
    "mainSlug": "rayhanah-mawadda",
    "totalFiles": 4,
    "folders": [
      {
        "id": "rayhanah-mawadda-folder-1",
        "title": "تصميم بروشورات اعلانية",
        "category": "تسويق",
        "summary": "أعمال تصميم بروشورات اعلانية الخاصة بـ شركة ريحانة مودة  للسفر.",
        "cover": "/images/organized/rayhanah-mawadda/folder-1/img-1.webp",
        "images": [
          {
            "src": "/images/organized/rayhanah-mawadda/folder-1/img-1.webp",
            "alt": "شركة ريحانة مودة  للسفر - تصميم بروشورات اعلانية (Umrah Bullet Train)"
          },
          {
            "src": "/images/organized/rayhanah-mawadda/folder-1/img-2.webp",
            "alt": "شركة ريحانة مودة  للسفر - تصميم بروشورات اعلانية (برشور رحلة الطائف)"
          },
          {
            "src": "/images/organized/rayhanah-mawadda/folder-1/img-3.webp",
            "alt": "شركة ريحانة مودة  للسفر - تصميم بروشورات اعلانية (بروشور برنامح رحلات المدينة المنورة1)"
          },
          {
            "src": "/images/organized/rayhanah-mawadda/folder-1/img-4.webp",
            "alt": "شركة ريحانة مودة  للسفر - تصميم بروشورات اعلانية (بكج العمره)"
          }
        ],
        "projectSlug": "rayhanah-mawadda"
      }
    ]
  },
  {
    "id": "naktl-rice",
    "name": "عبوة Naktle",
    "tagline": "تنفيذ الهوية والتصاميم المعتمدة لـ عبوة Naktle",
    "description": "مجموعة مشاريع وتصاميم متميزة تم تنفيذها لـ عبوة Naktle، تشمل مجلدات العمل المنظمة (الهوية والتصاميم المعتمدة).",
    "category": "مطبوعات",
    "categoryLabel": "مطبوعات وتغليف",
    "year": 2024,
    "featured": true,
    "services": [
      "الهوية والتصاميم المعتمدة"
    ],
    "mainSlug": "naktl-rice",
    "totalFiles": 3,
    "folders": [
      {
        "id": "naktl-rice-main",
        "title": "الهوية والتصاميم المعتمدة",
        "category": "مطبوعات",
        "summary": "ملفات وتصاميم عبوة Naktle.",
        "cover": "/images/organized/naktl-rice/assets/img-1.webp",
        "images": [
          {
            "src": "/images/organized/naktl-rice/assets/img-1.webp",
            "alt": "عبوة Naktle - 1موك اب لتصميم رز نكتل الجديد"
          },
          {
            "src": "/images/organized/naktl-rice/assets/img-2.webp",
            "alt": "عبوة Naktle - التصميم الاخير لكيس الرز"
          },
          {
            "src": "/images/organized/naktl-rice/assets/img-3.webp",
            "alt": "عبوة Naktle - نكتل هي اختيار كل عائلة مربع"
          }
        ],
        "projectSlug": "naktl-rice"
      }
    ]
  },
  {
    "id": "beauty-and-more",
    "name": "بيوتي اند مور",
    "tagline": "تنفيذ الهوية والتصاميم المعتمدة لـ بيوتي اند مور",
    "description": "مجموعة مشاريع وتصاميم متميزة تم تنفيذها لـ بيوتي اند مور، تشمل مجلدات العمل المنظمة (الهوية والتصاميم المعتمدة).",
    "category": "تسويق",
    "categoryLabel": "إعلانات وسوشيال ميديا",
    "year": 2024,
    "featured": true,
    "services": [
      "الهوية والتصاميم المعتمدة"
    ],
    "mainSlug": "beauty-and-more",
    "totalFiles": 3,
    "folders": [
      {
        "id": "beauty-and-more-main",
        "title": "الهوية والتصاميم المعتمدة",
        "category": "تسويق",
        "summary": "ملفات وتصاميم بيوتي اند مور.",
        "cover": "/images/organized/beauty-and-more/assets/img-1.webp",
        "images": [
          {
            "src": "/images/organized/beauty-and-more/assets/img-1.webp",
            "alt": "بيوتي اند مور - بيوتي اند 11مور"
          },
          {
            "src": "/images/organized/beauty-and-more/assets/img-2.webp",
            "alt": "بيوتي اند مور - بيوتي اند مور ابو كلب"
          },
          {
            "src": "/images/organized/beauty-and-more/assets/img-3.webp",
            "alt": "بيوتي اند مور - بيوتي اند مور مع بنت"
          }
        ],
        "projectSlug": "beauty-and-more"
      }
    ]
  },
  {
    "id": "environment-day",
    "name": "تصميم يوم البيئة للمدارس",
    "tagline": "تنفيذ الهوية والتصاميم المعتمدة لـ تصميم يوم البيئة للمدارس",
    "description": "مجموعة مشاريع وتصاميم متميزة تم تنفيذها لـ تصميم يوم البيئة للمدارس، تشمل مجلدات العمل المنظمة (الهوية والتصاميم المعتمدة).",
    "category": "مطبوعات",
    "categoryLabel": "مطبوعات وتغليف",
    "year": 2024,
    "featured": true,
    "services": [
      "الهوية والتصاميم المعتمدة"
    ],
    "mainSlug": "environment-day",
    "totalFiles": 2,
    "folders": [
      {
        "id": "environment-day-main",
        "title": "الهوية والتصاميم المعتمدة",
        "category": "مطبوعات",
        "summary": "ملفات وتصاميم تصميم يوم البيئة للمدارس.",
        "cover": "/images/organized/environment-day/assets/img-1.webp",
        "images": [
          {
            "src": "/images/organized/environment-day/assets/img-1.webp",
            "alt": "تصميم يوم البيئة للمدارس - التصصميم"
          },
          {
            "src": "/images/organized/environment-day/assets/img-2.webp",
            "alt": "تصميم يوم البيئة للمدارس - موك اب 2"
          }
        ],
        "projectSlug": "environment-day"
      }
    ]
  },
  {
    "id": "skeleton-cafe",
    "name": "كافي سكيليتون",
    "tagline": "تنفيذ الهوية والتصاميم المعتمدة لـ كافي سكيليتون",
    "description": "مجموعة مشاريع وتصاميم متميزة تم تنفيذها لـ كافي سكيليتون، تشمل مجلدات العمل المنظمة (الهوية والتصاميم المعتمدة).",
    "category": "تسويق",
    "categoryLabel": "إعلانات وسوشيال ميديا",
    "year": 2024,
    "featured": true,
    "services": [
      "الهوية والتصاميم المعتمدة"
    ],
    "mainSlug": "skeleton-cafe",
    "totalFiles": 2,
    "folders": [
      {
        "id": "skeleton-cafe-main",
        "title": "الهوية والتصاميم المعتمدة",
        "category": "تسويق",
        "summary": "ملفات وتصاميم كافي سكيليتون.",
        "cover": "/images/organized/skeleton-cafe/assets/img-1.webp",
        "images": [
          {
            "src": "/images/organized/skeleton-cafe/assets/img-1.webp",
            "alt": "كافي سكيليتون - موك اب 3"
          },
          {
            "src": "/images/organized/skeleton-cafe/assets/img-2.webp",
            "alt": "كافي سكيليتون - موك اب"
          }
        ],
        "projectSlug": "skeleton-cafe"
      }
    ]
  }
];
