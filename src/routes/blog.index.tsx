import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { buildMeta } from "@/features/seo/build-meta";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/layout/section";
import { EmptyState } from "@/components/ds";
import { articles } from "@/data/writing";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: buildMeta({
      title: "Blog",
      description:
        "Essays and notes on product, design, and engineering craft — by Mohammad Haroon.",
      path: "/blog",
    }),
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const posts = [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Writing"
        description="Occasional essays on craft, design systems, and shipping software worth using."
      />
      <Section>
        {posts.length === 0 ? (
          <EmptyState
            title="No posts yet"
            description="First essay coming soon."
          />
        ) : (
          <ul className="divide-y divide-border/60 border-y border-border/60">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group flex flex-col gap-3 py-8 md:flex-row md:items-baseline md:justify-between md:gap-10"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                      {" · "}
                      {post.readingTime} min read
                      {post.tags.length ? " · " + post.tags.join(", ") : ""}
                    </p>
                    <h2 className="mt-2 text-xl font-medium tracking-tight text-foreground transition-colors group-hover:text-primary md:text-2xl">
                      {post.title}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                      {post.excerpt}
                    </p>
                  </div>
                  <ArrowUpRight
                    aria-hidden
                    className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
