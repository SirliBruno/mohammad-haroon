# Services Section Redesign — Floating Panels Layout

Rebuild the Services grid so each service is a tall showcase card (~4:5) with two **floating rounded panels** — one near the top (service details) and one near the bottom (featured projects) — hovering over a large central showcase area that holds an iPhone mockup and a glass logo badge. Matches the reference wireframe exactly.

## Card Anatomy

```text
┌──────────────────────────────────────┐
│                                      │
│    ╭──────────────────────────╮      │  ← floating panel, thin border
│    │     Service Title        │      │    rounded-3xl, padded, inset
│    │  Short description line  │      │    from card edges
│    ╰──────────────────────────╯      │
│                                      │
│                                      │
│           SHOWCASE AREA              │
│                                      │
│              ┌────┐   ╭──╮           │  ← iPhone + glass logo badge
│              │ 📱 │   │◎ │           │    (logo slightly overlaps phone)
│              │    │   ╰──╯           │
│              └────┘                  │
│                                      │
│    ╭──────────────────────────╮      │  ← floating panel, subtle fill
│    │  Featured Projects       │      │    rounded-3xl, inset from edges
│    │  • Rent Right            │      │
│    │  • Fitness Camp   View → │      │
│    │  • Academy               │      │
│    ╰──────────────────────────╯      │
│                                      │
└──────────────────────────────────────┘
   outer card: thin border, radius 32px
```

Key structural rules from the reference:
- Outer card is a single container with a hairline border and radius ~32px.
- Header panel and footer panel are **inset** (left/right margins), **not** flush edge-to-edge. Each has its own rounded border and its own padding.
- The area between the two panels is intentionally empty except for the phone + logo composition.
- Footer panel has a slightly different surface tone than the header (subtle fill vs outline-only) so it reads as secondary.

## Files to Change

1. **`src/features/cms/schemas.ts`** — extend `service` schema with optional showcase fields:
   - `showcase_phone_image` (URL) — screenshot inside iPhone
   - `showcase_logo_image` (URL) — floating badge logo
   - `showcase_logo_label` (short string)
   - `featured_project_slugs` (up to 3 project slugs)

2. **Supabase migration** — add the four nullable columns to `services`.

3. **`src/data/services.ts`** — fallback showcase content per service.

4. **`src/components/ds/service-showcase-card.tsx`** (new) — the card:
   - Root: `<article>` with the outer bordered container
   - Absolute-positioned header panel near top (`top-5 inset-x-5`)
   - Absolute-positioned footer panel near bottom (`bottom-5 inset-x-5`)
   - Absolutely centered showcase composition: `<IPhoneFrame>` + glass logo badge overlapping the phone
   - Whole card wrapped in `<Link>` to `/services/{slug}`; footer project links use `stopPropagation`

5. **`src/routes/services.index.tsx`** — replace current grid with new component, `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, `gap-6 md:gap-8`.

6. **`src/routes/_authenticated/admin.services.tsx`** — expose the four new fields (image inputs + featured-projects multi-select).

## Visual Tokens

- Card: `bg-card border border-border/60 rounded-[32px] aspect-[4/5] shadow-xs`
- Header panel: `bg-transparent border border-border rounded-3xl px-6 py-5`, title `text-lg font-semibold`, description `text-sm text-muted-foreground` (2-line clamp)
- Footer panel: `bg-secondary/60 border border-border/60 rounded-3xl px-6 py-5`, label `text-[11px] uppercase tracking-[0.14em] text-muted-foreground`, project rows `text-sm font-medium`
- Showcase area background: quiet — no gradient, just card bg with a very soft radial glow behind the phone (`bg-[radial-gradient(60%_50%_at_50%_50%,color-mix(in_oklab,var(--primary)_8%,transparent),transparent)]`)
- Glass badge: `w-16 h-16 rounded-2xl bg-background/60 backdrop-blur-xl border border-border/60 shadow-lg`, logo `w-8 h-8` inside, positioned to overlap phone by ~20px
- iPhone: reuse `IPhoneFrame` from `src/components/mockups/devices.tsx` at `w-[180px]`

## Hover Choreography (group)

- Card: `-translate-y-1`, shadow steps up to `shadow-2xl`, border becomes `border-primary/30`
- Phone: `-translate-y-2.5` (10px), 600ms `ease-out-quart`
- Logo badge: `rotate-[5deg] scale-[1.05]`
- Footer panel: `-translate-y-0.5`, project rows opacity `70 → 100`
- Duration 500–700ms across the board; global `prefers-reduced-motion` already disables

## Content Mapping (fallbacks)

| Service | Phone screen | Logo badge | Featured projects |
|---|---|---|---|
| Website Development | Corporate homepage | React | 3 corporate sites |
| WordPress | WP site | WordPress | WP builds |
| WooCommerce / E-commerce | Store homepage | WooCommerce | Store projects |
| UI/UX Design | Mobile UI screens | Figma | UI case studies |
| Graphic Design | Brand mock | Adobe / brand mark | Design work |
| Landing Pages | Landing page | Google Ads mark | Landing projects |
| Website Maintenance | Dashboard | Supabase / gear | Maintenance clients |

## Accessibility

- Card is `<article>` with header title as `<h3>`
- Footer project anchors have explicit labels; card-level `<Link>` handles the primary destination
- iPhone screenshot has descriptive `alt`; logo badge has `aria-label`
- Visible focus ring on the card via `:focus-visible`

## Out of Scope

- `/services/{slug}` detail pages stay unchanged
- Homepage services teaser unchanged
- Existing `ServiceCard` component remains for other usages
