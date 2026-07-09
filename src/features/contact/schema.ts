import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().trim().min(1, "الاسم مطلوب").max(120, "الاسم طويل جدًا"),
  email: z.string().trim().email("يرجى إدخال بريد إلكتروني صحيح").max(255),
  type: z.enum(["hire", "freelance", "collab", "other"]),
  budget: z.string().trim().max(80).optional(),
  message: z
    .string()
    .trim()
    .min(10, "يرجى إضافة تفاصيل أكثر حول مشروعك")
    .max(4000, "الرسالة طويلة جدًا"),
  consent: z.boolean().refine((v) => v, "يجب الموافقة للمتابعة"),
  // خانة فخّ لالتقاط الروبوتات
  company: z.string().max(0).optional().or(z.literal("")),
});

export type Inquiry = z.infer<typeof inquirySchema>;
