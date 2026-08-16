import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CircuitBoard, Cpu, KeyRound, ShieldCheck } from "lucide-react";

import heroImage from "@/assets/hero-diagnostics.jpg";
import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { brands, capabilities, categories } from "@/lib/catalog-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Diagnostiq — ECU & TCU Programming Tools, Diagnostics, Licenses" },
      {
        name: "description",
        content:
          "European supplier of automotive diagnostic equipment, ECU/TCU programming tools, tuning hardware, control units, licenses, cables and accessories.",
      },
      { property: "og:title", content: "Diagnostiq — Automotive Diagnostic & Programming Equipment" },
      {
        property: "og:description",
        content:
          "ECU and TCU programming tools, diagnostics, control units and licenses from authorised European channels.",
      },
    ],
  }),
  component: HomePage,
});

const capabilityIcons = [Cpu, KeyRound, ShieldCheck, CircuitBoard];

const stats = [
  { value: "7", label: "Authorised brands" },
  { value: "580+", label: "Catalogue items" },
  { value: "26", label: "Languages planned" },
  { value: "24 mo", label: "Standard warranty" },
];

function HomePage() {
  return (
    <PageShell>
      <section className="relative overflow-hidden border-b border-border bg-hero">
        <div className="absolute inset-0 bg-blueprint opacity-70" aria-hidden />
        <div className="container-page relative grid items-center gap-12 py-20 lg:grid-cols-[1.05fr_1fr] lg:py-28">
          <div>
            <p className="eyebrow">Professional automotive electronics</p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] sm:text-5xl xl:text-6xl">
              Programming tools engineered for the{" "}
              <span className="text-gradient-signal">European workshop</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              ECU and TCU programming equipment, diagnostic hardware, control units, licenses and
              cables — supplied through authorised channels with verified compatibility data and
              serial-bound license management.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link to="/categories">
                  Browse equipment <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/brands">View brands</Link>
              </Button>
            </div>

            <dl className="mt-12 grid max-w-xl grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="spec-value text-2xl font-semibold text-foreground">{s.value}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-lg border border-border-strong shadow-panel">
              <img
                src={heroImage}
                alt="Professional ECU programming interface, bench cable harness and engine control unit board"
                width={1600}
                height={1104}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-5 right-5 rounded-md border border-border-strong bg-surface/95 p-4 shadow-signal backdrop-blur sm:left-8 sm:right-auto sm:w-72">
              <p className="eyebrow">Supported modes</p>
              <p className="spec-value mt-2 text-sm text-foreground">OBD · BENCH · BOOT</p>
              <p className="mt-1 text-xs text-muted-foreground">Master and slave configurations</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Catalogue</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Equipment categories</h2>
            </div>
            <Link
              to="/categories"
              className="text-sm font-medium text-primary transition-opacity hover:opacity-80"
            >
              All categories →
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.slice(0, 8).map((cat) => (
              <article
                key={cat.slug}
                className="group rounded-md border border-border bg-surface p-6 transition-colors hover:border-border-strong"
              >
                <CircuitBoard className="size-5 text-primary" />
                <h3 className="mt-4 text-base font-semibold">{cat.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{cat.description}</p>
                <p className="spec-value mt-4 text-xs text-muted-foreground">
                  {cat.count} products
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">Why Diagnostiq</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              Built around how workshops actually operate
            </h2>
            <p className="mt-4 text-muted-foreground">
              Devices, licenses and warranty live in one account. No spreadsheets, no chasing serial
              numbers by email.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {capabilities.map((item, i) => {
              const Icon = capabilityIcons[i % capabilityIcons.length]!;
              return (
              <div key={item.title} className="rounded-md border border-border bg-elevated p-6">
                <Icon className="size-5 text-primary" />
                <h3 className="mt-4 text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-page">
          <p className="eyebrow">Authorised brands</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Manufacturers we supply</h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {brands.map((brand) => (
              <div key={brand.slug} className="bg-surface p-6">
                <p className="font-display text-base font-semibold">{brand.name}</p>
                <p className="eyebrow mt-1">{brand.origin}</p>
                <p className="mt-3 text-sm text-muted-foreground">{brand.tagline}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
