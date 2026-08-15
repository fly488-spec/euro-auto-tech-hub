import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, PageShell } from "@/components/layout/page-shell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Diagnostiq" },
      {
        name: "description",
        content:
          "How Diagnostiq collects, stores and processes customer, order, device and license data under European data protection rules.",
      },
      { property: "og:title", content: "Privacy Policy | Diagnostiq" },
      {
        property: "og:description",
        content: "Customer, order and device data handling at Diagnostiq.",
      },
    ],
  }),
  component: PrivacyPage,
});

const sections = [
  {
    title: "What we store",
    body: "Account details, billing and shipping addresses, VAT number where provided, orders, invoices, registered device serial numbers, licenses and warranty records.",
  },
  {
    title: "Why we store it",
    body: "To process orders, issue invoices, deliver licenses, honour warranty obligations and meet accounting requirements.",
  },
  {
    title: "Payment data",
    body: "Card details are handled by our payment processor and never stored on our systems. Bank transfer orders record only the payment reference.",
  },
  {
    title: "Your rights",
    body: "You may request access to, correction of, or deletion of your personal data, subject to statutory retention periods for invoices.",
  },
];

function PrivacyPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Legal"
        title="Privacy policy"
        description="Summary of data handling. Full legal text is published before the store goes live."
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
