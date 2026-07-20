# خطة تحسين نظام إدارة المحتوى

3 مراحل مرتّبة من الأحرج إلى التوسّعي. كل مرحلة قابلة للنشر مستقلة.

---

## المرحلة 1 — إصلاحات حرجة (سلامة البيانات + الأمان)

**1.1 إيقاف فقدان البيانات في تعديل المشروع**
- `admin.projects.tsx` → `handleEdit`: جلب الصف الكامل من الخادم (وليس القراءة من صف القائمة المُختصر) وتعبئة كل الحقول بقيمها الفعلية.
- إضافة server fn: `getProjectById` تعيد كل الأعمدة للأدمن.
- ضمان أن `handleSubmit` يرسل فقط الحقول المعدّلة (patch حقيقي) بدلًا من إعادة إرسال الحقول الفارغة كـ `null`.

**1.2 إصلاح البحث في `AdminCrud`**
- إضافة `useEffect` يعتمد على `[debouncedSearch]` مع debounce ~300ms.
- تمرير `search` فعليًا للخادم في كل تحديث.
- إزالة الفلترة المزدوجة client-side (`filtered = useMemo`) لأنها تعطي انطباعًا خاطئًا بأن النتائج مكتملة.

**1.3 تعميم رسائل الأخطاء على الخادم**
- `repository.server.ts`: تحويل `throw new Error(\`[${table}] ... ${error.message}\`)` إلى:
  - سجل كامل في الخادم (`console.error`).
  - رسالة generic للعميل: `"تعذّر تنفيذ العملية"`، مع تمرير الرمز فقط في حالة أخطاء معروفة (unique_violation → "المعرّف مستخدم مسبقًا"، not_null_violation → "حقل مطلوب مفقود").

**1.4 Rate-limiting على `submitMessage`**
- في `messages.functions.ts`: قراءة IP من `getRequest()` header، تخزين آخر 5 محاولات في جدول `analytics_events` أو جدول `rate_limits` جديد، رفض > 3 رسائل / 10 دقائق.
- إبقاء honey-pot و`min-time-to-submit` كما هي.

**1.5 تحديث الأنواع لـ `site_content`**
- إزالة `as any` من `content.functions.ts` بعد إعادة توليد `Database` types.
- تحقّق من وجود الجدول في `src/integrations/supabase/types.ts`؛ لو غير موجود، إبلاغ المستخدم.

---

## المرحلة 2 — توحيد التجربة الإدارية

**2.1 توحيد صفحات المشاريع والهيرو على المكوّنات المشتركة**
- إعادة كتابة `admin.projects.tsx` باستعمال `AdminShell` + `AdminCrud` (تقليصها من 455 → ~120 سطر).
- إعادة كتابة `admin.hero.tsx` بنفس الطريقة (279 → ~100 سطر).
- إضافة دعم في `AdminCrud` لـ:
  - أزرار ترتيب inline (↑/↓) عبر خاصية `reorderable`.
  - عمود `featured` badge.
  - رفع صور متعددة (cover + mobile) عبر مصفوفة `image` fields.

**2.2 نظام Toast موحّد**
- استعمال `sonner` (موجود ضمن shadcn) بدل `setMsg` المتناثر.
- إضافة `<Toaster />` في `AdminShell`.
- استبدال كل `setMsg("...")` و`alert()` بـ `toast.success/error/loading`.

**2.3 Modal تأكيد الحذف**
- استبدال `window.confirm()` بمكوّن `ConfirmDialog` (shadcn AlertDialog) — دعم RTL، ترجمة عربية، لوحة مفاتيح صحيحة.
- تطبيقه في كل مكان يحذف صفوف.

**2.4 تنظيف Storage عند الحذف**
- في `deleteRow` للجداول التي تحوي `cover_url`/`mobile_url`/`storage_path`: استخراج المسار من URL الموقّع، حذف الملف من bucket `media` عبر `supabaseAdmin` (بعد `requireAdmin`).
- للـ `media` collection: حذف مباشر بالـ `storage_path`.
- في حالة فشل حذف الملف: تسجيل تحذير وليس فشل العملية (الصف يُحذف على أي حال).

**2.5 مركز إشعارات في الشريط الجانبي**
- عدادات حية في `AdminShell` NAV: عدد المسودات، الرسائل الجديدة (unread)، الأفكار غير المنشورة.
- server fn واحدة: `getAdminBadges` تعيد `{ drafts, newMessages, ... }`.

---

## المرحلة 3 — توسّع وجودة على المدى الطويل

**3.1 دمج TanStack Query في كل صفحات الإدارة**
- استبدال نمط `useState + useEffect + refresh` بـ `useQuery` + `useMutation` + `invalidateQueries`.
- optimistic updates على reorder و toggle الحالة.
- إلغاء تلقائي عند unmount.

**3.2 Pagination حقيقي في `AdminCrud`**
- إضافة `pageSize` + `page` state.
- عرض إجمالي الصفوف (متوفر من `count` في `listRows`).
- أزرار السابق/التالي + قفزة لصفحة.

**3.3 معاينة المسودات**
- زر "معاينة" على كل صف مسودة → يفتح المسار العام بمعامل `?preview=<token>`.
- server fn `previewToken` توقّع JWT قصير (5 دقائق) يسمح بعرض صف غير منشور.
- المسار العام يتحقق من التوقيع ويعرض المحتوى مع badge "مسودة".

**3.4 تنقية Markdown في المدونة**
- `remark` + `rehype-sanitize` عند render مقال البلوق.
- منع `<script>`, `<iframe>` عدا من قائمة بيضاء (YouTube).

**3.5 سجل تعديلات (audit log)**
- جدول جديد `content_revisions` يخزّن snapshot قبل كل update عبر trigger.
- صفحة `/admin/history/:table/:id` تعرض التاريخ مع diff.
- زر "استعادة" لأي إصدار سابق.

**3.6 حفظ تلقائي للمسودات**
- في نماذج blog/projects: `useAutosave` كل 10 ثواني إلى `localStorage`.
- تنبيه عند العودة: "يوجد مسودة غير محفوظة، هل تستأنف؟"

---

## تفاصيل تقنية

**ملفات ستُنشأ:**
```
src/components/admin/confirm-dialog.tsx
src/components/admin/toast-provider.tsx
src/hooks/use-debounce.ts
src/hooks/use-autosave.ts
src/lib/cms/rate-limit.server.ts
src/lib/cms/storage-cleanup.server.ts
src/lib/cms/admin-badges.functions.ts
supabase/migrations/<ts>_rate_limits_and_revisions.sql
```

**ملفات ستُعدَّل جوهريًا:**
```
src/routes/_authenticated/admin.projects.tsx  (إعادة كتابة كاملة)
src/routes/_authenticated/admin.hero.tsx      (إعادة كتابة كاملة)
src/components/admin/admin-crud.tsx           (reorderable, pagination, debounce, toast)
src/components/admin/admin-shell.tsx          (Toaster + badges)
src/features/cms/repository.server.ts         (تعميم أخطاء + hooks للحذف)
src/lib/cms/messages.functions.ts             (rate-limit)
```

**مخطط ASCII للتدفق الجديد لصفحة إدارة:**
```
AdminShell (sidebar + toaster + badges)
  └── AdminCrud
        ├── useQuery (list) ─── debounced search
        ├── Table with reorder ↑↓ + pagination
        ├── Sheet form (create/edit)
        │     └── useMutation ── optimistic ── invalidate
        └── ConfirmDialog (delete)
                └── deleteFn ── storage cleanup ── invalidate
```

## الترتيب المقترح للتنفيذ

المرحلة 1 كاملة أولًا (تُنشر). ثم المرحلة 2. المرحلة 3 اختيارية حسب الحاجة.

**زمن تقديري:** المرحلة 1 = ~2-3 جولات، المرحلة 2 = ~4-5 جولات، المرحلة 3 = ~5-7 جولات.

هل نبدأ بالمرحلة 1؟
