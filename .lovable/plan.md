# خطة الفحص الشامل والإصلاح المتكامل

نتائج الفحص الأولي لم تُظهر أعطالاً كارثية في البنية، لكن هناك تناقضات حقيقية بين الواجهات ولوحة الإدارة، ونقاط جودة UX/UI تحتاج تلميعاً في `/admin/*`. الخطة على **أربع جولات** مرتّبة حسب الأولوية.

---

## 🔴 الجولة 1 — إصلاحات حرجة (P0)

### 1.1 تشخيص خطأ "Cannot read properties of undefined (reading 'from')"
- إضافة حارس تشخيصي في عميل Supabase يطبع stack trace واضحاً.
- تفعيل error boundary مركزي يلتقط أخطاء runtime ويعرضها بالعربية.
- تشغيل Playwright reproduction على `/admin/projects` مع سيناريو session منتهية.

### 1.2 حقول ميّتة في تفاصيل المشروع
- **`project.tools`**: يُعرَض في الشريط الجانبي لكنه غير موجود في DB ولا في نموذج الإدارة → حذف الكتلة.
- **`results` vs `metrics`**: حقلان يتنافسان على نفس العرض → دمج في `metrics` مع migration نقل بيانات.

### 1.3 التحقق من مسار Auth الكامل
- مراجعة `auth-attacher.ts` والتأكد من إرفاق Authorization قبل كل server-fn محمي.
- استبدال رسائل "Unauthorized" الفنية برسائل عربية موجّهة.

---

## 🟠 الجولة 2 — فحص الاتساق الشامل بين الواجهات والـ CMS (P0/P1)

**الهدف**: أن يكون كل نص، صورة، رقم، أو قسم يظهر للزائر قابلاً للتعديل من لوحة الإدارة بلا استثناء.

### 2.1 مصفوفة الاتساق: صفحة ↔ عناصر ↔ مصدر البيانات
لكل صفحة عامة، سأنتج جدول تدقيق يفحص كل عنصر:

| الصفحة | العناصر المفحوصة |
|--------|------------------|
| **الرئيسية** (`/`) | Hero (عنوان، وصف، CTA، الكلمات الدوارة، مشاريع البطل) · Featured Projects · How I Work · Testimonials · Footer |
| **الأعمال** (`/work`) | العنوان، الوصف، الفلاتر، بطاقات المشاريع، pagination |
| **تفاصيل مشروع** (`/work/$slug`) | كل 13 قسم (spotlight, problem, goals, research, solution, designProcess, development, stack, gallery, metrics, highlights, lessons, testimonial) + الشريط الجانبي |
| **الخدمات** (`/services` + `/services/$slug`) | كل خدمة وأقسامها العشرة |
| **المسيرة** (`/career`) | Timeline, Education, Certificates, Skills, Languages, Awards, Availability |
| **تواصل** (`/contact`) | النموذج، قنوات التواصل، FAQ، Availability |
| **من أنا** (`/about`) | كل الفقرات والصور |
| **المدونة** (`/blog` + `/blog/$slug`) | العنوان، الوصف، البطاقات، محتوى المقال |
| **الأفكار** (`/ideas`) والمنتجات (`/products`) | نفس المعايير |

**لكل عنصر**، سأتحقق من:
- ✅ يُقرأ من DB (لا hardcoded)
- ✅ يوجد حقل مطابق في نموذج الإدارة
- ✅ Zod schema يُطابق أعمدة DB والحقول
- ✅ Adapter لا يُسقط بيانات
- ✅ يعمل fallback ثابت عند غياب البيانات

### 2.2 إصلاح الفجوات المُكتشفة
كل عنصر hardcoded سيُنقل إلى:
- `site_content` (نصوص عامة مفتاح/قيمة)، أو
- جدول مخصص إن كان بنية متكررة (list-style)
- مع إضافة الحقل المناسب في `/admin/home` أو النموذج المخصص.

### 2.3 تخصيص كامل لصفحة الرئيسية
توسيع `/admin/home` ليشمل كل تبويب:
- Hero (نصوص + كلمات دوارة + مشاريع البطل)
- Featured Projects (اختيار مباشر بدل فلتر featured فقط + ترتيب)
- How I Work (قابلة للتعديل نصياً + عدد الخطوات)
- Testimonials (اختيار الظاهرة بالرئيسية)
- Footer (روابط، حقوق، شبكات اجتماعية)
- SEO (عناوين meta، og:image افتراضي)

### 2.4 توحيد hero schema والدوال
نقل `heroInputSchema` من `hero.functions.ts` إلى `src/features/cms/schemas.ts` وإعادة استخدام `getPublicServerClient()`.

---

## 🎨 الجولة 3 — إعادة تصميم لوحة الإدارة (UX/UI معايير عالية)

**الرؤية**: لوحة إدارة تشعر فيها بأنك تقود المنتج، لا تصارعه. مستوحاة من Linear وStripe Dashboard وVercel.

### 3.1 هيكل الملاحة والـ Layout
- **Sidebar احترافي**: أيقونات + تسميات، حالة نشطة واضحة، شارات (badges) للرسائل غير المقروءة، طيّ قابل للتحكم مع تذكّر الحالة.
- **Header علوي**: breadcrumbs، بحث سريع (⌘K)، إشعارات، user menu، زر "عرض في الموقع".
- **Empty states** جذابة لكل جدول (رسم توضيحي + CTA لإضافة أول عنصر).
- **Loading skeletons** بدل spinners.

### 3.2 لوحة رئيسية (Dashboard) عند `/admin`
حالياً نقطة الدخول ضعيفة. سأضيف dashboard حقيقي:
- KPI cards: مشاريع، رسائل جديدة، مشاهدات آخر 7 أيام، تحويل contact_submit
- Charts (recharts): funnel، top projects، مصادر الزيارات
- آخر النشاطات من `audit_log`
- Quick actions: "إضافة مشروع"، "الرد على رسالة"، "تحديث الرئيسية"

### 3.3 تحسين جداول القوائم (AdminCrud)
- بحث فوري + فلاتر متقدمة (حالة، تاريخ، تصنيف)
- Sort على الأعمدة
- Bulk actions (نشر متعدد، أرشفة، حذف)
- Column visibility toggle
- Sticky header + inline row actions مرئية بلا hover
- شارات حالة ملونة (منشور/مسودة/مؤرشف) بأيقونات
- عمود "مميّز" مع نجمة مرئية
- Preview drawer جانبي بدل الانتقال لصفحة تعديل كاملة (للمعاينة السريعة)

### 3.4 تحسين نماذج التعديل
- **Multi-step form** للمشاريع (Info → Content → Sections → Media → SEO → Publish)
- **Auto-save** كل 30 ثانية للمسودات
- **Preview live** جانبي يعرض الشكل النهائي أثناء الكتابة
- **Section reorder** بسحب حقيقي (dnd-kit) بدل الأزرار العلوية/السفلية
- **Media picker** موحّد يستعرض `/admin/media` بدل روابط يدوية
- **حقول ذكية**: slug auto-suggest، rich text editor للأوصاف الطويلة، color picker مرئي
- **Validation feedback فوري** أسفل الحقل، بألوان دلالية، بلغة عربية مفهومة

### 3.5 تناسق التصميم في `/admin/*`
- إزالة كل `text-white`, `bg-black`, `bg-neutral-900` واستخدام tokens (`bg-background`, `text-foreground`, `bg-card`, `border-border`).
- توحيد spacing على مقياس 4/8 والألوان الدلالية للحالات.
- دعم كامل للوضع الليلي في الأدمن.
- استخدام IBM Plex Sans Arabic في كل الواجهة.
- Focus rings واضحة، touch targets ≥ 44px، عبور لوحة المفاتيح صحيح.

### 3.6 التوست والتفاعل
- توست عربي موحّد لكل عملية (نجاح/خطأ/تحذير) مع زر undo للحذف.
- Dialog تأكيد جميل للعمليات الحساسة.
- Optimistic updates مع rollback عند الفشل.

---

## 🟢 الجولة 4 — تلميع نهائي وتغطية (P2)

### 4.1 تغطية أخطاء الصفحات العامة
إضافة `errorComponent` و `notFoundComponent` منسّقين لكل من: `index`, `about`, `contact`, `ideas`, `products`, `blog.index`, `services.index`, `work.index`, `career`.

### 4.2 توسيع تتبّع Funnel
`trackEvent('cta_click', ...)` لكل CTA في Footer، Services، Work، Project detail.

### 4.3 تحسينات RTL دقيقة
مراجعة الأيقونات الاتجاهية (chevron/arrows) وضمان عكسها في كل الصفحات.

### 4.4 Accessibility Pass نهائي
- Alt text على كل الصور المرفوعة (حقل إلزامي في Media uploader)
- Aria-labels على أزرار الأيقونات
- Heading hierarchy صحيحة في كل صفحة
- Contrast check على tokens الأدمن

---

## 📋 تسلسل التنفيذ

```text
الجولة 1 (P0 حرج) ─── إصلاح الأخطاء ونظافة البيانات
        ↓
الجولة 2 (اتساق شامل) ─── مصفوفة تدقيق كل صفحة/عنصر ثم سدّ الفجوات
        ↓
الجولة 3 (UX/UI للأدمن) ─── إعادة تصميم اللوحة كتجربة متكاملة
        ↓
الجولة 4 (تلميع) ─── error boundaries + تتبّع + a11y
```

**بعد كل جولة**: build check + معاينة بصرية + تأكيد سلوك.

---

## تفاصيل تقنية

- لن نُعدّل ملفات auto-generated (`client.ts`, `client.server.ts`, `types.ts`, `routeTree.gen.ts`).
- كل تغييرات DB عبر migrations مع GRANT + RLS.
- استخدام tokens من `src/styles.css` فقط — لا ألوان صلبة.
- `dnd-kit` للسحب، `@tanstack/react-table` لتحسين الجداول (إن لزم)، `recharts` للمخططات.
- الاحتفاظ ببنية الـ CMS الحالية دون هدم — البناء فوقها.

---

**هل أبدأ بالجولة 1 مباشرة، أم تفضّل أن أبدأ من الجولة 2 (الاتساق) أولاً لأنها تكشف الفجوات الحقيقية؟**
