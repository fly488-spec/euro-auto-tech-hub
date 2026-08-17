
-- ===== ENUMS =====
create type public.order_status as enum ('draft','awaiting_payment','paid','processing','shipped','completed','cancelled','refunded');
create type public.payment_method as enum ('card','bank_transfer');
create type public.payment_status as enum ('pending','confirmed','failed','refunded');
create type public.import_status as enum ('pending','processing','review','approved','rejected','failed','completed');
create type public.license_status as enum ('issued','active','suspended','revoked','expired');
create type public.warranty_status as enum ('active','expired','void');
create type public.claim_status as enum ('open','in_review','approved','rejected','closed');

-- ===== PROFILES =====
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  company_id uuid,
  preferred_language text not null default 'en',
  preferred_currency text not null default 'EUR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles own read" on public.profiles for select to authenticated using (id = auth.uid());
create policy "profiles staff read" on public.profiles for select to authenticated using (public.is_staff(auth.uid()));
create policy "profiles own update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles own insert" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "profiles staff write" on public.profiles for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.update_updated_at_column();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'customer')
  on conflict (user_id, role) do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- ===== COMPANIES / B2B =====
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
  name text not null,
  vat_number text,
  registration_number text,
  country_code text,
  is_approved boolean not null default false,
  price_list_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.companies to authenticated;
grant all on public.companies to service_role;
alter table public.companies enable row level security;
create policy "companies own" on public.companies for select to authenticated using (owner_id = auth.uid());
create policy "companies own update" on public.companies for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "companies own insert" on public.companies for insert to authenticated with check (owner_id = auth.uid());
create policy "companies staff" on public.companies for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger set_companies_updated_at before update on public.companies for each row execute function public.update_updated_at_column();

create table public.b2b_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  company_name text not null,
  vat_number text,
  country_code text,
  contact_email text,
  message text,
  status text not null default 'pending',
  reviewed_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert on public.b2b_applications to authenticated;
grant all on public.b2b_applications to service_role;
alter table public.b2b_applications enable row level security;
create policy "b2b own read" on public.b2b_applications for select to authenticated using (user_id = auth.uid());
create policy "b2b own insert" on public.b2b_applications for insert to authenticated with check (user_id = auth.uid());
create policy "b2b staff" on public.b2b_applications for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger set_b2b_updated_at before update on public.b2b_applications for each row execute function public.update_updated_at_column();

create table public.price_lists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  currency_code text not null default 'EUR',
  discount_percent numeric(5,2) not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.price_list_items (
  id uuid primary key default gen_random_uuid(),
  price_list_id uuid not null references public.price_lists(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  price_minor bigint not null,
  created_at timestamptz not null default now(),
  unique (price_list_id, product_id)
);

-- ===== ADDRESSES =====
create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text,
  full_name text not null,
  company text,
  line1 text not null,
  line2 text,
  city text not null,
  postal_code text not null,
  country_code text not null,
  phone text,
  is_default_shipping boolean not null default false,
  is_default_billing boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.addresses to authenticated;
grant all on public.addresses to service_role;
alter table public.addresses enable row level security;
create policy "addresses own" on public.addresses for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "addresses staff read" on public.addresses for select to authenticated using (public.is_staff(auth.uid()));
create trigger set_addresses_updated_at before update on public.addresses for each row execute function public.update_updated_at_column();

-- ===== CARTS =====
create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  session_token text,
  currency_code text not null default 'EUR',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete set null,
  quantity int not null default 1,
  unit_price_minor bigint not null default 0,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.carts, public.cart_items to authenticated;
grant all on public.carts, public.cart_items to service_role;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
create policy "carts own" on public.carts for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "cart_items own" on public.cart_items for all to authenticated
  using (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()))
  with check (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()));
create trigger set_carts_updated_at before update on public.carts for each row execute function public.update_updated_at_column();

-- ===== ORDERS =====
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  status public.order_status not null default 'draft',
  currency_code text not null default 'EUR',
  subtotal_minor bigint not null default 0,
  vat_minor bigint not null default 0,
  shipping_minor bigint not null default 0,
  total_minor bigint not null default 0,
  payment_method public.payment_method,
  shipping_address_id uuid references public.addresses(id) on delete set null,
  billing_address_id uuid references public.addresses(id) on delete set null,
  notes text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  sku text,
  name text not null,
  quantity int not null default 1,
  unit_price_minor bigint not null default 0,
  total_minor bigint not null default 0,
  created_at timestamptz not null default now()
);
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  method public.payment_method not null,
  status public.payment_status not null default 'pending',
  amount_minor bigint not null default 0,
  currency_code text not null default 'EUR',
  provider_reference text,
  confirmed_by uuid,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  invoice_number text not null unique,
  issued_at timestamptz not null default now(),
  total_minor bigint not null default 0,
  currency_code text not null default 'EUR',
  pdf_url text,
  created_at timestamptz not null default now()
);
grant select on public.orders, public.order_items, public.payments, public.invoices to authenticated;
grant insert, update, delete on public.orders, public.order_items, public.payments, public.invoices to authenticated;
grant all on public.orders, public.order_items, public.payments, public.invoices to service_role;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.invoices enable row level security;
create policy "orders own read" on public.orders for select to authenticated using (user_id = auth.uid());
create policy "orders staff" on public.orders for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "order_items own read" on public.order_items for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "order_items staff" on public.order_items for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "payments own read" on public.payments for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "payments staff" on public.payments for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "invoices own read" on public.invoices for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "invoices staff" on public.invoices for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger set_orders_updated_at before update on public.orders for each row execute function public.update_updated_at_column();
create trigger set_payments_updated_at before update on public.payments for each row execute function public.update_updated_at_column();

create table public.shipping_methods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  carrier text,
  price_minor bigint not null default 0,
  currency_code text not null default 'EUR',
  countries text[],
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.shipping_methods to anon, authenticated;
grant insert, update, delete on public.shipping_methods to authenticated;
grant all on public.shipping_methods to service_role;
alter table public.shipping_methods enable row level security;
create policy "shipping public read" on public.shipping_methods for select to anon, authenticated using (is_active);
create policy "shipping staff" on public.shipping_methods for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- ===== OPS (staff only) =====
create table public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  contact_email text,
  import_mode text not null default 'manual_import',
  requires_approval boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.inventory (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete cascade,
  quantity int not null default 0,
  reserved int not null default 0,
  location text not null default 'main',
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create table public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  change int not null,
  reason text not null default 'manual',
  reference text,
  created_by uuid,
  created_at timestamptz not null default now()
);
create table public.import_jobs (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid references public.suppliers(id) on delete set null,
  source_type text not null default 'csv',
  file_name text,
  status public.import_status not null default 'pending',
  mapping_profile jsonb not null default '{}'::jsonb,
  total_rows int not null default 0,
  valid_rows int not null default 0,
  error_rows int not null default 0,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.import_rows (
  id uuid primary key default gen_random_uuid(),
  import_job_id uuid not null references public.import_jobs(id) on delete cascade,
  row_number int not null default 0,
  raw_data jsonb not null default '{}'::jsonb,
  status public.import_status not null default 'pending',
  created_at timestamptz not null default now()
);
create table public.import_errors (
  id uuid primary key default gen_random_uuid(),
  import_job_id uuid not null references public.import_jobs(id) on delete cascade,
  import_row_id uuid references public.import_rows(id) on delete cascade,
  field text,
  message text not null,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.staged_products (
  id uuid primary key default gen_random_uuid(),
  import_job_id uuid references public.import_jobs(id) on delete cascade,
  supplier_id uuid references public.suppliers(id) on delete set null,
  external_key text,
  product_id uuid references public.products(id) on delete set null,
  change_type text not null default 'new',
  payload jsonb not null default '{}'::jsonb,
  previous_payload jsonb,
  status public.import_status not null default 'review',
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create table public.tax_settings (
  id uuid primary key default gen_random_uuid(),
  country_code text,
  standard_rate numeric(5,2) not null default 21.00,
  prices_include_vat boolean not null default false,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['suppliers','inventory','stock_movements','import_jobs','import_rows','import_errors','staged_products','audit_log','tax_settings','price_lists','price_list_items']
  loop
    execute format('grant select, insert, update, delete on public.%I to authenticated;', t);
    execute format('grant all on public.%I to service_role;', t);
    execute format('alter table public.%I enable row level security;', t);
    execute format('create policy "%s staff only" on public.%I for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));', t, t);
  end loop;
end $$;

create trigger set_suppliers_updated_at before update on public.suppliers for each row execute function public.update_updated_at_column();
create trigger set_inventory_updated_at before update on public.inventory for each row execute function public.update_updated_at_column();
create trigger set_import_jobs_updated_at before update on public.import_jobs for each row execute function public.update_updated_at_column();
create trigger set_staged_products_updated_at before update on public.staged_products for each row execute function public.update_updated_at_column();
create trigger set_price_lists_updated_at before update on public.price_lists for each row execute function public.update_updated_at_column();
create trigger set_tax_settings_updated_at before update on public.tax_settings for each row execute function public.update_updated_at_column();

-- ===== SETTINGS / CURRENCIES / FX =====
create table public.settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  is_public boolean not null default false,
  updated_at timestamptz not null default now()
);
grant select on public.settings to anon, authenticated;
grant insert, update, delete on public.settings to authenticated;
grant all on public.settings to service_role;
alter table public.settings enable row level security;
create policy "settings public read" on public.settings for select to anon, authenticated using (is_public);
create policy "settings staff" on public.settings for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.currencies (
  code text primary key,
  name text not null,
  symbol text not null,
  is_base boolean not null default false,
  is_active boolean not null default true,
  minor_unit int not null default 2,
  created_at timestamptz not null default now()
);
create table public.fx_rates (
  id uuid primary key default gen_random_uuid(),
  base_code text not null references public.currencies(code) on delete cascade,
  quote_code text not null references public.currencies(code) on delete cascade,
  rate numeric(18,8) not null,
  source text not null default 'manual',
  effective_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (base_code, quote_code, effective_at)
);
grant select on public.currencies, public.fx_rates to anon, authenticated;
grant insert, update, delete on public.currencies, public.fx_rates to authenticated;
grant all on public.currencies, public.fx_rates to service_role;
alter table public.currencies enable row level security;
alter table public.fx_rates enable row level security;
create policy "currencies public read" on public.currencies for select to anon, authenticated using (true);
create policy "currencies staff" on public.currencies for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "fx public read" on public.fx_rates for select to anon, authenticated using (true);
create policy "fx staff" on public.fx_rates for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

insert into public.currencies (code, name, symbol, is_base) values
 ('EUR','Euro','€',true), ('USD','US Dollar','$',false), ('RUB','Russian Rouble','₽',false);
insert into public.fx_rates (base_code, quote_code, rate, source) values
 ('EUR','USD',1.08000000,'manual'), ('EUR','RUB',98.00000000,'manual');
insert into public.settings (key, value, is_public) values
 ('store', '{"name":"Diagnostiq","base_currency":"EUR","default_language":"en"}'::jsonb, true),
 ('payments', '{"card_enabled":false,"bank_transfer_enabled":true}'::jsonb, true),
 ('bank_transfer', '{"beneficiary":"","iban":"","bic":"","bank_name":""}'::jsonb, false);
insert into public.tax_settings (country_code, standard_rate, prices_include_vat, is_default) values (null, 21.00, false, true);

-- ===== SERIALS / LICENSES / WARRANTY =====
create table public.serial_numbers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  serial text not null unique,
  status text not null default 'in_stock',
  order_id uuid references public.orders(id) on delete set null,
  assigned_to uuid references auth.users(id) on delete set null,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  serial_number_id uuid references public.serial_numbers(id) on delete set null,
  hardware_id text,
  nickname text,
  registered_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.licenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  device_id uuid references public.devices(id) on delete set null,
  license_key text not null unique,
  status public.license_status not null default 'issued',
  valid_from timestamptz not null default now(),
  valid_until timestamptz,
  order_id uuid references public.orders(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.license_activations (
  id uuid primary key default gen_random_uuid(),
  license_id uuid not null references public.licenses(id) on delete cascade,
  device_id uuid references public.devices(id) on delete set null,
  activated_at timestamptz not null default now(),
  ip_address text,
  created_at timestamptz not null default now()
);
create table public.warranties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  device_id uuid references public.devices(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  status public.warranty_status not null default 'active',
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.warranty_claims (
  id uuid primary key default gen_random_uuid(),
  warranty_id uuid references public.warranties(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  subject text not null,
  description text,
  status public.claim_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.serial_numbers, public.devices, public.licenses, public.license_activations, public.warranties, public.warranty_claims to authenticated;
grant all on public.serial_numbers, public.devices, public.licenses, public.license_activations, public.warranties, public.warranty_claims to service_role;
alter table public.serial_numbers enable row level security;
alter table public.devices enable row level security;
alter table public.licenses enable row level security;
alter table public.license_activations enable row level security;
alter table public.warranties enable row level security;
alter table public.warranty_claims enable row level security;
create policy "serials own read" on public.serial_numbers for select to authenticated using (assigned_to = auth.uid());
create policy "serials staff" on public.serial_numbers for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "devices own" on public.devices for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "devices staff" on public.devices for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "licenses own read" on public.licenses for select to authenticated using (user_id = auth.uid());
create policy "licenses staff" on public.licenses for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "activations own read" on public.license_activations for select to authenticated using (exists (select 1 from public.licenses l where l.id = license_id and l.user_id = auth.uid()));
create policy "activations staff" on public.license_activations for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "warranties own read" on public.warranties for select to authenticated using (user_id = auth.uid());
create policy "warranties staff" on public.warranties for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy "claims own" on public.warranty_claims for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "claims staff" on public.warranty_claims for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger set_serials_updated_at before update on public.serial_numbers for each row execute function public.update_updated_at_column();
create trigger set_devices_updated_at before update on public.devices for each row execute function public.update_updated_at_column();
create trigger set_licenses_updated_at before update on public.licenses for each row execute function public.update_updated_at_column();
create trigger set_warranties_updated_at before update on public.warranties for each row execute function public.update_updated_at_column();
create trigger set_claims_updated_at before update on public.warranty_claims for each row execute function public.update_updated_at_column();

-- ===== ECU =====
create table public.vehicle_makes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.vehicle_models (
  id uuid primary key default gen_random_uuid(),
  make_id uuid not null references public.vehicle_makes(id) on delete cascade,
  slug text not null,
  name text not null,
  year_from int,
  year_to int,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  unique (make_id, slug)
);
create table public.engines (
  id uuid primary key default gen_random_uuid(),
  model_id uuid references public.vehicle_models(id) on delete cascade,
  name text not null,
  fuel_type text,
  displacement text,
  power_hp int,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);
create table public.ecu_units (
  id uuid primary key default gen_random_uuid(),
  manufacturer text not null,
  ecu_type text not null,
  part_number text,
  hardware_number text,
  software_number text,
  notes text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.ecu_products (
  id uuid primary key default gen_random_uuid(),
  ecu_unit_id uuid references public.ecu_units(id) on delete set null,
  product_id uuid references public.products(id) on delete set null,
  make_id uuid references public.vehicle_makes(id) on delete set null,
  model_id uuid references public.vehicle_models(id) on delete set null,
  engine_id uuid references public.engines(id) on delete set null,
  condition text not null default 'used',
  price_minor bigint not null default 0,
  currency_code text not null default 'EUR',
  stock int not null default 0,
  status public.product_status not null default 'draft',
  image_url text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.product_ecu_coverage (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  ecu_unit_id uuid not null references public.ecu_units(id) on delete cascade,
  operation text not null default 'read/write',
  connection_mode text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  unique (product_id, ecu_unit_id, operation)
);

do $$
declare t text;
begin
  foreach t in array array['vehicle_makes','vehicle_models','engines','ecu_units','product_ecu_coverage']
  loop
    execute format('grant select on public.%I to anon, authenticated;', t);
    execute format('grant insert, update, delete on public.%I to authenticated;', t);
    execute format('grant all on public.%I to service_role;', t);
    execute format('alter table public.%I enable row level security;', t);
    execute format('create policy "%s public read" on public.%I for select to anon, authenticated using (true);', t, t);
    execute format('create policy "%s staff" on public.%I for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));', t, t);
  end loop;
end $$;

grant select on public.ecu_products to anon, authenticated;
grant insert, update, delete on public.ecu_products to authenticated;
grant all on public.ecu_products to service_role;
alter table public.ecu_products enable row level security;
create policy "ecu_products public read" on public.ecu_products for select to anon, authenticated using (status = 'published');
create policy "ecu_products staff" on public.ecu_products for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger set_ecu_units_updated_at before update on public.ecu_units for each row execute function public.update_updated_at_column();
create trigger set_ecu_products_updated_at before update on public.ecu_products for each row execute function public.update_updated_at_column();

-- Lock down helper functions from anonymous callers
revoke execute on function public.has_role(uuid, public.app_role) from anon, public;
revoke execute on function public.is_staff(uuid) from anon, public;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;
grant execute on function public.is_staff(uuid) to authenticated;
