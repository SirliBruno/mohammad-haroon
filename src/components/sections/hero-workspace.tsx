/**
 * HeroWorkspace — "Floating Windows".
 *
 * Five deliberately-composed windows arranged as a designer/developer's
 * workspace. Every 8s all four project-bound windows crossfade together
 * to the next featured project.
 *
 *   1. Browser         (dominant, showcases the website)
 *   2. Figma           (top-right, peeks behind the browser)
 *   3. VS Code         (bottom-left, peeks from behind)
 *   4. iPhone preview  (overlaps browser bottom-right)
 *   5. Project card    (small overview: name, status, category, date)
 *
 * Motion is intentionally quiet: soft mouse parallax + gentle float only.
 */
import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { Link } from "@tanstack/react-router";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowUpRight, Figma } from "lucide-react";
import { BrowserFrame, PhoneFrame } from "@/components/mockups/devices";
import {
  DashboardUI,
  EditorUI,
  MobileAppUI,
  StoreUI,
} from "@/components/mockups/ui-samples";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Featured projects — the four synchronized crossfades                       */
/* -------------------------------------------------------------------------- */

type FeaturedProject = {
  slug: string;
  name: string;
  host: string;
  category: string;
  year: number;
  status: "مباشر" | "قيد التطوير";
  accent: string; // Tailwind color token used by Figma frame + code accents
  Website: (p: { className?: string }) => ReactElement;
  Mobile: (p: { className?: string }) => ReactElement;
  code: string[]; // ~8 lines of realistic React
  figma: {
    title: string;
    frames: string[]; // 4 frame labels
  };
};

const FEATURED: FeaturedProject[] = [
  {
    slug: "northwind-analytics",
    name: "Northwind",
    host: "northwind.app",
    category: "تصميم واجهات",
    year: 2025,
    status: "مباشر",
    accent: "emerald",
    Website: DashboardUI,
    Mobile: MobileAppUI,
    code: [
      "export function Overview({ range }: Props) {",
      "  const { data } = useMetrics(range);",
      "",
      "  return (",
      "    <Card className=\"p-6\">",
      "      <Header title=\"MRR\" delta={data.delta} />",
      "      <TrendChart series={data.mrr} />",
      "    </Card>",
      "  );",
      "}",
    ],
    figma: {
      title: "Northwind · Reports v3",
      frames: ["Overview", "Cohorts", "Empty", "Mobile"],
    },
  },
  {
    slug: "haven-storefront",
    name: "Haven",
    host: "haven.co",
    category: "تجارة إلكترونية",
    year: 2025,
    status: "مباشر",
    accent: "amber",
    Website: StoreUI,
    Mobile: MobileAppUI,
    code: [
      "export function ProductCard({ product }: Props) {",
      "  return (",
      "    <article className=\"group\">",
      "      <Image src={product.cover} alt={product.name} />",
      "      <h3 className=\"mt-3 text-sm\">{product.name}</h3>",
      "      <p className=\"text-xs text-muted\">${product.price}</p>",
      "    </article>",
      "  );",
      "}",
    ],
    figma: {
      title: "Haven · Storefront v2",
      frames: ["Home", "PDP", "Cart", "Checkout"],
    },
  },
  {
    slug: "atelier-cms",
    name: "Atelier",
    host: "atelier.studio",
    category: "مواقع إلكترونية",
    year: 2024,
    status: "مباشر",
    accent: "sky",
    Website: EditorUI,
    Mobile: MobileAppUI,
    code: [
      "export function Editor({ doc }: Props) {",
      "  const [blocks, setBlocks] = useBlocks(doc);",
      "",
      "  return (",
      "    <main className=\"mx-auto max-w-2xl\">",
      "      <Toolbar onInsert={setBlocks} />",
      "      <BlockList value={blocks} />",
      "    </main>",
      "  );",
      "}",
    ],
    figma: {
      title: "Atelier · Editor v1.4",
      frames: ["Canvas", "Blocks", "Preview", "Publish"],
    },
  },
  {
    slug: "lumen-payments",
    name: "Lumen",
    host: "lumen.finance",
    category: "مواقع إلكترونية",
    year: 2024,
    status: "قيد التطوير",
    accent: "violet",
    Website: DashboardUI,
    Mobile: MobileAppUI,
    code: [
      "export async function createCharge(input: ChargeInput) {",
      "  const session = await auth();",
      "  return db.charge.create({",
      "    data: {",
      "      amount: input.amount,",
      "      merchantId: session.merchantId,",
      "    },",
      "  });",
      "}",
    ],
    figma: {
      title: "Lumen · Console v0.9",
      frames: ["Ledger", "Payouts", "API keys", "Logs"],
    },
  },
];

/* -------------------------------------------------------------------------- */
/* Window chrome primitives                                                    */
/* -------------------------------------------------------------------------- */

function WindowShell({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/60 bg-card shadow-[0_30px_80px_-40px_rgba(0,0,0,0.45)] backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

function WindowTitleBar({
  label,
  icon,
}: {
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      dir="ltr"
      className="flex items-center gap-2 border-b border-border/50 bg-muted/40 px-3 py-2"
    >
      <div className="flex gap-1.5">
        <span className="size-2.5 rounded-full bg-red-400/70" />
        <span className="size-2.5 rounded-full bg-amber-400/70" />
        <span className="size-2.5 rounded-full bg-emerald-400/70" />
      </div>
      <div className="mx-auto flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="w-10" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Figma window                                                               */
/* -------------------------------------------------------------------------- */

const ACCENT_TINT: Record<string, string> = {
  emerald: "from-emerald-200/60 via-emerald-100/30 to-transparent dark:from-emerald-900/40",
  amber: "from-amber-200/60 via-amber-100/30 to-transparent dark:from-amber-900/40",
  sky: "from-sky-200/60 via-sky-100/30 to-transparent dark:from-sky-900/40",
  violet: "from-violet-200/60 via-violet-100/30 to-transparent dark:from-violet-900/40",
};

function FigmaWindow({ project, className }: { project: FeaturedProject; className?: string }) {
  return (
    <WindowShell className={cn("w-[320px]", className)}>
      <WindowTitleBar
        label={project.figma.title}
        icon={<Figma className="size-3" aria-hidden />}
      />
      <div className="grid grid-cols-2 gap-2 bg-background/80 p-3">
        {project.figma.frames.map((f, i) => (
          <div key={f} className="space-y-1">
            <div
              className={cn(
                "aspect-[4/3] rounded-md bg-linear-to-br",
                i === 0
                  ? ACCENT_TINT[project.accent]
                  : "from-muted to-muted/40",
                "ring-1 ring-inset ring-border/40",
              )}
            >
              <div className="mx-2 mt-2 h-1 w-6 rounded-full bg-foreground/20" />
              <div className="mx-2 mt-1.5 h-1 w-10 rounded-full bg-foreground/15" />
            </div>
            <div dir="ltr" className="text-[9px] text-muted-foreground">
              {f}
            </div>
          </div>
        ))}
      </div>
    </WindowShell>
  );
}

/* -------------------------------------------------------------------------- */
/* VS Code window                                                             */
/* -------------------------------------------------------------------------- */

const CODE_ACCENT: Record<string, string> = {
  emerald: "text-emerald-500",
  amber: "text-amber-500",
  sky: "text-sky-500",
  violet: "text-violet-500",
};

function CodeWindow({ project, className }: { project: FeaturedProject; className?: string }) {
  return (
    <WindowShell className={cn("w-[340px] bg-neutral-950", className)}>
      <div
        dir="ltr"
        className="flex items-center gap-2 border-b border-white/5 bg-neutral-900 px-3 py-2"
      >
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-red-400/70" />
          <span className="size-2.5 rounded-full bg-amber-400/70" />
          <span className="size-2.5 rounded-full bg-emerald-400/70" />
        </div>
        <div className="mx-auto flex items-center gap-2 text-[10px] font-medium text-neutral-400">
          <span className={cn("size-1.5 rounded-full", CODE_ACCENT[project.accent])}
            style={{ backgroundColor: "currentColor" }} />
          <span className="text-neutral-300">{project.name.toLowerCase()}.tsx</span>
        </div>
        <div className="w-10" />
      </div>
      <div dir="ltr" className="flex bg-neutral-950 font-mono text-[10px] leading-[1.65]">
        <div className="select-none border-r border-white/5 px-2 py-3 text-right text-neutral-600">
          {project.code.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <pre className="flex-1 overflow-hidden px-3 py-3 text-neutral-300">
          {project.code.map((line, i) => (
            <div key={i} className="whitespace-pre">
              {colorize(line, project.accent)}
            </div>
          ))}
        </pre>
      </div>
    </WindowShell>
  );
}

/** Minimal, purpose-built syntax highlighter. */
function colorize(line: string, accent: string): ReactElement {
  const keyword = /\b(export|function|return|const|async|await|import|from)\b/g;
  const jsxTag = /(<\/?[A-Za-z][A-Za-z0-9]*)/g;
  const strings = /("[^"]*")/g;
  const numbers = /\b(\d+)\b/g;

  const tokens: Array<{ t: string; k: "kw" | "tag" | "str" | "num" | "txt" }> = [];
  const src = line;
  const pattern = new RegExp(
    `${keyword.source}|${jsxTag.source}|${strings.source}|${numbers.source}`,
    "g",
  );
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(src))) {
    if (m.index > last) tokens.push({ t: src.slice(last, m.index), k: "txt" });
    if (m[1]) tokens.push({ t: m[0], k: "kw" });
    else if (m[2]) tokens.push({ t: m[0], k: "tag" });
    else if (m[3]) tokens.push({ t: m[0], k: "str" });
    else tokens.push({ t: m[0], k: "num" });
    last = m.index + m[0].length;
  }
  if (last < src.length) tokens.push({ t: src.slice(last), k: "txt" });

  const kwClass = CODE_ACCENT[accent];
  return (
    <>
      {tokens.map((tk, i) => {
        if (tk.k === "kw") return <span key={i} className={kwClass}>{tk.t}</span>;
        if (tk.k === "tag") return <span key={i} className="text-rose-400/80">{tk.t}</span>;
        if (tk.k === "str") return <span key={i} className="text-amber-300/80">{tk.t}</span>;
        if (tk.k === "num") return <span key={i} className="text-sky-300/80">{tk.t}</span>;
        return <span key={i}>{tk.t}</span>;
      })}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Project overview card                                                       */
/* -------------------------------------------------------------------------- */

function ProjectCard({ project, className }: { project: FeaturedProject; className?: string }) {
  const isLive = project.status === "مباشر";
  return (
    <div
      className={cn(
        "w-[220px] rounded-xl border border-border/60 bg-background/85 p-4 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.4)] backdrop-blur-xl",
        className,
      )}
      dir="rtl"
    >
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          مشروع مختار
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-medium",
            isLive
              ? "bg-emerald-500/12 text-emerald-600"
              : "bg-amber-500/12 text-amber-600",
          )}
        >
          <span
            className={cn(
              "size-1 rounded-full",
              isLive ? "bg-emerald-500" : "bg-amber-500",
            )}
          />
          {project.status}
        </span>
      </div>
      <div className="mt-3 text-base font-semibold tracking-tight text-foreground">
        {project.name}
      </div>
      <div className="mt-4 space-y-2 text-[11px]">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">التصنيف</span>
          <span className="text-foreground">{project.category}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">سنة الإنجاز</span>
          <span className="text-foreground" dir="ltr">{project.year}</span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Parallax primitive                                                          */
/* -------------------------------------------------------------------------- */

type ParallaxCtx = {
  mx: ReturnType<typeof useMotionValue<number>>;
  my: ReturnType<typeof useMotionValue<number>>;
};

function FloatingLayer({
  ctx,
  depth,
  x,
  y,
  rotate = 0,
  floatY = 6,
  duration = 12,
  delay = 0,
  z = 0,
  className,
  children,
}: {
  ctx: ParallaxCtx;
  depth: number;
  x: string | number;
  y: string | number;
  rotate?: number;
  floatY?: number;
  duration?: number;
  delay?: number;
  z?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const tx = useTransform(ctx.mx, (v) => v * depth);
  const ty = useTransform(ctx.my, (v) => v * depth);
  return (
    <motion.div
      className={cn("absolute", className)}
      style={{ left: x, top: y, x: tx, y: ty, rotate, zIndex: z }}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -floatY, 0] }}
        transition={
          reduce
            ? undefined
            : { duration, repeat: Infinity, ease: "easeInOut", delay }
        }
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main                                                                        */
/* -------------------------------------------------------------------------- */

export function HeroWorkspace() {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce || FEATURED.length <= 1) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % FEATURED.length);
    }, 8000);
    return () => window.clearInterval(id);
  }, [reduce]);

  // Mouse parallax
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 45, damping: 22, mass: 0.7 });
  const my = useSpring(rawY, { stiffness: 45, damping: 22, mass: 0.7 });
  const ctx: ParallaxCtx = useMemo(() => ({ mx, my }), [mx, my]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !canvasRef.current) return;
    const r = canvasRef.current.getBoundingClientRect();
    rawX.set(e.clientX - (r.left + r.width / 2));
    rawY.set(e.clientY - (r.top + r.height / 2));
  };
  const onMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  const current = FEATURED[active];
  const centerX = useTransform(mx, (v) => v * 0.01);
  const centerY = useTransform(my, (v) => v * 0.01);

  return (
    <div
      ref={canvasRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      dir="ltr"
      className="relative isolate w-full select-none [perspective:1600px]"
      aria-label="مساحة عمل رقمية"
      role="img"
    >
      {/* Ambient background: soft grid + radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(70%_60%_at_50%_50%,black,transparent)]"
      >
        <div
          className="absolute inset-0 opacity-30 dark:opacity-15"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute left-1/2 top-1/2 size-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="relative mx-auto aspect-[5/4] w-full min-h-[520px] sm:min-h-[600px] md:min-h-[660px] lg:min-h-[700px]">
        {/* -------------------- FIGMA (behind, top-right) -------------------- */}
        <FloatingLayer
          ctx={ctx}
          depth={0.03}
          x="58%"
          y="-2%"
          rotate={3}
          floatY={6}
          duration={14}
          delay={0.2}
          z={10}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.slug + "-figma"}
              initial={reduce ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0 }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            >
              <FigmaWindow project={current} />
            </motion.div>
          </AnimatePresence>
        </FloatingLayer>

        {/* -------------------- BROWSER (dominant centerpiece) ---------------- */}
        <motion.div
          className="pointer-events-auto absolute left-1/2 top-[44%] w-[88%] max-w-[640px] -translate-x-1/2 -translate-y-1/2"
          style={{ x: centerX, y: centerY, zIndex: 20 }}
          initial={reduce ? false : { opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-10 -z-10 rounded-[3rem] bg-linear-to-br from-primary/12 via-accent/8 to-transparent blur-3xl"
          />
          <BrowserFrame url={current.host} className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.slug + "-web"}
                initial={reduce ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="size-full"
              >
                <current.Website />
              </motion.div>
            </AnimatePresence>
          </BrowserFrame>
        </motion.div>

        {/* -------------------- VS CODE (bottom-left, peeks) ------------------ */}
        <FloatingLayer
          ctx={ctx}
          depth={0.04}
          x="-4%"
          y="52%"
          rotate={-4}
          floatY={7}
          duration={13}
          delay={0.4}
          z={15}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.slug + "-code"}
              initial={reduce ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0 }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            >
              <CodeWindow project={current} />
            </motion.div>
          </AnimatePresence>
        </FloatingLayer>

        {/* -------------------- iPHONE (overlaps browser, bottom-right) ------- */}
        <FloatingLayer
          ctx={ctx}
          depth={0.05}
          x="66%"
          y="54%"
          rotate={5}
          floatY={8}
          duration={12}
          delay={0.6}
          z={30}
        >
          <div className="drop-shadow-[0_30px_40px_rgba(0,0,0,0.3)]">
            <PhoneFrame className="w-[160px] sm:w-[180px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.slug + "-mobile"}
                  initial={reduce ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0 }}
                  transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                  className="size-full"
                >
                  <current.Mobile />
                </motion.div>
              </AnimatePresence>
            </PhoneFrame>
          </div>
        </FloatingLayer>

        {/* -------------------- PROJECT OVERVIEW CARD ------------------------- */}
        <FloatingLayer
          ctx={ctx}
          depth={0.055}
          x="-2%"
          y="4%"
          rotate={-2}
          floatY={5}
          duration={11}
          delay={0.3}
          z={35}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current.slug + "-card"}
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard project={current} />
            </motion.div>
          </AnimatePresence>
        </FloatingLayer>
      </div>

      {/* -------------------- CAPTION + DOTS -------------------- */}
      <div
        dir="rtl"
        className="mt-6 flex items-baseline justify-between gap-4 px-1"
      >
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.h3
              key={current.slug + "-title"}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="truncate text-sm font-medium tracking-tight text-foreground md:text-base"
            >
              {current.name}
            </motion.h3>
          </AnimatePresence>
          <div className="text-xs text-muted-foreground">{current.category}</div>
        </div>
        <Link
          to="/work/$slug"
          params={{ slug: current.slug }}
          className="inline-flex items-center gap-1 text-xs font-medium text-foreground/70 underline-offset-4 hover:text-primary hover:underline"
        >
          دراسة الحالة
          <ArrowUpRight className="size-3.5" aria-hidden />
        </Link>
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5">
        {FEATURED.map((p, i) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`عرض المشروع ${i + 1}`}
            className={cn(
              "h-1 rounded-full transition-[width,background-color] duration-500",
              i === active
                ? "w-5 bg-foreground/70"
                : "w-1 bg-muted-foreground/30 hover:bg-muted-foreground/60",
            )}
          />
        ))}
      </div>

      <div className="sr-only" aria-live="polite">
        {current.name}
      </div>
    </div>
  );
}
