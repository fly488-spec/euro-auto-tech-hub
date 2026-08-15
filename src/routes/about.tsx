import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, PageShell } from "@/components/layout/page-shell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Company — European Automotive Diagnostic Supplier | Diagnostiq" },
      {
        name: "description",
        content:
          "Diagnostiq supplies automotive diagnostic equipment, ECU/TCU programming tools and licenses to professional workshops and tuners across Europe.",
      },
      { property: "og:title", content: "About Diagnostiq" },
      {
        property: "og:description",
        content: "A European supplier of professional automotive electronics equipment.",
      },
    ],
  }),
  component: AboutPage,
});

const values = [
  {
    title: "Authorised supply only",
    body: "Equipment and licenses come from manufacturer-authorised channels, so software updates and warranty remain valid.",
  },
  {
    title: "Data you can trust",
    body: "Compatibility, hardware and software numbers are maintained as structured data — never copied marketing text.",
  },
  {
    title: "Support in your language",
    body: "The platform is being rolled out across European languages plus Russian and Turkish.",
  },
];

function AboutPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Company"
        title="Professional equipment, operated professionally"
        description="We supply diagnostic and programming equipment to workshops, tuners and electronics specialists across Europe."
      />
      <section className="py-16">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-5 text-muted-foreground">
            <p>
              Diagnostiq is a European trading platform for automotive diagnostic equipment,
              ECU and TCU programming tools, tuning hardware, control units, licenses, software,
              cables and accessories.
            </p>
            <p>
              Our catalogue is built on structured technical data: SKU, manufacturer part number,
              hardware and software numbers, supported protocols and the operating modes each tool
              covers — OBD, BENCH and BOOT, in master or slave configuration.
            </p>
            <p>
              Orders are invoiced with full VAT documentation. Devices, serial numbers, licenses and
              warranty status stay visible in your customer account for the life of the equipment.
            </p>
          </div>
          <div className="grid gap-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-md border border-border bg-surface p-6">
                <h2 className="text-base font-semibold">{v.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
