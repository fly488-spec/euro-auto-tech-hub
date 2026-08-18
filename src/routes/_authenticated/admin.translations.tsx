import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { AdminPageHeader, QueryState } from "@/components/admin/admin-shell";
import { listAdminTranslations } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/translations")({
  component: AdminTranslations,
});

function AdminTranslations() {
  const fetchTranslations = useServerFn(listAdminTranslations);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "translations"],
    queryFn: () => fetchTranslations(),
  });

  const languages = (data?.languages as any[]) ?? [];
  const productCounts = new Map<string, number>();
  const uiCounts = new Map<string, number>();
  for (const row of data?.productTranslations ?? [])
    productCounts.set(row.language_code, (productCounts.get(row.language_code) ?? 0) + 1);
  for (const row of data?.uiTranslations ?? [])
    uiCounts.set(row.language_code, (uiCounts.get(row.language_code) ?? 0) + 1);

  return (
    <>
      <AdminPageHeader
        eyebrow="Localisation"
        title="Languages & translations"
        description="One product record, many translations. Adding a language is a row, never a schema change."
      />
      <QueryState isLoading={isLoading} error={error} />

      {data && (
        <div className="overflow-x-auto rounded-md border border-border bg-surface">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Language</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Native name</th>
                <th className="px-4 py-3">Product strings</th>
                <th className="px-4 py-3">UI strings</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {languages.map((language) => (
                <tr key={language.code}>
                  <td className="px-4 py-3 font-medium">{language.name}</td>
                  <td className="px-4 py-3 text-muted-foreground uppercase">{language.code}</td>
                  <td className="px-4 py-3 text-muted-foreground">{language.native_name}</td>
                  <td className="px-4 py-3 tabular-nums">{productCounts.get(language.code) ?? 0}</td>
                  <td className="px-4 py-3 tabular-nums">{uiCounts.get(language.code) ?? 0}</td>
                  <td className="px-4 py-3">
                    {language.is_default ? "Default" : language.is_active ? "Active" : "Inactive"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
