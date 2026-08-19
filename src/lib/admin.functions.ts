import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  assertStaff,
  unwrap,
  type BrandInput,
  type CategoryInput,
  type ProductInput,
} from "./admin.server";

export const getAdminDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
    const sb = context.supabase;

    const count = async (
      table: "products" | "staged_products" | "import_errors" | "payments" | "orders",
      apply: (q: any) => any,
    ) => {
      const { count: c, error } = await apply(sb.from(table).select("id", { count: "exact", head: true }));
      if (error) throw new Error(error.message);
      return c ?? 0;
    };

    const [total, published, draft, pending, pendingStaged, importErrors, pendingBank] =
      await Promise.all([
        count("products", (q) => q),
        count("products", (q) => q.eq("status", "published")),
        count("products", (q) => q.eq("status", "draft")),
        count("products", (q) => q.eq("status", "pending")),
        count("staged_products", (q) => q.eq("status", "review")),
        count("import_errors", (q) => q.eq("resolved", false)),
        count("payments", (q) => q.eq("method", "bank_transfer").eq("status", "pending")),
      ]);

    const lowStock = unwrap(
      await sb.from("products").select("id, name, sku, stock, low_stock_threshold").lte("stock", 3),
    ) as Array<{ id: string; name: string; sku: string; stock: number }>;

    return {
      totalProducts: total,
      publishedProducts: published,
      draftProducts: draft,
      pendingProducts: pending + pendingStaged,
      lowStock: lowStock.length,
      lowStockItems: lowStock.slice(0, 8),
      pendingBankTransfers: pendingBank,
      importErrors,
    };
  });

export const listAdminProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
    const baseProducts = unwrap(
      await context.supabase
        .from("products")
        .select(
          "id, slug, name, sku, mpn, status, product_type, price_minor, currency_code, stock, brand_id, category_id, is_demo, warranty_months, requires_serial, requires_license, digital_delivery, is_master, is_slave, supports_obd, supports_bench, supports_boot, short_description, description, primary_image_url",
        )
        .order("created_at", { ascending: false }),
    ) as Array<{ id: string }>;

    // cost_price_minor is staff-only: readable through the service-role client after
    // the staff check above, never through the caller's RLS client.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const costs = unwrap(
      await supabaseAdmin.from("products").select("id, cost_price_minor"),
    ) as Array<{ id: string; cost_price_minor: number }>;
    const costById = new Map(costs.map((c) => [c.id, c.cost_price_minor]));
    const products = baseProducts.map((p) => ({
      ...p,
      cost_price_minor: costById.get(p.id) ?? 0,
    }));

    const brands = unwrap(
      await context.supabase.from("brands").select("id, name").order("name"),
    );
    const categories = unwrap(
      await context.supabase.from("categories").select("id, name, parent_id").order("name"),
    );
    return { products, brands, categories };
  });


export const saveProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: ProductInput) => data)
  .handler(async ({ context, data }) => {
    await assertStaff(context.supabase, context.userId);
    const { id, ...values } = data;
    const payload = {
      ...values,
      published_at: values.status === "published" ? new Date().toISOString() : null,
    };
    const res = id
      ? await context.supabase.from("products").update(payload).eq("id", id).select("id").single()
      : await context.supabase.from("products").insert(payload).select("id").single();
    if (res.error) throw new Error(res.error.message);
    return res.data;
  });

export const setProductStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; status: ProductInput["status"] }) => data)
  .handler(async ({ context, data }) => {
    await assertStaff(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("products")
      .update({
        status: data.status,
        published_at: data.status === "published" ? new Date().toISOString() : null,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ context, data }) => {
    await assertStaff(context.supabase, context.userId);
    const { error } = await context.supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listAdminBrands = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
    return unwrap(await context.supabase.from("brands").select("*").order("sort_order"));
  });

export const saveBrand = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: BrandInput) => data)
  .handler(async ({ context, data }) => {
    await assertStaff(context.supabase, context.userId);
    const { id, ...values } = data;
    const res = id
      ? await context.supabase.from("brands").update(values).eq("id", id).select("id").single()
      : await context.supabase.from("brands").insert(values).select("id").single();
    if (res.error) throw new Error(res.error.message);
    return res.data;
  });

export const deleteBrand = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ context, data }) => {
    await assertStaff(context.supabase, context.userId);
    const { error } = await context.supabase.from("brands").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listAdminCategories = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
    return unwrap(await context.supabase.from("categories").select("*").order("sort_order"));
  });

export const saveCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: CategoryInput) => data)
  .handler(async ({ context, data }) => {
    await assertStaff(context.supabase, context.userId);
    const { id, ...values } = data;
    const res = id
      ? await context.supabase.from("categories").update(values).eq("id", id).select("id").single()
      : await context.supabase.from("categories").insert(values).select("id").single();
    if (res.error) throw new Error(res.error.message);
    return res.data;
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ context, data }) => {
    await assertStaff(context.supabase, context.userId);
    const { error } = await context.supabase.from("categories").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listAdminTranslations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
    const languages = unwrap(
      await context.supabase.from("languages").select("*").order("sort_order"),
    );
    const productTranslations = unwrap(
      await context.supabase.from("product_translations").select("language_code"),
    ) as Array<{ language_code: string }>;
    const uiTranslations = unwrap(
      await context.supabase.from("ui_translations").select("language_code"),
    ) as Array<{ language_code: string }>;
    return { languages, productTranslations, uiTranslations };
  });

export const listAdminCustomers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
    const profiles = unwrap(
      await context.supabase
        .from("profiles")
        .select("id, email, full_name, preferred_language, preferred_currency, created_at")
        .order("created_at", { ascending: false }),
    );
    const roles = unwrap(await context.supabase.from("user_roles").select("user_id, role"));
    const companies = unwrap(
      await context.supabase.from("companies").select("id, name, vat_number, is_approved"),
    );
    return { profiles, roles, companies };
  });

export const listAdminOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
    return unwrap(
      await context.supabase
        .from("orders")
        .select("id, order_number, status, total_minor, currency_code, payment_method, created_at")
        .order("created_at", { ascending: false }),
    );
  });

export const listAdminInventory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
    return unwrap(
      await context.supabase
        .from("products")
        .select("id, name, sku, stock, low_stock_threshold, status")
        .order("stock"),
    );
  });

export const adjustStock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; stock: number }) => data)
  .handler(async ({ context, data }) => {
    await assertStaff(context.supabase, context.userId);
    const { error } = await context.supabase
      .from("products")
      .update({ stock: data.stock })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    await context.supabase.from("stock_movements").insert({
      product_id: data.id,
      change: data.stock,
      reason: "manual_set",
      created_by: context.userId,
    });
    return { ok: true };
  });

export const listAdminImports = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
    const jobs = unwrap(
      await context.supabase.from("import_jobs").select("*").order("created_at", { ascending: false }),
    );
    const staged = unwrap(
      await context.supabase.from("staged_products").select("*").order("created_at", { ascending: false }),
    );
    const errors = unwrap(
      await context.supabase.from("import_errors").select("*").order("created_at", { ascending: false }),
    );
    const suppliers = unwrap(await context.supabase.from("suppliers").select("*").order("name"));
    return { jobs, staged, errors, suppliers };
  });

export const listAdminSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context.supabase, context.userId);
    const settings = unwrap(await context.supabase.from("settings").select("*").order("key"));
    const currencies = unwrap(await context.supabase.from("currencies").select("*").order("code"));
    const fxRates = unwrap(
      await context.supabase.from("fx_rates").select("*").order("effective_at", { ascending: false }),
    );
    const taxSettings = unwrap(await context.supabase.from("tax_settings").select("*"));
    return { settings, currencies, fxRates, taxSettings };
  });
