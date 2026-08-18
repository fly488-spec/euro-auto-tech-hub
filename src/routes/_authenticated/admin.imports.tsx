import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { AdminCard, AdminPageHeader, QueryState } from "@/components/admin/admin-shell";
import { listAdminImports } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/imports")({
  component: AdminImports,
});

function AdminImports() {
  const fetchImports = useServerFn(listAdminImports);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "imports"],
    queryFn: () => fetchImports(),
  });

  const jobs = (data?.jobs as any[]) ?? [];
  const staged = (data?.staged as any[]) ?? [];
  const errors = (data?.errors as any[]) ?? [];
  const suppliers = (data?.suppliers as any[]) ?? [];

  return (
    <>
      <AdminPageHeader
        eyebrow="Operations"
        title="Imports"
        description="IMPORT → REVIEW → APPROVE → PUBLISH. Nothing imported becomes public without your approval. File parsing arrives in Phase 9."
      />
      <QueryState isLoading={isLoading} error={error} />

      {data && (
        <div className="grid gap-6 lg:grid-cols-2">
          <AdminCard>
            <h2 className="font-display text-lg font-semibold">Suppliers</h2>
            <ul className="mt-4 divide-y divide-border text-sm">
              {suppliers.map((supplier) => (
                <li key={supplier.id} className="flex items-center justify-between py-3">
                  <span>{supplier.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {supplier.import_mode} · {supplier.requires_approval ? "manual approval" : "auto"}
                  </span>
                </li>
              ))}
              {suppliers.length === 0 && (
                <li className="py-3 text-muted-foreground">No suppliers configured.</li>
              )}
            </ul>
          </AdminCard>

          <AdminCard>
            <h2 className="font-display text-lg font-semibold">Import jobs</h2>
            <ul className="mt-4 divide-y divide-border text-sm">
              {jobs.map((job) => (
                <li key={job.id} className="flex items-center justify-between py-3">
                  <span>{job.file_name ?? job.source_type}</span>
                  <span className="text-xs text-muted-foreground">
                    {job.status} · {job.valid_rows}/{job.total_rows} valid
                  </span>
                </li>
              ))}
              {jobs.length === 0 && <li className="py-3 text-muted-foreground">No import jobs yet.</li>}
            </ul>
          </AdminCard>

          <AdminCard>
            <h2 className="font-display text-lg font-semibold">Pending approval</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {staged.length === 0
                ? "Nothing waiting for review."
                : `${staged.length} staged change(s) awaiting your decision.`}
            </p>
          </AdminCard>

          <AdminCard>
            <h2 className="font-display text-lg font-semibold">Import errors</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {errors.length === 0 ? "No unresolved errors." : `${errors.length} unresolved error(s).`}
            </p>
          </AdminCard>
        </div>
      )}
    </>
  );
}
