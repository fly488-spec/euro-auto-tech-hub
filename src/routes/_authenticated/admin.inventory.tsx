import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { AdminPageHeader, QueryState } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adjustStock, listAdminInventory } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/inventory")({
  component: AdminInventory,
});

function AdminInventory() {
  const queryClient = useQueryClient();
  const fetchInventory = useServerFn(listAdminInventory);
  const setStock = useServerFn(adjustStock);
  const [edits, setEdits] = useState<Record<string, number>>({});

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "inventory"],
    queryFn: () => fetchInventory(),
  });

  const mutation = useMutation({
    mutationFn: (input: { id: string; stock: number }) => setStock({ data: input }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "inventory"] }),
  });

  const rows = (data as any[]) ?? [];

  return (
    <>
      <AdminPageHeader
        eyebrow="Operations"
        title="Stock"
        description="Set stock levels manually. Every change is written to the stock movement log."
      />
      <QueryState isLoading={isLoading} error={error} />

      {data && (
        <div className="overflow-x-auto rounded-md border border-border bg-surface">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">In stock</th>
                <th className="px-4 py-3">Set to</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.sku}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.status}</td>
                  <td
                    className={`px-4 py-3 tabular-nums ${
                      row.stock <= row.low_stock_threshold ? "text-destructive" : ""
                    }`}
                  >
                    {row.stock}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Input
                        className="h-9 w-24"
                        type="number"
                        value={edits[row.id] ?? row.stock}
                        onChange={(e) => setEdits({ ...edits, [row.id]: Number(e.target.value) })}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={mutation.isPending}
                        onClick={() =>
                          mutation.mutate({ id: row.id, stock: edits[row.id] ?? row.stock })
                        }
                      >
                        Save
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
