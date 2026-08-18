import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";

export type Client = SupabaseClient<Database>;

/** Server-side role check. Never trust the UI for admin access. */
export async function assertStaff(supabase: Client, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .in("role", ["admin", "superadmin"]);

  if (error) throw new Error(error.message);
  if (!data || data.length === 0) throw new Error("Forbidden: staff role required");
  return true;
}

export function unwrap<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return (res.data ?? []) as T;
}

export type ProductInput = {
  id?: string;
  slug: string;
  name: string;
  short_description?: string | null;
  description?: string | null;
  brand_id?: string | null;
  category_id?: string | null;
  sku: string;
  mpn?: string | null;
  product_type: Database["public"]["Enums"]["product_type"];
  status: Database["public"]["Enums"]["product_status"];
  cost_price_minor: number;
  price_minor: number;
  currency_code: string;
  stock: number;
  warranty_months: number;
  requires_serial: boolean;
  requires_license: boolean;
  digital_delivery: boolean;
  is_master: boolean;
  is_slave: boolean;
  supports_obd: boolean;
  supports_bench: boolean;
  supports_boot: boolean;
  primary_image_url?: string | null;
};

export type BrandInput = {
  id?: string;
  slug: string;
  name: string;
  origin?: string | null;
  tagline?: string | null;
  website_url?: string | null;
  is_active: boolean;
  sort_order: number;
};

export type CategoryInput = {
  id?: string;
  slug: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  parent_id?: string | null;
  is_active: boolean;
  sort_order: number;
};
