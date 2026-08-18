import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { AdminCard, AdminPageHeader, QueryState } from "@/components/admin/admin-shell";
import { getAdminDashboard } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const fetchDashboard = useServerFn(getAdminDashboard);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => fetchDashboard(),
  });

  const stats = [
    { label: "Products", value: data?.totalProducts ?? 0 },
    { label: "Published", value: data?.publishedProducts ?? 0 },
    { label: "Draft", value: data?.draftProducts ?? 0 },
    { label: "Awaiting approval", value: data?.pendingProducts ?? 0 },
    { label: "Low stock", value: data?.lowStock ?? 0 },
    { label: "Bank transfers to confirm", value: data?.pendingBankTransfers ?? 0 },
    { label: "Import errors", value: data?.importErrors ?? 0 },
  ];

  return (
    <>
      <AdminPageHeader
        eyebrow="Overview"
        title="Catalogue dashboard"
        description="Everything that currently needs your attention across the catalogue and operations."
      />
      <QueryState isLoading={isLoading} error={error} />

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-md border border-border bg-surface p-5">
                <p className="eyebrow">{stat.label}</p>
                <p className="mt-3 font-display text-3xl font-semibold tabular-nums">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <AdminCard>
              <h2 className="font-display text-lg font-semibold">Low stock products</h2>
              {data.lowStockItems.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">No products below the threshold.</p>
              ) : (
                <ul className="mt-4 divide-y divide-border text-sm">
                  {data.lowStockItems.map((item) => (
                    <li key={item.id} className="flex items-center justify-between py-3">
                      <span>
                        {item.name}
                        <span className="ml-2 text-xs text-muted-foreground">{item.sku}</span>
                      </span>
                      <span className="tabular-nums text-muted-foreground">{item.stock} in stock</span>
                    </li>
                  ))}
                </ul>
              )}
            </AdminCard>
          </div>
        </>
      )}
    </>
  );
}
