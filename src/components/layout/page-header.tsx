import { Container } from "./container";
import { Eyebrow } from "@/components/typography/eyebrow";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="border-b border-border/60 pt-28 pb-16 md:pt-36 md:pb-20">
      <Container>
        <div className="max-w-3xl">
          {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground md:text-xl">{description}</p>
          ) : null}
        </div>
      </Container>
    </header>
  );
}
