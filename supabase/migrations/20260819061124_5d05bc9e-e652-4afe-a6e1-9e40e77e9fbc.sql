-- 1. Non-public product documents must not be readable
DROP POLICY IF EXISTS "product_documents public read" ON public.product_documents;
CREATE POLICY "product_documents public read" ON public.product_documents
  FOR SELECT TO anon, authenticated
  USING (is_public = true);

-- 2. Hide internal cost price from anon and ordinary authenticated users (column-level)
REVOKE SELECT ON public.products FROM anon;
REVOKE SELECT ON public.products FROM authenticated;
GRANT SELECT (
  id, slug, name, short_description, description, brand_id, category_id, sku, mpn,
  product_type, status, price_minor, currency_code, stock, low_stock_threshold,
  warranty_months, requires_serial, requires_license, digital_delivery, is_master,
  is_slave, supports_obd, supports_bench, supports_boot, primary_image_url, is_demo,
  published_at, created_at, updated_at
) ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;

-- 3. Internal helper functions must not be callable through the Data API
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_staff(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO service_role;