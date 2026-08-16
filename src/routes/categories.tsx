import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { categories } from "@/lib/catalog-data";
import { categoryIcons } from "@/lib/category-icons";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — ECU Tools, Diagnostics, Licenses & Cables | Diagnostiq" },
      {
        name: "description",
        content:
          "Browse ECU and TCU programming tools, diagnostic equipment, control units, key programming, cables, adapters, licenses and warranty plans.",
      },
      { property: "og:title", content: "Equipment Categories | Diagnostiq" },
      {
        property: "og:description",
        content: "ECU/TCU programming, diagnostics, control units, cables and licenses.",
      },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Catalogue"
        title="Equipment categories"
        description="Structured by the work you do — programming, diagnostics, control units, key work, connectivity and software licensing."
      />
      <section className="py-16">
        <div className="container-page grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.icon];
            return (
              <article
                key={cat.slug}
                className="group flex flex-col rounded-md border border-border bg-surface p-6 transition-colors hover:border-border-strong"
              >
                <span className="flex size-10 items-center justify-center rounded-sm border border-border bg-elevated">
                  <Icon className="size-5 text-primary" />
                </span>
                <h2 className="mt-5 text-lg font-semibold">{cat.name}</h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{cat.description}</p>
                <p className="spec-value mt-5 text-xs text-muted-foreground">
                  {cat.count} products
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
