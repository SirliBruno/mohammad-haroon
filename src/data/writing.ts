import type { Article } from "@/features/writing/schema";

export const articles: Article[] = [
  {
    slug: "the-quiet-interface",
    title: "The quiet interface",
    excerpt:
      "The best software feels like nothing at all. A short essay on restraint as a design principle.",
    publishedAt: "2026-05-14",
    tags: ["Design", "Craft"],
    readingTime: 5,
    body: `The best interfaces don't announce themselves. They recede, letting the work happen.

We've spent a decade adding: more color, more motion, more surfaces, more chrome. Every framework ships with a "look at me" mode enabled by default. The result is products that shout, and users who tune out.

## Restraint as a feature

Every element on a screen competes for attention. Every animation, every gradient, every emoji in a button. When everything is loud, nothing is. Restraint isn't the absence of design — it's the discipline to decide what deserves the user's attention this second.

## What quiet looks like

- One primary action per view. At most one secondary.
- Motion that serves comprehension, not decoration.
- Copy that says the thing, then stops.
- Neutral surfaces, saturated accents used sparingly.

A quiet interface trusts its user. That trust is the whole game.`,
  },
  {
    slug: "design-systems-are-a-product",
    title: "Your design system is a product",
    excerpt:
      "The teams that treat their internal system like a product ship better software. Here's the mental model.",
    publishedAt: "2026-04-02",
    tags: ["Design systems", "Engineering"],
    readingTime: 8,
    body: `Design systems fail for the same reason internal tools fail: nobody owns the user experience.

## Who is the user?

Your design system's user is the engineer who has fifteen minutes to add a modal to a page. If your system doesn't make that engineer's fifteen minutes feel great, adoption dies.

## Symptoms of a system without an owner

- Undocumented components you can only learn by reading the source.
- Three ways to build a button, none of them blessed.
- A Figma library and a codebase that quietly disagree.
- No changelog. No migration path. No deprecation policy.

## Treat it like a product

Ship a changelog. Do office hours. Interview your users. Write docs like your career depends on adoption, because it does.`,
  },
  {
    slug: "hire-for-taste",
    title: "Hire for taste",
    excerpt:
      "Skills are trainable. Taste is a proxy for judgment, and judgment is what makes senior engineers senior.",
    publishedAt: "2026-02-20",
    tags: ["Hiring", "Team"],
    readingTime: 6,
    body: `Every senior hire I've regretted had strong skills and weak taste.

Taste is the accumulated judgment of what to do and — more importantly — what not to do. It's what stops a senior engineer from adding a third abstraction layer when two would do.

## Interviewing for taste

Ask candidates to critique work — real work, with real trade-offs. Watch what they notice first. The engineer who spots the missing loading state before the missing test is telling you something.

## Taste is not opinion

Opinions are cheap. Taste is opinions calibrated by shipping. Look for scar tissue, not preferences.`,
  },
];
