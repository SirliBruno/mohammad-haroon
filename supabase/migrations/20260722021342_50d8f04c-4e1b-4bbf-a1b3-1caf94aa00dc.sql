
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS spotlight jsonb;

UPDATE public.projects
SET
  spotlight = jsonb_build_object(
    'title', 'مساعد الإيجار الذكي',
    'description', 'بدل ما يبحث المستخدم عن المنتجات يدويًا، يستطيع وصف احتياجه بلغة طبيعية مثل: "بكرة عندي كشتة" أو "بغسل السيارة"، ليقوم المساعد الذكي بتحليل الطلب واقتراح الأدوات المناسبة والمتوفرة بالقرب منه.'
  ),
  section_order = ARRAY['spotlight','problem','goals','research','solution','designProcess','development','stack','gallery','metrics','highlights','lessons','testimonial']
WHERE slug = 'rent-right';
