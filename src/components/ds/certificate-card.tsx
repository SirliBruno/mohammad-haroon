import { Award } from "lucide-react";
import { DSCard } from "./card";
import { cn } from "@/lib/utils";

export type Certificate = {
  title: string;
  issuer: string;
  issuedAt: string; // ISO or human
  credentialUrl?: string;
  logoUrl?: string;
};

export function CertificateCard({
  certificate,
  className,
}: {
  certificate: Certificate;
  className?: string;
}) {
  const Wrapper = certificate.credentialUrl ? "a" : "div";
  const wrapperProps = certificate.credentialUrl
    ? { href: certificate.credentialUrl, target: "_blank", rel: "noreferrer" }
    : {};

  return (
    <DSCard variant="surface" interactive={!!certificate.credentialUrl} padding="md" className={className}>
      <Wrapper {...wrapperProps} className="flex items-start gap-4">
        <div className="grid size-10 shrink-0 place-items-center rounded-md border border-border/60 bg-background">
          {certificate.logoUrl ? (
            <img src={certificate.logoUrl} alt="" className="size-6 object-contain" />
          ) : (
            <Award className="size-4 text-muted-foreground" aria-hidden />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{certificate.title}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {certificate.issuer} · {certificate.issuedAt}
          </p>
        </div>
      </Wrapper>
    </DSCard>
  );
}
