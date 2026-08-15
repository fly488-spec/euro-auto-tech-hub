# Architecture — European Automotive Diagnostics & Tuning Platform

No code yet. This is the architecture for your review and approval.

## 1. Recommended architecture

- Frontend: TanStack Start (React 19, SSR) — SEO-critical for product/brand/category pages.
- Backend: Lovable Cloud (Postgres + auth + storage + server functions). No separate API server.
- Data access: server functions for anything price/stock/license related; public catalog reads via narrow public read policies so pages stay SSR-cacheable.
- Two surfaces in one app: `/` storefront (public + customer account) and `/admin` (role-gated).
- Files (invoices, firmware, license files, manuals) in Cloud storage, private buckets with signed URLs.
- Search: Postgres full-text + trigram for product search; filters as indexed columns/JSONB attributes.

## 2. Database structure (core tables)

Catalog: `brands`, `categories` (self-referencing tree), `products`, `product_variants`, `product_media`, `product_attributes`, `product_translations`, `category_translations`, `brand_translations`.

Commerce: `carts`, `cart_items`, `orders`, `order_items`, `payments`, `shipments`, `addresses`, `tax_rates`, `shipping_zones`, `coupons`.

Customers: `profiles`, `user_roles` (separate table — never a role column on profiles), `companies` (B2B), `company_members`, `b2b_applications`, `price_lists`, `price_list_items`, `customer_groups`.

Serials/Licenses/Warranty: `serial_numbers`, `devices` (customer-owned units), `licenses`, `license_activations`, `warranties`, `warranty_claims`, `rma_requests`.

ECU: `vehicle_makes`, `vehicle_models`, `vehicle_generations`, `engines`, `ecus`, `tcus`, `ecu_protocols`, `product_ecu_coverage`.

Ops: `inventory`, `stock_movements`, `suppliers`, `import_jobs`, `import_rows`, `import_errors`, `approval_queue`, `audit_log`, `settings`, `translations`, `currencies`, `fx_rates`.

Every table: RLS on, explicit grants, `auth.uid()`-scoped customer policies, admin access via a `has_role()` security-definer function.

## 3. Main pages (storefront)

Home, Brands index + brand detail, Category tree pages, Product listing with faceted filters, Search results, Product detail (specs, ECU coverage, compatible licenses, stock, warranty terms), Cart, Checkout (address → shipping → VAT → payment), Order confirmation.

Account: Dashboard, Orders + order detail/invoice, My Devices (serial-bound), Licenses (activate/renew/transfer), Warranty (status + claim), Addresses, Company/B2B profile, Downloads.

Legal/EU: Imprint, Terms, Privacy, Returns/Withdrawal, Shipping, Cookie consent.

## 4. Admin panel structure

Dashboard (sales, stock alerts, pending approvals, failed imports) · Catalog (Products, Variants, Brands, Categories, Media, Attributes) · Customers (B2C, B2B companies, approvals, price lists) · Sales (Orders, Payments, Refunds, Shipments, Invoices) · Inventory (Stock, Movements, Suppliers, Purchase intake) · Pricing (price lists, tiers, currency overrides, promotions) · Imports (jobs, mapping profiles, error queue, re-run) · ECU database (vehicles, ECUs/TCUs, coverage matrix) · Serial numbers · Licenses (issue, revoke, activations) · Warranty (registrations, claims, RMA) · Translations · Settings (tax/VAT, shipping, currencies, payment, roles, audit log).

## 5. User roles

`customer`, `b2b_customer` (company-linked, needs approval), `support`, `warehouse`, `content_editor`, `admin`, `superadmin`. Stored in `user_roles`, enforced server-side through `has_role()`; UI gating is cosmetic only.

## 6. Product data model

`products` (slug, brand, category, type: hardware | license | software | cable | accessory | service, status, tax class, warranty months, requires_serial, requires_license, downloadable) → `product_variants` (SKU, EAN, price, weight, stock policy, attributes) → media, attributes (typed key/value + JSONB for filterable specs), translations, related/compatibility links, and `product_ecu_coverage` for supported control units.

## 7. ECU/TCU data model

Make → Model → Generation → Engine → Control unit (`ecus` / `tcus`: manufacturer e.g. Bosch/Continental, hardware number, software number, protocol, read/write methods, bench/boot/OBD flags). `product_ecu_coverage` joins a product/license to a control unit with operation flags (read, write, clone, immo, checksum) so "does this tool cover my ECU?" is a first-class search.

## 8. Multilingual architecture

URL-prefixed locales (`/de/…`, `/en/…`) for SEO with hreflang + canonical. Content translations in per-entity translation tables; UI strings in a `translations` table editable from admin, exported to JSON at build/runtime. Fallback chain: requested locale → EN → key. Launch set: EN, DE, TR, FR, ES, IT, PL, NL (final list is yours to confirm).

## 9. Currency architecture

Base currency EUR. `currencies` + `fx_rates` (daily provider sync, manual override). Prices stored as integer minor units. Per-currency manual price overrides beat FX conversion where set. Rounding rules per currency; the currency charged is locked onto the order at checkout.

## 10. Payment architecture

Stripe for cards/SEPA/iDEAL/Bancontact/Klarna via hosted checkout + webhooks (order state machine driven by webhook, never by the browser redirect). B2B: bank transfer / invoice with net terms and manual payment confirmation. EU VAT: VIES VAT-ID validation for B2B reverse charge, OSS rates per destination country, B2C prices VAT-inclusive.

## 11. Import architecture

Upload CSV/XLSX (or scheduled supplier feed) → `import_jobs` with a reusable column-mapping profile → row-level validation into `import_rows` → valid rows staged, invalid rows into `import_errors` with reason and inline fix + re-run. Supported types: products, prices, stock, serial numbers, ECU database, translations. Everything is idempotent by external key, dry-run preview before commit, full rollback per job.

## 12. Development phases

1. Design system + storefront shell (home, brands, categories, static pages).
2. Cloud enablement, catalog schema, admin catalog CRUD.
3. Product listing, filtering, search, product detail.
4. Cart, checkout, Stripe, VAT, orders.
5. Customer account: orders, devices, licenses, warranty.
6. Serial number + license engine (issue, activate, revoke).
7. Admin ops: stock, pricing, B2B, approvals.
8. ECU database + coverage search.
9. Imports + error queue.
10. Multilingual + currency rollout, SEO, hardening.

## What's missing from your spec

Returns/RMA flow, invoicing + EU e-invoice numbering, shipping carriers and dangerous-goods/export rules, GDPR (consent, data export, deletion), cookie banner, dealer/reseller portal with commissions, wishlist/quotes (B2B RFQ is common in this sector), software download delivery + version history, device firmware update channel, subscription/renewal billing for licenses (annual updates are the norm), anti-piracy license binding (hardware ID), support ticketing, product reviews, stock backorder/pre-order, multi-warehouse, audit logging, staff 2FA, analytics, abandoned cart, and email/notification templates.

## Assumptions I'm making (say if any are wrong)

- EU-based seller, EUR base currency, VAT/OSS applies.
- Stripe is the payment provider; B2B also needs invoice terms.
- Licenses are bound to a device serial / hardware ID, not just an account.
- Physical goods ship; software/licenses deliver digitally.
- Single storefront, not multi-tenant.

Approve this and I'll start with Phase 1 only.
