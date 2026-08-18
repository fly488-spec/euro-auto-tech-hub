import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { AdminCard, AdminPageHeader, QueryState } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteCategory, listAdminCategories, saveCategory } from "@/lib/admin.functions";
import type { CategoryInput } from "@/lib/admin.server";

export const Route = createFileRoute("/_authenticated/admin/categories")({
  component: AdminCategories,
});

const emptyCategory: CategoryInput = {
  slug: "",
  name: "",
  description: "",
  icon: "cpu",
  parent_id: null,
  is_active: true,
  sort_order: 0,
};

function AdminCategories() {
  const queryClient = useQueryClient();
  const fetchCategories = useServerFn(listAdminCategories);
  const save = useServerFn(saveCategory);
  const remove = useServerFn(deleteCategory);
  const [form, setForm] = useState<CategoryInput>(emptyCategory);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => fetchCategories(),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });

  const saveMutation = useMutation({
    mutationFn: (input: CategoryInput) => save({ data: input }),
    onSuccess: () => {
      setForm(emptyCategory);
      invalidate();
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: invalidate,
  });

  const rows = (data as any[]) ?? [];

  return (
    <>
      <AdminPageHeader
        eyebrow="Catalogue"
        title="Categories"
        description="Category tree used for storefront navigation and filtering."
      />

      <AdminCard>
        <h2 className="font-display text-lg font-semibold">
          {form.id ? "Edit category" : "Add category"}
        </h2>
        <form
          className="mt-5 grid gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            saveMutation.mutate(form);
          }}
        >
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Description</Label>
            <Input
              value={form.description ?? ""}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Icon key</Label>
            <Input
              value={form.icon ?? ""}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Parent category</Label>
            <select
              className="h-10 w-full rounded-sm border border-input bg-background px-3 text-sm"
              value={form.parent_id ?? ""}
              onChange={(e) => setForm({ ...form, parent_id: e.target.value || null })}
            >
              <option value="">Top level</option>
              {rows
                .filter((c) => c.id !== form.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Sort order</Label>
            <Input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Active</Label>
            <select
              className="h-10 w-full rounded-sm border border-input bg-background px-3 text-sm"
              value={form.is_active ? "yes" : "no"}
              onChange={(e) => setForm({ ...form, is_active: e.target.value === "yes" })}
            >
              <option value="yes">Visible</option>
              <option value="no">Hidden</option>
            </select>
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <Button type="submit" disabled={saveMutation.isPending}>
              {form.id ? "Save changes" : "Add category"}
            </Button>
            {form.id && (
              <Button type="button" variant="outline" onClick={() => setForm(emptyCategory)}>
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
                  <th className="px-4 py-3">Parent</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((category) => (
                  <tr key={category.id}>
                    <td className="px-4 py-3 font-medium">{category.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{category.slug}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {rows.find((c) => c.id === category.parent_id)?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3">{category.is_active ? "Visible" : "Hidden"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => setForm(category)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteMutation.mutate(category.id)}
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
