import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { storefrontCatalogQuery } from "@/lib/catalog-queries";

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
        property: "og:description",
        content: "Professional ECU and TCU tooling from leading European manufacturers.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(storefrontCatalogQuery),
  errorComponent: () => (
    <PageShell>
      <PageHeader
        eyebrow="Manufacturers"
        title="Authorised brands"
        description="Brand data is temporarily unavailable. Please try again shortly."
      />
    </PageShell>
  ),
  notFoundComponent: () => (
    <PageShell>
      <PageHeader eyebrow="Manufacturers" title="Not found" description="This page does not exist." />
    </PageShell>
  ),
  component: BrandsPage,
});

function BrandsPage() {
  const { data } = useSuspenseQuery(storefrontCatalogQuery);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Manufacturers"
        title="Authorised brands"
        description="Every brand below is supplied through authorised distribution, with genuine licenses, valid warranty and manufacturer software updates."
      />
      <section className="py-16">
        <div className="container-page grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.brands.map((brand) => {
            const productCount = data.products.filter((p) => p.brand_id === brand.id).length;
            return (
              <article
                key={brand.slug}
                className="flex flex-col rounded-md border border-border bg-surface p-6 transition-colors hover:border-border-strong"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-display text-lg font-semibold">{brand.name}</h2>
                  {brand.origin && <span className="eyebrow whitespace-nowrap">{brand.origin}</span>}
                </div>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{brand.tagline}</p>
                <div className="mt-5">
                  <Badge variant="secondary" className="spec-value text-[0.7rem]">
                    {productCount} products
                  </Badge>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
