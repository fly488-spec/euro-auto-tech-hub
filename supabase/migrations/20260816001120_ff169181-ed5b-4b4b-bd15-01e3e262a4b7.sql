
-- ============ ENUMS ============
create type public.app_role as enum ('customer','b2b_customer','support','admin','superadmin');
create type public.product_status as enum ('draft','pending','published','archived');
create type public.product_type as enum ('hardware','license','software','cable','accessory','control_unit');

-- ============ HELPERS ============
create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role);
$$;

create or replace function public.is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','superadmin'));
$$;

create policy "users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());
create policy "staff read all roles" on public.user_roles for select to authenticated using (public.is_staff(auth.uid()));
create policy "staff manage roles" on public.user_roles for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- ============ LANGUAGES ============
create table public.languages (
  code text primary key,
  name text not null,
  native_name text not null,
  is_active boolean not null default true,
  is_default boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.languages to anon, authenticated;
grant all on public.languages to service_role;
alter table public.languages enable row level security;
create policy "languages public read" on public.languages for select to anon, authenticated using (true);
create policy "languages staff write" on public.languages for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

create table public.ui_translations (
  id uuid primary key default gen_random_uuid(),
  namespace text not null default 'common',
  key text not null,
  language_code text not null references public.languages(code) on delete cascade,
  value text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (namespace, key, language_code)
);
grant select on public.ui_translations to anon, authenticated;
grant all on public.ui_translations to service_role;
alter table public.ui_translations enable row level security;
create policy "ui_translations public read" on public.ui_translations for select to anon, authenticated using (true);
create policy "ui_translations staff write" on public.ui_translations for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger set_ui_translations_updated_at before update on public.ui_translations for each row execute function public.update_updated_at_column();

-- ============ BRANDS ============
create table public.brands (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  origin text,
  tagline text,
  description text,
  logo_url text,
  website_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.brands to anon, authenticated;
grant select, insert, update, delete on public.brands to authenticated;
grant all on public.brands to service_role;
alter table public.brands enable row level security;
create policy "brands public read" on public.brands for select to anon, authenticated using (true);
create policy "brands staff write" on public.brands for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger set_brands_updated_at before update on public.brands for each row execute function public.update_updated_at_column();

-- ============ CATEGORIES ============
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories(id) on delete set null,
  slug text not null unique,
  name text not null,
  description text,
  icon text,
  image_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.categories to anon, authenticated;
grant select, insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "categories public read" on public.categories for select to anon, authenticated using (true);
create policy "categories staff write" on public.categories for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger set_categories_updated_at before update on public.categories for each row execute function public.update_updated_at_column();
create index categories_parent_idx on public.categories(parent_id);

-- ============ PRODUCTS ============
create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_description text,
  description text,
  brand_id uuid references public.brands(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  sku text not null unique,
  mpn text,
  product_type public.product_type not null default 'hardware',
  status public.product_status not null default 'draft',
  cost_price_minor bigint not null default 0,
  price_minor bigint not null default 0,
  currency_code text not null default 'EUR',
  stock int not null default 0,
  low_stock_threshold int not null default 3,
  warranty_months int not null default 24,
  requires_serial boolean not null default false,
  requires_license boolean not null default false,
  digital_delivery boolean not null default false,
  is_master boolean not null default false,
  is_slave boolean not null default false,
  supports_obd boolean not null default false,
  supports_bench boolean not null default false,
  supports_boot boolean not null default false,
  primary_image_url text,
  is_demo boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.products to anon, authenticated;
grant select, insert, update, delete on public.products to authenticated;
grant all on public.products to service_role;
alter table public.products enable row level security;
create policy "products public read published" on public.products for select to anon, authenticated using (status = 'published');
create policy "products staff read all" on public.products for select to authenticated using (public.is_staff(auth.uid()));
create policy "products staff write" on public.products for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create trigger set_products_updated_at before update on public.products for each row execute function public.update_updated_at_column();
create index products_brand_idx on public.products(brand_id);
create index products_category_idx on public.products(category_id);
create index products_status_idx on public.products(status);

-- ============ PRODUCT CHILD TABLES ============
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  name text not null,
  price_minor bigint,
  stock int not null default 0,
  attributes jsonb not null default '{}'::jsonb,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt_text text,
  sort_order int not null default 0,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.product_documents (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  title text not null,
  url text not null,
  doc_type text not null default 'manual',
  is_public boolean not null default true,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.product_specs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  spec_group text not null default 'General',
  spec_key text not null,
  spec_value text not null,
  sort_order int not null default 0,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.product_compatibility (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  vehicle_make text,
  vehicle_model text,
  engine text,
  ecu_reference text,
  operation text,
  note text,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.product_translations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  language_code text not null references public.languages(code) on delete cascade,
  name text,
  short_description text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, language_code)
);

create table public.brand_translations (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete cascade,
  language_code text not null references public.languages(code) on delete cascade,
  tagline text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (brand_id, language_code)
);

create table public.category_translations (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  language_code text not null references public.languages(code) on delete cascade,
  name text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_id, language_code)
);

do $$
declare t text;
begin
  foreach t in array array['product_variants','product_media','product_documents','product_specs','product_compatibility','product_translations','brand_translations','category_translations']
  loop
    execute format('grant select on public.%I to anon, authenticated;', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated;', t);
    execute format('grant all on public.%I to service_role;', t);
    execute format('alter table public.%I enable row level security;', t);
    execute format('create policy "%s public read" on public.%I for select to anon, authenticated using (true);', t, t);
    execute format('create policy "%s staff write" on public.%I for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));', t, t);
  end loop;
end $$;

create trigger set_product_translations_updated_at before update on public.product_translations for each row execute function public.update_updated_at_column();
create trigger set_brand_translations_updated_at before update on public.brand_translations for each row execute function public.update_updated_at_column();
create trigger set_category_translations_updated_at before update on public.category_translations for each row execute function public.update_updated_at_column();
create trigger set_product_variants_updated_at before update on public.product_variants for each row execute function public.update_updated_at_column();

-- ============ LANGUAGE SEED ============
insert into public.languages (code, name, native_name, is_default, sort_order) values
 ('en','English','English',true,0),
 ('de','German','Deutsch',false,1),
 ('nl','Dutch','Nederlands',false,2),
 ('fr','French','Français',false,3),
 ('it','Italian','Italiano',false,4),
 ('es','Spanish','Español',false,5),
 ('pt','Portuguese','Português',false,6),
 ('pl','Polish','Polski',false,7),
 ('cs','Czech','Čeština',false,8),
 ('sk','Slovak','Slovenčina',false,9),
 ('hu','Hungarian','Magyar',false,10),
 ('ro','Romanian','Română',false,11),
 ('bg','Bulgarian','Български',false,12),
 ('hr','Croatian','Hrvatski',false,13),
 ('sl','Slovenian','Slovenščina',false,14),
 ('el','Greek','Ελληνικά',false,15),
 ('da','Danish','Dansk',false,16),
 ('sv','Swedish','Svenska',false,17),
 ('no','Norwegian','Norsk',false,18),
 ('fi','Finnish','Suomi',false,19),
 ('et','Estonian','Eesti',false,20),
 ('lv','Latvian','Latviešu',false,21),
 ('lt','Lithuanian','Lietuvių',false,22),
 ('ga','Irish','Gaeilge',false,23),
 ('ru','Russian','Русский',false,24),
 ('tr','Turkish','Türkçe',false,25);
