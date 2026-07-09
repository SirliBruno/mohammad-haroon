import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { buildMeta } from "@/features/seo/build-meta";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Prose, DSButton, TagGroup } from "@/components/ds";
import { articles } from "@/data/writing";
import type { Article } from "@/features/writing/schema";
import { site } from "@/config/site";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const article = articles.find((a) => a.slug === params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: buildMeta({
          title: "Post not found",
          path: `/blog/${params.slug}`,
          noindex: true,
        }),
      };
    }
    const { article } = loaderData;
    return {
      meta: buildMeta({
        title: article.title,
        description: article.excerpt,
        path: `/blog/${article.slug}`,
        type: "article",
        image: article.cover?.src,
      }),
      links: [{ rel: "canonical", href: `/blog/${article.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.excerpt,
            datePublished: article.publishedAt,
            dateModified: article.updatedAt ?? article.publishedAt,
            author: { "@type": "Person", name: site.name },
            keywords: article.tags.join(", "),
          }),
        },
      ],
    };
  },
  notFoundComponent: PostNotFound,
  component: BlogPost,
});

function BlogPost() {
  const { article } = Route.useLoaderData() as { article: Article };
  const currentIndex = articles.findIndex((a) => a.slug === article.slug);
  const related = articles.filter((_, i) => i !== currentIndex).slice(0, 2);

  return (
    <>
      <header className="border-b border-border/60 pt-24 pb-14 md:pt-32 md:pb-16">
        <Container>
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link to="/blog" className="inline-flex items-center gap-1 hover:text-foreground">
              <ArrowLeft className="size-3.5" /> All posts
            </Link>
          </nav>
          <div className="mx-auto mt-6 max-w-3xl">
            <p className="text-xs text-muted-foreground">
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
              {" · "}
              {article.readingTime} min read
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance md:text-5xl lg:text-6xl">
              {article.title}
            </h1>
            <p className="mt-5 text-lg text-muted-foreground md:text-xl">{article.excerpt}</p>
            {article.tags.length ? (
              <div className="mt-6">
                <TagGroup items={article.tags} />
              </div>
            ) : null}
          </div>
        </Container>
      </header>

      <Section className="pt-12 md:pt-16">
        <div className="mx-auto max-w-2xl">
          <Prose size="lg">
            {(article.body as string).split(/\n{2,}/).map((block: string, i: number) => {
              const trimmed = block.trim();
              if (trimmed.startsWith("## ")) {
                return <h2 key={i}>{trimmed.slice(3)}</h2>;
              }
              if (trimmed.startsWith("- ")) {
                return (
                  <ul key={i}>
                    {trimmed.split("\n").map((li: string, j: number) => (
                      <li key={j}>{li.replace(/^-\s+/, "")}</li>
                    ))}
                  </ul>
                );
              }
              return <p key={i}>{trimmed}</p>;
            })}
          </Prose>
        </div>
      </Section>

      {/* Related */}
      {related.length ? (
        <Section className="border-t border-border/60">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Keep reading
          </p>
          <ul className="mt-6 divide-y divide-border/60 border-y border-border/60">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: r.slug }}
                  className="group flex items-baseline justify-between gap-6 py-5"
                >
                  <span className="text-base font-medium text-foreground transition-colors group-hover:text-primary md:text-lg">
                    {r.title}
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* CTA */}
      <Section className="border-t border-border/60">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border/60 bg-card p-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Enjoyed this?
          </h2>
          <p className="mt-3 text-muted-foreground">
            I write a few times a month. If you'd like to work together, get in touch.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <DSButton asChild size="lg">
              <Link to="/contact">
                Get in touch <ArrowRight />
              </Link>
            </DSButton>
            <DSButton asChild size="lg" variant="outline">
              <Link to="/blog">More writing</Link>
            </DSButton>
          </div>
        </div>
      </Section>
    </>
  );
}

function PostNotFound() {
  const { slug } = Route.useParams();
  return (
    <Section>
      <div className="mx-auto max-w-md text-center">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Post not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No essay matches "{slug}".
        </p>
        <div className="mt-6">
          <DSButton asChild variant="outline">
            <Link to="/blog">All posts</Link>
          </DSButton>
        </div>
      </div>
    </Section>
  );
}
