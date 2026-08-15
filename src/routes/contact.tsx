import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin } from "lucide-react";

import { PageHeader, PageShell } from "@/components/layout/page-shell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Sales & Technical Support | Diagnostiq" },
      {
        name: "description",
        content:
          "Contact Diagnostiq for equipment sales, license questions, compatibility checks, warranty and B2B account requests.",
      },
      { property: "og:title", content: "Contact Diagnostiq" },
      {
        property: "og:description",
        content: "Sales, technical support and B2B enquiries for diagnostic equipment.",
      },
    ],
  }),
  component: ContactPage,
});

const details = [
  { icon: Mail, label: "Email", value: "sales@diagnostiq.eu" },
  { icon: Clock, label: "Support hours", value: "Mon–Fri, 09:00–18:00 CET" },
  { icon: MapPin, label: "Shipping", value: "European Union & United Kingdom" },
];

function ContactPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Get in touch"
        title="Sales & technical support"
        description="Compatibility questions, license activation, warranty claims or B2B account requests — reach the team directly."
      />
      <section className="py-16">
        <div className="container-page grid gap-4 sm:grid-cols-3">
          {details.map((d) => (
            <div key={d.label} className="rounded-md border border-border bg-surface p-6">
              <d.icon className="size-5 text-primary" />
              <p className="eyebrow mt-4">{d.label}</p>
              <p className="mt-2 text-sm text-foreground">{d.value}</p>
            </div>
          ))}
        </div>
        <div className="container-page mt-10">
          <div className="rounded-md border border-border bg-elevated p-6 text-sm text-muted-foreground">
            A contact form, B2B application and support workflow are added in a later phase, once
            customer accounts are in place.
          </div>
        </div>
      </section>
    </PageShell>
  );
}
