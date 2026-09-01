import { createFileRoute } from "@tanstack/react-router";
import { buildMeta } from "@/features/seo/build-meta";
import { site } from "@/config/site";
import { RouteErrorBoundary, RouteNotFoundBoundary } from "@/components/layout/route-boundaries";

import { Hero } from "@/components/sections/hero";
import { SocialProof } from "@/components/sections/social-proof";
import { WhatIBuild } from "@/components/sections/what-i-build";
import { FeaturedWork } from "@/components/sections/featured-work";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Offer300 } from "@/components/sections/offer-300";
import { MvpSection } from "@/components/sections/mvp-section";
import { AboutSection } from "@/components/sections/about-section";
import { ProjectRequestForm } from "@/components/sections/project-request-form";
import { FaqSection } from "@/components/sections/faq-section";
import { FinalCTA } from "@/components/sections/final-cta";

export const Route = createFileRoute("/")({
  errorComponent: ({ reset }) => <RouteErrorBoundary reset={reset} />,
  notFoundComponent: () => <RouteNotFoundBoundary />,
  head: () => ({
    meta: buildMeta({
      title: `${site.name} | تطوير مواقع وأنظمة ومتاجر إلكترونية`,
      description: site.description,
      path: "/",
    }),
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Social Proof Section ("ما أبنيه") */}
      <SocialProof />

      {/* 3. What I Build ("مو بس مواقع." with custom solutions CTA line) */}
      <WhatIBuild />

      {/* 4. Curated Featured Work (CampFlow + Store + Website + Next Steps CTA) */}
      <FeaturedWork />

      {/* 5. How It Works ("من الفكرة إلى الإطلاق.") */}
      <HowItWorks />

      {/* 6. 300 SAR Offer ("ابدأ من 300 ريال") */}
      <Offer300 />

      {/* 7. MVP Section ("عندك فكرة كبيرة؟") */}
      <MvpSection />

      {/* 8. About Me ("وراء كل مشروع شخص يهتم بالتفاصيل.") */}
      <AboutSection />

      {/* 9. Project Request Form & WhatsApp Integration ("خلنا نبدأ بفكرتك") */}
      <ProjectRequestForm />

      {/* 10. FAQ ("الأسئلة الشائعة") */}
      <FaqSection />

      {/* 11. Final CTA ("عندك فكرة؟ خلنا نبنيها.") */}
      <FinalCTA />
    </>
  );
}
