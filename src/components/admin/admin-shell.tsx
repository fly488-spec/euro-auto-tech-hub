import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const adminNav = [
  { to: "/admin", label: "Dashboard", exact: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/brands", label: "Brands" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/translations", label: "Translations" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/inventory", label: "Inventory" },
  { to: "/admin/imports", label: "Imports" },
  { to: "/admin/settings", label: "Settings" },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between gap-6">
          <Link to="/admin" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-[image:var(--gradient-signal)] font-display text-sm font-bold text-primary-foreground">
              D
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-base font-semibold tracking-tight">DIAGNOSTIQ</span>
              <span className="eyebrow text-[0.55rem]">Administration</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">View store</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="container-page flex flex-1 flex-col gap-8 py-8 lg:flex-row">
        <nav className="flex gap-1 overflow-x-auto lg:w-56 lg:flex-col lg:overflow-visible">
          {adminNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exact ?? false }}
              activeProps={{ className: "bg-elevated text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="whitespace-nowrap rounded-sm px-3 py-2 text-sm font-medium transition-colors hover:bg-elevated hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 font-display text-2xl font-semibold">{title}</h1>
        {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function AdminCard({ children }: { children: ReactNode }) {
  return <div className="rounded-md border border-border bg-surface p-6">{children}</div>;
}

export function QueryState({
  isLoading,
  error,
}: {
  isLoading: boolean;
  error: unknown;
}) {
  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (error)
    return (
      <p className="text-sm text-destructive">
        {error instanceof Error ? error.message : "Failed to load data."}
      </p>
    );
  return null;
}
