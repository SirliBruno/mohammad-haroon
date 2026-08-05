import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/features/testimonials/schema";

export function TestimonialQuote({
  testimonial,
  className,
}: {
  testimonial: Testimonial;
  className?: string;
}) {
  return (
    <figure className={cn("rounded-xl border border-border/60 bg-card p-8", className)}>
      <Quote className="size-5 text-muted-foreground/60" aria-hidden />
      <blockquote className="mt-4 text-lg leading-relaxed text-foreground text-balance">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        {testimonial.avatar ? (
          <img
            src={testimonial.avatar}
            alt=""
            loading="lazy"
            decoding="async"
            className="size-9 rounded-full border border-border/60 object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="grid size-9 place-items-center rounded-full bg-muted text-xs font-medium text-muted-foreground"
          >
            {testimonial.author.slice(0, 1)}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{testimonial.author}</p>
          <p className="truncate text-xs text-muted-foreground">
            {testimonial.role}
            {testimonial.company ? ` · ${testimonial.company}` : ""}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
