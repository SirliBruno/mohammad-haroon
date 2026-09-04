import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { listProducts } from "@/lib/cms/simple.functions";
import { Package, ExternalLink } from "lucide-react";
import { RouteErrorBoundary, RouteNotFoundBoundary } from "@/components/layout/route-boundaries";

export const Route = createFileRoute("/products")({
  errorComponent: ({ reset }) => <RouteErrorBoundary reset={reset} eyebrow="المنتجات" />,
  notFoundComponent: () => <RouteNotFoundBoundary eyebrow="المنتجات" />,
  head: () => ({
    meta: buildMeta({
      title: "المنتجات | محمد هارون",
      description: "منتجات رقمية أطلقها محمد هارون بتصميم وتنفيذ خاصّ.",
      path: "/products",
    }),
  }),
  component: ProductsPage,
});

type Product = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  cover_url: string | null;
  price_cents: number | null;
  currency: string | null;
  external_url: string | null;
  tags: string[] | null;
};

function formatPrice(cents: number | null, currency: string | null): string | null {
  if (cents == null) return null;
  const amount = cents / 100;
  const curr = (currency ?? "USD").toUpperCase();
  return curr === "SAR"
    ? `${amount.toFixed(0)} ريال`
    : `$${amount.toFixed(2)}`;
}

function ProductsPage() {
  const listFn = useServerFn(listProducts);

  const q = useQuery({
    queryKey: ["public", "products"],
    queryFn: () => listFn({ data: { limit: 60, offset: 0 } }),
    staleTime: 60_000,
  });

  const rows = ((q.data as { rows?: Product[] })?.rows ?? []) as Product[];

  return (
    <>
      <PageHeader
        eyebrow="المنتجات"
        title="المنتجات الرقمية"
        description="منتجات صُمِّمت وطُوِّرت بالكامل — أدوات، قوالب، وحلول جاهزة للاستخدام."
      />

      <Section>
        <Container>
          {q.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-56 rounded-2xl border border-border bg-muted animate-pulse" />
              ))}
            </div>
          ) : q.isError ? (
            <p className="text-sm text-red-600">تعذّر تحميل المنتجات. جرّب مجدداً.</p>
          ) : rows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/30 py-16 text-center">
              <Package className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">لا توجد منتجات متاحة حتى الآن. تابع قريباً!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rows.map((product, i) => {
                const price = formatPrice(product.price_cents, product.currency);
                const href = product.external_url ?? undefined;

                return (
                  <Reveal key={product.id} delay={i * 0.04}>
                    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card hover:shadow-md transition-shadow">
                      {product.cover_url ? (
                        <div className="aspect-video overflow-hidden bg-muted">
                          <img
                            src={product.cover_url}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center">
                          <Package className="h-12 w-12 text-muted-foreground/40" />
                        </div>
                      )}

                      <div className="flex flex-col gap-3 p-5 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold leading-snug">{product.name}</h3>
                          {price && (
                            <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                              {price}
                            </span>
                          )}
                        </div>
                        {product.tagline && (
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                            {product.tagline}
                          </p>
                        )}
                        {product.tags && product.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-auto">
                            {product.tags.slice(0, 4).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        {href && (
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            احصل عليه
                          </a>
                        )}
                      </div>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
