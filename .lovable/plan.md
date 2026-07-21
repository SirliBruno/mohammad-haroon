## الهدف

تحسين صفحة إدارة المشاريع لتصبح سهلة الاستخدام (بدون كتابة JSON يدويًا)، وإضافة رافع صور حقيقي لأي مكان يعرض صورة أو معرض صور.

## المشاكل الحالية في `/admin/projects`

1. حقل "معرض الصور" يطلب من المستخدم كتابة JSON يدويًا مثل `[{"src":"...","alt":"..."}]` — غير قابل للاستخدام.
2. حقل "المؤشرات" و"النتائج" و"شهادة العميل" و"مسار التصميم" كلها JSON خام.
3. عند حفظ حقل JSON فارغ، الخادم يرفض القيمة أحيانًا بسبب اختلاف نوع (string vs array) — تم إصلاح جزء منه، سنكمله.
4. لا توجد معاينة للصور المرفوعة داخل المعرض.
5. صفحات أخرى فيها نفس المشكلة: `/admin/products` (gallery)، `/admin/services` (benefits/features/workflow/faq)، `/admin/content` (metadata) — لكن التركيز على الصور.

## الخطة

### 1) مكوّنات جديدة قابلة لإعادة الاستخدام

- `GalleryInput`: يعرض شبكة صور، زر "إضافة صورة" يفتح رافع الصور نفسه المستخدم في `ImageInput`، مع حقل نص بديل (alt) لكل صورة، وإعادة ترتيب بالسحب/أزرار (أعلى/أسفل)، وحذف. يُخرج مصفوفة `{src, alt}`.
- `StructuredListInput`: محرر مصفوفة من كائنات بحقول محددة (مثال: `label/value` للمؤشرات والنتائج، `title/description` لمسار التصميم، `question/answer` للأسئلة الشائعة). صفوف قابلة للإضافة/الحذف/إعادة الترتيب.
- `ObjectInput`: محرر كائن واحد بحقول محددة (شهادة العميل: `quote`, `author`, `role`).

### 2) توسيع نظام الحقول في `AdminCrud`

إضافة أنواع جديدة إلى `FieldDef`:
- `gallery` — يستخدم `GalleryInput`.
- `structured` — يأخذ `schema: { name, label, type }[]` ويستخدم `StructuredListInput`.
- `object` — نفس الفكرة لكائن مفرد.

كل هذه الأنواع تُخزّن كـ مصفوفة/كائن جافاسكربت في الحالة، ولا حاجة لتحويل JSON نصي — يحل مشكلة "Expected array, received string" جذريًا.

### 3) تحديث `/admin/projects`

استبدال الحقول التالية:
- `gallery` → `gallery` (رافع صور مرئي).
- `metrics` → `structured` بمخطط `{ label, value }`.
- `results` → `structured` بمخطط `{ label, value }`.
- `design_process` → يبقى نصًا حرًا (textarea)، مع خيار `structured` بمخطط `{ title, description }` إذا رغب المستخدم.
- `testimonial` → `object` بمخطط `{ quote, author, role }`.

الحقول الأخرى (title, slug, summary, tags, technologies, cover_url, ...) تبقى كما هي.

### 4) تعميم رافع الصور على باقي الصفحات

- `/admin/products`: `gallery` → `GalleryInput`.
- (اختياري في نفس الجولة) `/admin/services`: `benefits/features/workflow/faq` → `StructuredListInput`، لأنها JSON خام حاليًا.

### 5) تحسينات صغيرة أخرى في صفحة المشاريع

- توسيع حد حقل "الملخص" و"العميل" و"المدة" في مخطط Zod حسب الحاجة (بدون كسر التوافق).
- عرض صورة الغلاف كصورة مصغّرة في جدول القائمة.
- التأكد من تطبيع كل الحقول الاختيارية (null بدل سلسلة فارغة) قبل الإرسال.

## التفاصيل التقنية

- كل الصور تُرفع إلى نفس دلو التخزين الخاص (`media`) عبر `signHeroMediaPath`، مع مجلد `projects/gallery`.
- `GalleryInput` يخزّن `{src: string; alt: string}[]` — متوافق مع مخطط `mediaSchema` الموجود في `src/features/projects/schema.ts` ومع `jsonArray` في `src/features/cms/schemas.ts`.
- عند التحرير، لو كانت البيانات القديمة سلاسل روابط فقط، نطبّعها إلى `{src, alt: ""}`.
- في `AdminCrud.sanitizeForm`: الأنواع الجديدة تُمرّر كما هي بدون `JSON.parse`.

## ملفات ستُعدَّل أو تُنشأ

- جديد: `src/components/admin/gallery-input.tsx`
- جديد: `src/components/admin/structured-list-input.tsx`
- جديد: `src/components/admin/object-input.tsx`
- تعديل: `src/components/admin/admin-crud.tsx` (أنواع حقول جديدة + معالجة الحفظ)
- تعديل: `src/routes/_authenticated/admin.projects.tsx`
- تعديل: `src/routes/_authenticated/admin.products.tsx`
- تعديل (اختياري): `src/routes/_authenticated/admin.services.tsx`

## خارج النطاق

- تغيير قاعدة البيانات أو مخطط الجداول.
- إعادة تصميم الواجهة العامة (`/work`, `/work/$slug`).
- رفع فيديو أو ملفات غير الصور.
