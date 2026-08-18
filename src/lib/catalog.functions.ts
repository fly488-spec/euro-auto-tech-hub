import { createServerFn } from "@tanstack/react-start";

import { createPublicSupabaseClient } from "./supabase-public.server";

export type StorefrontBrand = {
  id: string;
  slug: string;
  name: string;
  origin: string | null;
  tagline: string | null;
};

export type StorefrontCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  parent_id: string | null;
  product_count: number;
};

export type StorefrontProduct = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  price_minor: number;
  currency_code: string;
  stock: number;
  primary_image_url: string | null;
  brand_id: string | null;
  category_id: string | null;
};

export const getStorefrontCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createPublicSupabaseClient();

  const [brandsRes, categoriesRes, productsRes] = await Promise.all([
    supabase
      .from("brands")
      .select("id, slug, name, origin, tagline")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("categories")
      .select("id, slug, name, description, icon, parent_id")
      .eq("is_active", true)
      .order("sort_order"),
    supabase
      .from("products")
      .select(
        "id, slug, name, short_description, price_minor, currency_code, stock, primary_image_url, brand_id, category_id",
      )
      .eq("status", "published")
      .order("name"),
  ]);

  if (brandsRes.error) throw new Error(brandsRes.error.message);
  if (categoriesRes.error) throw new Error(categoriesRes.error.message);
  if (productsRes.error) throw new Error(productsRes.error.message);

  const products = (productsRes.data ?? []) as StorefrontProduct[];
  const categories: StorefrontCategory[] = (categoriesRes.data ?? []).map((c) => ({
    ...c,
    product_count: products.filter((p) => p.category_id === c.id).length,
  }));

  return {
    brands: (brandsRes.data ?? []) as StorefrontBrand[],
    categories,
    products,
  };
});
