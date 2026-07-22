import { Link, useRouter } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { DSButton } from "@/components/ds";

export function RouteErrorBoundary({
  reset,
  eyebrow = "خطأ",
  title = "تعذّر تحميل هذه الصفحة",
  description = "حدث خلل غير متوقّع. حاول مرّة أخرى أو عد إلى الرئيسية.",
}: {
  reset?: () => void;
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const router = useRouter();
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <Section>
        <div className="flex flex-wrap gap-3">
          <DSButton
            onClick={() => {
              reset?.();
              router.invalidate();
            }}
          >
            إعادة المحاولة
          </DSButton>
          <DSButton variant="secondary" asChild>
            <Link to="/">العودة إلى الرئيسية</Link>
          </DSButton>
        </div>
      </Section>
    </>
  );
}

export function RouteNotFoundBoundary({
  eyebrow = "غير موجود",
  title = "لم نعثر على هذه الصفحة",
  description = "قد يكون الرابط قديمًا أو تم نقل المحتوى.",
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <Section>
        <DSButton asChild>
          <Link to="/">العودة إلى الرئيسية</Link>
        </DSButton>
      </Section>
    </>
  );
}
