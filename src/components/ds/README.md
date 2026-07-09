# Design System — `src/components/ds/`

One consistent visual language for the entire Mohammad Haroon platform.
All brand-level components live here. Low-level primitives (shadcn/Radix)
stay under `src/components/ui/` and are composed by files in this folder.

Import from the barrel:

```tsx
import { DSButton, ProjectCard, Grid, CTA, Field } from "@/components/ds";
```

---

## Foundations (defined in `src/styles.css`)

### Color tokens (semantic → raw)

| Semantic | Light | Dark |
| --- | --- | --- |
| `background` | `#FFFFFF` | `#09090B` |
| `foreground` | `#09090B` | `#FAFAFA` |
| `card` | `#F8FAFC` | `#111114` |
| `primary` | `#2563EB` | `#3B82F6` |
| `accent` | `#7C3AED` | `#8B5CF6` |
| `muted` | `#F1F5F9` | `#18181B` |
| `border` | `#E4E4E7` | `rgb(255 255 255 / .08)` |
| `ring` | `= primary` | `= primary` |

Never hard-code hex in components — always use tokens (`bg-primary`,
`text-muted-foreground`, `border-border`).

### Typography

- Family: **Inter** (loaded via `<link>` in `__root.tsx`), var `--font-sans`.
- Body base: `16px / 1.6`. Selection tint uses `--primary`.
- Scale (tailwind classes):
  - Display: `text-5xl` / `text-6xl` / `text-7xl`, `font-semibold`, `tracking-tight`
  - H1 `text-4xl md:text-5xl`, H2 `text-3xl md:text-4xl`, H3 `text-2xl`, H4 `text-lg`
  - Body `text-base`, Small `text-sm`, Caption `text-xs`
- Numeric UI: use `font-mono` for code, prices, timers.

### Spacing scale

Tailwind default 4-px scale. Section rhythm: `py-20 md:py-28 lg:py-32`
(see `Section`). Inter-block gap: `gap-6` / `gap-8` / `gap-12`.

### Container widths

Tokens: `--container-sm | md | lg | xl | 2xl` (40 / 48 / 64 / 80 / 90 rem).
Default page container: `container-page` utility, max `80rem`, 20/32-px
horizontal padding.

### Breakpoints (Tailwind defaults)

`sm 640` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536`.
Mobile-first. Never disable zoom, never use `100vh` — use `min-h-dvh`.

### Border radius

Subtle. `--radius: 0.5rem` base → `rounded-md` for controls,
`rounded-lg` for cards/inputs, `rounded-xl` for large surfaces,
`rounded-full` for pills / avatars.

### Elevation

Minimal. Four tokens only — anything heavier is off-brand.

| Token | Use |
| --- | --- |
| `shadow-xs` | Kbd, subtle hairline lift |
| `shadow-sm` | Resting card |
| `shadow-md` | Hovered card |
| `shadow-lg` | Popover / dropdown / dialog |

### Motion

- Durations: `--duration-fast 150ms` · `--duration-base 250ms` · `--duration-slow 400ms`
- Easings: `--ease-out-quart (0.22, 1, 0.36, 1)` · `--ease-out-expo (0.16, 1, 0.3, 1)`
- Micro-interactions: 150–200 ms. Section reveals: 400–500 ms.
- Choreograph with `Stagger` (60 ms step).
- Always respect `prefers-reduced-motion` — the base layer disables all
  transitions/animations when set. `Reveal` / `Stagger` / `PageTransition`
  do the same via `useReducedMotion`.

### Focus states

Global `:focus-visible` outline: 2 px `ring`, 2 px offset. Never remove it.
Interactive DS components add `ring-offset-background` for both themes.

### Hover states

- Buttons: opacity 90% or `bg-*/90`, plus `active:scale-[0.98]`.
- Cards (`interactive`): border darkens + `shadow-md`.
- Links: `story-link` underline sweeps left-to-right on hover.

---

## Components

Every component is styled once, here, and consumed elsewhere.
Nothing under `ds/` accepts arbitrary color classes — pass tokens or variants.

### Actions

| Component | File | Purpose |
| --- | --- | --- |
| `DSButton` | `button.tsx` | Primary / secondary / outline / ghost / brand / accent / link, sizes sm–xl + icon |
| `DSLink` | `link.tsx` | Animated-underline link (`story-link`) |
| `Kbd` | `kbd.tsx` | Keyboard shortcut chip |

### Data display

| Component | Purpose |
| --- | --- |
| `DSBadge` | Status pill — neutral / brand / accent / success / warning / danger, optional `dot` |
| `Tag` / `TagGroup` | Dense metadata chips inside cards |
| `DSCard` + parts | Surface / outline / elevated / ghost, interactive hover, `sm/md/lg` padding |
| `ProjectCard` | Portfolio card with cover, tags, arrow affordance |
| `ServiceCard` | Freelance offering with engagement badge + deliverables |
| `CertificateCard` | Award / credential row with optional external link |
| `Gallery` | Asymmetric image grid |
| `Timeline` | Vertical dated milestones |
| `TestimonialQuote` | Editorial quote block with author line |
| `CodeBlock` | Monochrome code with copy button |

### Layout

| Component | Purpose |
| --- | --- |
| `Container` (in `layout/`) | Page-level max-width wrapper |
| `Section` (in `layout/`) | Vertical rhythm + Container |
| `PageHeader` (in `layout/`) | Route header with eyebrow / title / description |
| `Grid` | Responsive grid, cols per breakpoint, gap scale |
| `CTA` | Full-bleed call-to-action band with soft brand glow |

### Feedback

| Component | Purpose |
| --- | --- |
| `EmptyState` / `ErrorState` / `SuccessState` | Consistent zero/error/confirm blocks |
| `StateBlock` | Generic base for the three above |
| `Skeleton` / `SkeletonText` / `SkeletonCard` | Loading placeholders |

### Forms

| Component | Purpose |
| --- | --- |
| `Field` | Labelled row with hint + error + a11y wiring |
| `TextField` / `TextAreaField` | Field + shadcn Input / Textarea |
| Native shadcn: `Checkbox`, `RadioGroup`, `Select`, `Switch`, `Slider`, `Form` | Use directly from `@/components/ui/*` |

### Navigation & structure

- `Nav` (site header) — `src/components/layout/nav.tsx`
- `Footer` — `src/components/layout/footer.tsx`
- shadcn `Breadcrumb`, `Tabs`, `Accordion`, `DropdownMenu`, `NavigationMenu`,
  `Sidebar`, `Pagination`, `Sheet`, `Dialog`, `Popover`, `HoverCard`,
  `Tooltip`, `ContextMenu`, `Menubar`, `Command` — theme-inheriting via
  our tokens; no restyling needed.

### Motion

- `Reveal` (in `motion/`) — one-shot in-view fade-up.
- `PageTransition` (in `ds/motion.tsx`) — subtle route body fade+lift.
- `Stagger` (in `ds/motion.tsx`) — sequential children.

### Long-form

- `Prose` — writing/case-study body typography; drops shadcn styles for
  clean editorial hierarchy.

---

## Icons

- **Library only**: `lucide-react`. Never emoji.
- Default `size-4` inside buttons, `size-5` in stat rows, `size-6` for
  hero flourishes. Stroke width stays default (2). Prefer outline; use
  filled only for state (e.g. success check).
- Icon-only buttons **must** have `aria-label`. Wrap tiny icons in a
  44×44 tap target on mobile.

## Image style

- Photography: cool, quiet, high-contrast, minimal saturation.
- All images use `<img loading="lazy">` with explicit `alt`. Wrap in
  `aspect-*` containers to reserve space (no CLS).
- Radius: `rounded-lg` for inline media, `rounded-xl` for large hero
  cards. No drop shadows on imagery.

## Illustration style

- Line-first, single-weight, monochrome that inherits `currentColor`.
- Two accent colors max — `--primary` and `--accent`. No gradients on
  illustrations (gradients reserved for CTA glow and text-gradient).

---

## Accessibility rules (WCAG AA baseline)

- Contrast ≥ 4.5:1 body / 3:1 large text — enforced by tokens above.
- Single `<main>` per route; skip link in `__root.tsx`.
- All icon-only controls carry `aria-label`.
- Forms: visible label, error near field (via `Field`), `aria-invalid`
  and `aria-describedby` wired automatically.
- Focus-visible ring never removed; motion respects
  `prefers-reduced-motion`.
- Tap targets ≥ 44 × 44 on mobile.
- Never convey information by color alone — pair with icon or text.

## Dark mode rules

- Class strategy: `.dark` on `<html>`, set pre-hydration by
  `themeInitScript` (no FOUC).
- Every token has both light and dark values; components never branch on
  `resolved` — they read tokens.
- Borders in dark use low-opacity white; cards use `#111114`.
- Test both themes before shipping any surface.

## Responsive rules

- Mobile-first. Multi-item header rows use
  `grid-cols-[minmax(0,1fr)_auto]` at base and promote to flex at `sm:`.
- Every flex text container needs `min-w-0`; fixed icons/avatars need
  `shrink-0`; single-line headings need `truncate`.
- Prefer logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`) — the app
  is RTL/LTR ready via `dir` on `<html>`.
- Use `min-h-dvh` for full-height surfaces, never `min-h-screen`.

---

## Adding a new component

1. Live under `src/components/ds/`. Export from `index.ts`.
2. Compose shadcn primitives when possible.
3. Use only semantic tokens — no arbitrary colors.
4. Ship variants via `cva`, not one-off class names.
5. Add it to this README under the right section.
