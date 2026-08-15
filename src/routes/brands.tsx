import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { brands } from "@/lib/catalog-data";

export const Route = createFileRoute("/brands")({
  head: () => ({
    meta: [
      { title: "Brands — Authorised Diagnostic & Tuning Manufacturers | Diagnostiq" },
      {
        name: "description",
        content:
          "FLEX/Magicmotorsport, AutoTuner, Alientech, SMOK, CarProTool, Thinkcar and OBDSTAR equipment supplied through authorised European channels.",
      },
      { property: "og:title", content: "Authorised Diagnostic & Tuning Brands | Diagnostiq" },
      {
        name: "og:description",
        content: "Professional ECU and TCU tooling from leading European manufacturers.",
      },
    ],
  }),
  component: BrandsPage,
});

function BrandsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Manufacturers"
        title="Authorised brands"
        description="Every brand below is supplied through authorised distribution, with genuine licenses, valid warranty and manufacturer software updates."
      />
      <section className="py-16">
        <div className="container-page grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <article
              key={brand.slug}
              className="flex flex-col rounded-md border border-border bg-surface p-6 transition-colors hover:border-border-strong"
            >
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-display text-lg font-semibold">{brand.name}</h2>
                <span className="eyebrow whitespace-nowrap">{brand.origin}</span>
              </div>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{brand.tagline}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {brand.focus.map((f) => (
                  <Badge key={f} variant="secondary" className="spec-value text-[0.7rem]">
                    {f}
                  </Badge>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
