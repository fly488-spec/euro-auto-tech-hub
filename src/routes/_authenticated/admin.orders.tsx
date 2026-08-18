import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { AdminPageHeader, QueryState } from "@/components/admin/admin-shell";
import { listAdminOrders } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  const fetchOrders = useServerFn(listAdminOrders);
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: () => fetchOrders(),
  });

  const orders = (data as any[]) ?? [];

  return (
    <>
      <AdminPageHeader
        eyebrow="Commerce"
        title="Orders"
        description="Order records. Checkout and payment confirmation arrive in Phase 4."
      />
      <QueryState isLoading={isLoading} error={error} />

      {data && (
        <div className="overflow-x-auto rounded-md border border-border bg-surface">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-3 font-medium">{order.order_number}</td>
                  <td className="px-4 py-3">{order.status}</td>
                  <td className="px-4 py-3 text-muted-foreground">{order.payment_method ?? "—"}</td>
                  <td className="px-4 py-3 tabular-nums">
                    {new Intl.NumberFormat("en-IE", {
                      style: "currency",
                      currency: order.currency_code,
                    }).format(order.total_minor / 100)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-muted-foreground" colSpan={5}>
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
