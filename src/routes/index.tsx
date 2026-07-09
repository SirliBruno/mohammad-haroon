import { createFileRoute } from "@tanstack/react-router";
import { buildMeta } from "@/features/seo/build-meta";
import { Section } from "@/components/layout/section";
import { Eyebrow } from "@/components/typography/eyebrow";
import { site } from "@/config/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: buildMeta({ description: site.description, path: "/" }),
  }),
  component: Index,
});

function Index() {
  return (
    <Section>
      <div className="max-w-3xl">
        <Eyebrow>Foundation ready</Eyebrow>
        <h1 className="mt-5 text-5xl font-semibold tracking-tight text-foreground md:text-6xl lg:text-7xl">
          {site.tagline}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
          {site.description}
        </p>
      </div>
    </Section>
  );
}
