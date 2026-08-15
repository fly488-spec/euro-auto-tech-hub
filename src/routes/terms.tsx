import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, PageShell } from "@/components/layout/page-shell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | Diagnostiq" },
      {
        name: "description",
        content:
          "Terms and conditions of sale for automotive diagnostic equipment, programming tools, licenses and accessories.",
      },
      { property: "og:title", content: "Terms & Conditions | Diagnostiq" },
      {
        property: "og:description",
        content: "Conditions of sale, payment, delivery, warranty and returns.",
      },
    ],
  }),
  component: TermsPage,
});

const sections = [
  {
    title: "Payment",
    body: "Orders can be paid by credit or debit card, or by bank transfer. Bank transfer orders remain pending until payment is confirmed by our team; goods, licenses and digital deliveries are released only after confirmation.",
  },
  {
    title: "Prices and VAT",
    body: "Prices are shown in EUR, USD or RUB. VAT is applied according to the applicable rate and shown separately on the invoice. Business customers may store a VAT number in their account.",
  },
  {
    title: "Warranty",
    body: "Hardware is supplied with the manufacturer's standard warranty, registered to the device serial number and visible in your customer account.",
  },
  {
    title: "Licenses and digital goods",
    body: "Licenses are issued against a device serial number or hardware ID. Activated licenses and delivered digital goods are non-returnable.",
  },
];

function TermsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Legal"
        title="Terms & conditions"
        description="Summary conditions of sale. Full legal text is published before the store goes live."
      />
      <section className="py-16">
        <div className="container-page max-w-3xl space-y-8">
          {sections.map((s) => (
            <article key={s.title}>
              <h2 className="text-lg font-semibold">{s.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
