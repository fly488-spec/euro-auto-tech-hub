import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { AdminCard, AdminPageHeader, QueryState } from "@/components/admin/admin-shell";
import { listAdminCustomers } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/customers")({
  component: AdminCustomers,
});

function AdminCustomers() {
  const fetchCustomers = useServerFn(listAdminCustomers);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "customers"],
    queryFn: () => fetchCustomers(),
  });

  const profiles = (data?.profiles as any[]) ?? [];
  const roles = (data?.roles as any[]) ?? [];
  const companies = (data?.companies as any[]) ?? [];

  return (
    <>
      <AdminPageHeader
        eyebrow="Customers"
        title="Accounts & companies"
        description="Registered customers, their roles and B2B company records."
      />
      <QueryState isLoading={isLoading} error={error} />

      {data && (
        <div className="space-y-8">
          <div className="overflow-x-auto rounded-md border border-border bg-surface">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Roles</th>
                  <th className="px-4 py-3">Language</th>
                  <th className="px-4 py-3">Currency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {profiles.map((profile) => (
                  <tr key={profile.id}>
                    <td className="px-4 py-3 font-medium">{profile.full_name || "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{profile.email}</td>
                    <td className="px-4 py-3">
                      {roles
                        .filter((r) => r.user_id === profile.id)
                        .map((r) => r.role)
                        .join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3 uppercase text-muted-foreground">
                      {profile.preferred_language}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{profile.preferred_currency}</td>
                  </tr>
                ))}
                {profiles.length === 0 && (
                  <tr>
                    <td className="px-4 py-6 text-muted-foreground" colSpan={5}>
                      No customer accounts yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <AdminCard>
            <h2 className="font-display text-lg font-semibold">B2B companies</h2>
            {companies.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No company records yet.</p>
            ) : (
              <ul className="mt-4 divide-y divide-border text-sm">
                {companies.map((company) => (
                  <li key={company.id} className="flex items-center justify-between py-3">
                    <span>
                      {company.name}
                      <span className="ml-2 text-xs text-muted-foreground">
                        {company.vat_number ?? "no VAT number"}
                      </span>
                    </span>
                    <span className="text-muted-foreground">
                      {company.is_approved ? "Approved" : "Pending"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </AdminCard>
        </div>
      )}
    </>
  );
}
