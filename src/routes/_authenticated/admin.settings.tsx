import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { AdminCard, AdminPageHeader, QueryState } from "@/components/admin/admin-shell";
import { listAdminSettings } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const fetchSettings = useServerFn(listAdminSettings);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => fetchSettings(),
  });

  const settings = (data?.settings as any[]) ?? [];
  const currencies = (data?.currencies as any[]) ?? [];
  const fxRates = (data?.fxRates as any[]) ?? [];
  const taxSettings = (data?.taxSettings as any[]) ?? [];

  return (
    <>
      <AdminPageHeader
        eyebrow="Configuration"
        title="Settings"
        description="Store configuration, currencies, exchange rates and VAT defaults."
      />
      <QueryState isLoading={isLoading} error={error} />

      {data && (
        <div className="grid gap-6 lg:grid-cols-2">
          <AdminCard>
            <h2 className="font-display text-lg font-semibold">Currencies</h2>
            <ul className="mt-4 divide-y divide-border text-sm">
              {currencies.map((currency) => (
                <li key={currency.code} className="flex items-center justify-between py-3">
                  <span>
                    {currency.code} · {currency.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {currency.is_base ? "base" : currency.is_active ? "active" : "inactive"}
                  </span>
                </li>
              ))}
            </ul>
          </AdminCard>

          <AdminCard>
            <h2 className="font-display text-lg font-semibold">Exchange rates</h2>
            <ul className="mt-4 divide-y divide-border text-sm">
              {fxRates.map((rate) => (
                <li key={rate.id} className="flex items-center justify-between py-3">
                  <span>
                    {rate.base_code} → {rate.quote_code}
                  </span>
                  <span className="tabular-nums text-muted-foreground">{rate.rate}</span>
                </li>
              ))}
              {fxRates.length === 0 && (
                <li className="py-3 text-muted-foreground">No rates recorded yet.</li>
              )}
            </ul>
          </AdminCard>

          <AdminCard>
            <h2 className="font-display text-lg font-semibold">VAT</h2>
            <ul className="mt-4 divide-y divide-border text-sm">
              {taxSettings.map((tax) => (
                <li key={tax.id} className="flex items-center justify-between py-3">
                  <span>{tax.country_code ?? "Default"}</span>
                  <span className="text-muted-foreground">
                    {tax.standard_rate}% · {tax.prices_include_vat ? "incl." : "excl."}
                  </span>
                </li>
              ))}
              {taxSettings.length === 0 && (
                <li className="py-3 text-muted-foreground">No VAT configuration yet.</li>
              )}
            </ul>
          </AdminCard>

          <AdminCard>
            <h2 className="font-display text-lg font-semibold">Store settings</h2>
            <ul className="mt-4 divide-y divide-border text-sm">
              {settings.map((setting) => (
                <li key={setting.key} className="flex items-center justify-between gap-4 py-3">
                  <span className="font-medium">{setting.key}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {JSON.stringify(setting.value)}
                  </span>
                </li>
              ))}
              {settings.length === 0 && (
                <li className="py-3 text-muted-foreground">No settings stored yet.</li>
              )}
            </ul>
          </AdminCard>
        </div>
      )}
    </>
  );
}
