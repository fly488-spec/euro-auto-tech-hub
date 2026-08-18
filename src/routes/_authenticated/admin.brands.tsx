import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { AdminCard, AdminPageHeader, QueryState } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteBrand, listAdminBrands, saveBrand } from "@/lib/admin.functions";
import type { BrandInput } from "@/lib/admin.server";

export const Route = createFileRoute("/_authenticated/admin/brands")({
  component: AdminBrands,
});

const emptyBrand: BrandInput = {
  slug: "",
  name: "",
  origin: "",
  tagline: "",
  website_url: "",
  is_active: true,
  sort_order: 0,
};

function AdminBrands() {
  const queryClient = useQueryClient();
  const fetchBrands = useServerFn(listAdminBrands);
  const save = useServerFn(saveBrand);
  const remove = useServerFn(deleteBrand);
  const [form, setForm] = useState<BrandInput>(emptyBrand);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "brands"],
    queryFn: () => fetchBrands(),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "brands"] });

  const saveMutation = useMutation({
    mutationFn: (input: BrandInput) => save({ data: input }),
    onSuccess: () => {
      setForm(emptyBrand);
      invalidate();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: invalidate,
  });

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalogue"
        title="Brands"
        description="Manufacturers and authorised suppliers shown across the storefront."
      />

      <AdminCard>
        <h2 className="font-display text-lg font-semibold">
          {form.id ? "Edit brand" : "Add brand"}
        </h2>
        <form
          className="mt-5 grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate(form);
          }}
        >
          <Field label="Name">
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
          <Field label="Slug">
            <Input
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </Field>
          <Field label="Origin">
            <Input
              value={form.origin ?? ""}
              onChange={(e) => setForm({ ...form, origin: e.target.value })}
            />
          </Field>
          <Field label="Website">
            <Input
              value={form.website_url ?? ""}
              onChange={(e) => setForm({ ...form, website_url: e.target.value })}
            />
          </Field>
          <Field label="Tagline" full>
            <Input
              value={form.tagline ?? ""}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            />
          </Field>
          <Field label="Sort order">
            <Input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            />
          </Field>
          <Field label="Active">
            <select
              className="h-10 w-full rounded-sm border border-input bg-background px-3 text-sm"
              value={form.is_active ? "yes" : "no"}
              onChange={(e) => setForm({ ...form, is_active: e.target.value === "yes" })}
            >
              <option value="yes">Visible</option>
              <option value="no">Hidden</option>
            </select>
          </Field>
          <div className="sm:col-span-2 flex gap-3">
            <Button type="submit" disabled={saveMutation.isPending}>
              {form.id ? "Save changes" : "Add brand"}
            </Button>
            {form.id && (
              <Button type="button" variant="outline" onClick={() => setForm(emptyBrand)}>
                Cancel
              </Button>
            )}
          </div>
          {saveMutation.error && (
            <p className="sm:col-span-2 text-sm text-destructive">
              {(saveMutation.error as Error).message}
            </p>
          )}
        </form>
      </AdminCard>

      <div className="mt-8">
        <QueryState isLoading={isLoading} error={error} />
        {data && (
          <div className="overflow-x-auto rounded-md border border-border bg-surface">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Origin</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(data as any[]).map((brand) => (
                  <tr key={brand.id}>
                    <td className="px-4 py-3 font-medium">{brand.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{brand.slug}</td>
                    <td className="px-4 py-3 text-muted-foreground">{brand.origin ?? "—"}</td>
                    <td className="px-4 py-3">{brand.is_active ? "Visible" : "Hidden"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => setForm(brand)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteMutation.mutate(brand.id)}
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
      </div>
    </>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={`space-y-2 ${full ? "sm:col-span-2" : ""}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
