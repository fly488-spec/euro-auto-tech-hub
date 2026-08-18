import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { AdminCard, AdminPageHeader, QueryState } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteProduct, listAdminProducts, saveProduct } from "@/lib/admin.functions";
import type { ProductInput } from "@/lib/admin.server";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: AdminProducts,
});

const emptyProduct: ProductInput = {
  slug: "",
  name: "",
  short_description: "",
  description: "",
  brand_id: null,
  category_id: null,
  sku: "",
  mpn: "",
  product_type: "hardware",
  status: "draft",
  cost_price_minor: 0,
  price_minor: 0,
  currency_code: "EUR",
  stock: 0,
  warranty_months: 12,
  requires_serial: false,
  requires_license: false,
  digital_delivery: false,
  is_master: false,
  is_slave: false,
  supports_obd: false,
  supports_bench: false,
  supports_boot: false,
  primary_image_url: "",
};

const productTypes = ["hardware", "license", "software", "cable", "accessory", "control_unit"] as const;
const statuses = ["draft", "pending", "published", "archived"] as const;

function money(minor: number, currency: string) {
  return new Intl.NumberFormat("en-IE", { style: "currency", currency }).format(minor / 100);
}

function AdminProducts() {
  const queryClient = useQueryClient();
  const fetchProducts = useServerFn(listAdminProducts);
  const save = useServerFn(saveProduct);
  const remove = useServerFn(deleteProduct);
  const [form, setForm] = useState<ProductInput | null>(null);
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: () => fetchProducts(),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
  const saveMutation = useMutation({
    mutationFn: (input: ProductInput) => save({ data: input }),
    onSuccess: () => {
      setForm(null);
      invalidate();
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: invalidate,
  });

  const products = ((data?.products as any[]) ?? []).filter((p) =>
    `${p.name} ${p.sku} ${p.mpn ?? ""}`.toLowerCase().includes(search.toLowerCase()),
  );
  const brands = (data?.brands as any[]) ?? [];
  const categories = (data?.categories as any[]) ?? [];

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalogue"
        title="Products"
        description="Create, edit and publish catalogue items. Nothing is public until status is set to published."
        action={
          <Button onClick={() => setForm(form ? null : emptyProduct)}>
            {form ? "Close editor" : "New product"}
          </Button>
        }
      />

      {form && (
        <div className="mb-8">
          <AdminCard>
            <h2 className="font-display text-lg font-semibold">
              {form.id ? "Edit product" : "New product"}
            </h2>
            <form
              className="mt-5 grid gap-4 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                saveMutation.mutate(form);
              }}
            >
              <Text label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <Text label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} required />
              <Text label="SKU" value={form.sku} onChange={(v) => setForm({ ...form, sku: v })} required />
              <Text label="MPN" value={form.mpn ?? ""} onChange={(v) => setForm({ ...form, mpn: v })} />

              <div className="space-y-2">
                <Label>Brand</Label>
                <Select
                  value={form.brand_id ?? ""}
                  onChange={(v) => setForm({ ...form, brand_id: v || null })}
                  options={[{ value: "", label: "None" }, ...brands.map((b) => ({ value: b.id, label: b.name }))]}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={form.category_id ?? ""}
                  onChange={(v) => setForm({ ...form, category_id: v || null })}
                  options={[
                    { value: "", label: "None" },
                    ...categories.map((c) => ({ value: c.id, label: c.name })),
                  ]}
                />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={form.product_type}
                  onChange={(v) => setForm({ ...form, product_type: v as ProductInput["product_type"] })}
                  options={productTypes.map((t) => ({ value: t, label: t.replace("_", " ") }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onChange={(v) => setForm({ ...form, status: v as ProductInput["status"] })}
                  options={statuses.map((s) => ({ value: s, label: s }))}
                />
              </div>

              <Number
                label="Cost price (minor units)"
                value={form.cost_price_minor}
                onChange={(v) => setForm({ ...form, cost_price_minor: v })}
              />
              <Number
                label="Selling price (minor units)"
                value={form.price_minor}
                onChange={(v) => setForm({ ...form, price_minor: v })}
              />
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  value={form.currency_code}
                  onChange={(v) => setForm({ ...form, currency_code: v })}
                  options={["EUR", "USD", "RUB"].map((c) => ({ value: c, label: c }))}
                />
              </div>
              <Number label="Stock" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} />
              <Number
                label="Warranty (months)"
                value={form.warranty_months}
                onChange={(v) => setForm({ ...form, warranty_months: v })}
              />
              <Text
                label="Primary image URL"
                value={form.primary_image_url ?? ""}
                onChange={(v) => setForm({ ...form, primary_image_url: v })}
              />
              <Text
                label="Short description"
                full
                value={form.short_description ?? ""}
                onChange={(v) => setForm({ ...form, short_description: v })}
              />
              <div className="space-y-2 sm:col-span-2">
                <Label>Description</Label>
                <textarea
                  className="min-h-28 w-full rounded-sm border border-input bg-background p-3 text-sm"
                  value={form.description ?? ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <fieldset className="sm:col-span-2 grid gap-3 rounded-sm border border-border p-4 sm:grid-cols-3">
                <legend className="eyebrow px-2">Technical capabilities</legend>
                {(
                  [
                    ["requires_serial", "Requires serial"],
                    ["requires_license", "Requires license"],
                    ["digital_delivery", "Digital delivery"],
                    ["is_master", "Master"],
                    ["is_slave", "Slave"],
                    ["supports_obd", "OBD"],
                    ["supports_bench", "BENCH"],
                    ["supports_boot", "BOOT"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[hsl(var(--primary))]"
                      checked={Boolean(form[key])}
                      onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                    />
                    {label}
                  </label>
                ))}
              </fieldset>

              <div className="sm:col-span-2 flex gap-3">
                <Button type="submit" disabled={saveMutation.isPending}>
                  {form.id ? "Save changes" : "Create product"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setForm(null)}>
                  Cancel
                </Button>
              </div>
              {saveMutation.error && (
                <p className="sm:col-span-2 text-sm text-destructive">
                  {(saveMutation.error as Error).message}
                </p>
              )}
            </form>
          </AdminCard>
        </div>
      )}

      <div className="mb-4 max-w-sm">
        <Input
          placeholder="Search by name, SKU or MPN"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <QueryState isLoading={isLoading} error={error} />
      {data && (
        <div className="overflow-x-auto rounded-md border border-border bg-surface">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{product.sku}</td>
                  <td className="px-4 py-3 text-muted-foreground">{product.product_type}</td>
                  <td className="px-4 py-3 tabular-nums">
                    {money(product.price_minor, product.currency_code)}
                  </td>
                  <td className="px-4 py-3 tabular-nums">{product.stock}</td>
                  <td className="px-4 py-3">{product.status}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setForm({ ...emptyProduct, ...product })}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(product.id)}
                      >
                        Delete
                      </Button>
                    </div>
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

function Text({
  label,
  value,
  onChange,
  required,
  full,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  full?: boolean;
}) {
  return (
    <div className={`space-y-2 ${full ? "sm:col-span-2" : ""}`}>
      <Label>{label}</Label>
      <Input required={required} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Number({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type="number" value={value} onChange={(e) => onChange(globalThis.Number(e.target.value))} />
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <select
      className="h-10 w-full rounded-sm border border-input bg-background px-3 text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
