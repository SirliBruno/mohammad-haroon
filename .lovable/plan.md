
## الهدف

إنشاء صفحة أدمن واحدة `/admin/home` تجمع جميع أقسام الصفحة الرئيسية في تبويبات، مع القدرة على تعديل النصوص والأزرار والعناصر لكل قسم مباشرة، دون الحاجة لفتح صفحات إدارة متفرقة.

## أقسام الصفحة الرئيسية الحالية

بعد فحص `src/routes/index.tsx`، الأقسام هي:

1. **Hero** — العنوان الدوّار، الوصف، أزرار CTA، والكلمات الأربع المتحرّكة (فكرتك/موقعك/متجرك/نظامك) + مشاريع الهيرو (تُدار مسبقًا في `/admin/hero`).
2. **Featured Projects** — الترويسة (eyebrow, title, description) — البطاقات نفسها تأتي من جدول `projects`.
3. **Services** — الترويسة + قائمة الخدمات الأربع الظاهرة في الهوم (`homeServices` حالياً hardcoded).
4. **How I Work** — الترويسة + مراحل العمل الست (`workflow` hardcoded حالياً).
5. **Experience** — الترويسة فقط (البيانات من `experiences`).
6. **Certificates** — الترويسة + قائمة الشهادات الأربع الظاهرة في الهوم (`certificates` hardcoded حالياً).
7. **Testimonials** — الترويسة (البيانات من `testimonials`).
8. **Final CTA** — العنوان، الوصف، ونصوص/روابط الأزرار.

## الاستراتيجية

الاستفادة من جدول `site_content` الموجود (key/value متعدد اللغات مع image_url وmetadata JSON) بدل إنشاء جداول جديدة — كلّ حقل قابل للتحرير يصبح صفًا بمفتاح ثابت مثل `home.hero.headline` أو `home.workflow` (JSON للقوائم).

### الواجهة: `/admin/home`

- Tabs عمودي/أفقي بالأقسام الثمانية.
- كل تبويب يعرض نموذجًا مخصّصًا (وليس CRUD جدولي) — الحقول جاهزة ومسمّاة بالعربي.
- زر "حفظ" لكل قسم يقوم بـ `upsert` على مفاتيح ذلك القسم دفعة واحدة.
- روابط سريعة للأقسام المدارة في صفحات مستقلة (مشاريع الهيرو، المشاريع، الخدمات، الشهادات، التوصيات) لتفادي التكرار.

### مفاتيح `site_content` المقترحة

```text
home.hero.headline_prefix   → "أعطِ الخبز لخبّازه وأعطِ"
home.hero.headline_suffix   → "لأهلها"
home.hero.rotating_words    → JSON: [{word, color}, ...]
home.hero.description       → نص
home.hero.cta_primary       → JSON: {label, href}
home.hero.cta_secondary     → JSON: {label, href}

home.work.eyebrow / title / description
home.services.eyebrow / title / description
home.services.items         → JSON: [{slug, title, outcome, tags[]}]
home.process.eyebrow / title / description
home.process.steps          → JSON: [{step, title, description}]
home.experience.eyebrow / title / description
home.certificates.eyebrow / title / description
home.certificates.items     → JSON: [{title, issuer, issuedAt}]
home.testimonials.eyebrow / title
home.cta.eyebrow / title / description / primary / secondary
```

### تعديل الواجهة الأمامية

- إنشاء hook `useHomeContent()` يجلب كل مفاتيح `home.*` مرة واحدة عبر `listSiteContent({ group_name: "home" })` مع TanStack Query.
- تعديل `src/routes/index.tsx` ليستخدم القيم من CMS مع fallback ثابت للقيم الحالية (نفس نمط Services/Career).

### الملفات الجديدة

- `src/routes/_authenticated/admin.home.tsx` — الصفحة بتبويبات.
- `src/components/admin/home/*` — نموذج لكل قسم (`HeroForm`, `ServicesForm`, `ProcessForm`, ...).
- `src/lib/cms/home-content.ts` — helpers: `useHomeContent`, `saveHomeSection`, ومفاتيح ثابتة.
- Migration بذور (seed) لإدخال المفاتيح الافتراضية بالقيم الحالية من `index.tsx` حتى لا تظهر الصفحة فارغة.

### تحديث الشريط الجانبي

إضافة رابط "الصفحة الرئيسية" في `AdminSidebar` قبل باقي روابط المحتوى.

## الأمان

- كل الكتابات تمر عبر `upsertSiteContent` الموجودة (تتطلب `requireSupabaseAuth` + `requireAdmin`).
- القراءة العامة عبر `listSiteContent` (متاحة لأنّ المحتوى غير حسّاس).
- لا حاجة لتعديلات RLS — الجدول مضبوط مسبقًا.

## خارج النطاق

- لا تغييرات على تصميم `/` نفسه.
- بيانات المشاريع والشهادات والتوصيات تبقى في جداولها المستقلة — هنا نُدير فقط "الترويسات" و"القوائم القصيرة الظاهرة في الهوم".

هل أبدأ التنفيذ؟
