# Revised Architecture — European Automotive Diagnostics & Tuning Platform

Revised per your corrections. Still no code. Principle applied throughout: scalable but simple to operate, minimal manual work for you.

## 1. Recommended architecture

- Frontend: TanStack Start (React 19, SSR) — needed for SEO on product, brand and category pages.
- Backend: Lovable Cloud (Postgres + auth + storage + server functions). One system, no external services to manage.
- One app, two surfaces: `/` storefront (public + customer account), `/admin` (role-gated).
- Private storage buckets with signed links for invoices, license files, manuals, software downloads.
- Search: Postgres full-text + fuzzy matching; filters on indexed spec columns.
- Everything money-, stock- or license-related runs server-side only.

## 2. Database structure

Catalog: `brands`, `categories`, `products`, `product_variants`, `product_media`, `product_documents`, `product_specs`, `product_compatibility`.

Translations (one pattern reused everywhere, so new languages need no schema change): `languages`, `ui_translations`, and `*_translations` tables keyed by `(entity_id, language_code)`.

Commerce: `carts`, `cart_items`, `orders`, `order_items`, `payments`, `invoices`, `addresses`, `shipping_methods`, `coupons`.

Customers: `profiles`, `user_roles` (separate table, never a column on profiles), `companies` (B2B), `b2b_applications`, `price_lists`, `price_list_items`.

Serials / Licenses / Warranty: `serial_numbers`, `devices`, `licenses`, `license_activations`, `warranties`, `warranty_claims`.

ECU: `vehicle_makes`, `vehicle_models`, `engines`, `ecu_units`, `ecu_products`, `product_ecu_coverage`.

Ops: `inventory`, `stock_movements`, `suppliers`, `import_jobs`, `import_rows`, `import_errors`, `staged_products`, `audit_log`, `settings`, `currencies`, `fx_rates`, `tax_settings`.

Every table: RLS on, explicit grants, customer rows scoped to `auth.uid()`, admin access through a `has_role()` security-definer function.

## 3. Main pages (storefront)

Home · Brands + brand detail · Categories · Product listing with filters · Search · Product detail (specs, OBD/BENCH/BOOT, Master/Slave, ECU coverage, stock, warranty) · Vehicle/ECU compatibility search · Cart · Checkout · Order confirmation.

Account: Dashboard · Orders + PDF invoice · My Devices · Licenses · Warranty · Addresses · Company/VAT details · Downloads.

Legal: Imprint, Terms, Privacy, Returns, Shipping.

## 4. Admin panel

Single dashboard with: Products · Imports · Pending Approval · Pricing · Stock · Orders · Customers (B2C + B2B) · Brands · Categories · ECU database · Serial numbers · Licenses · Warranty · Translations · Settings.

Dashboard home surfaces the things needing your attention: bank transfers awaiting confirmation, imports awaiting approval, import errors, low stock, new B2B applications, open warranty claims.

## 5. User roles

`customer`, `b2b_customer`, `support`, `admin`, `superadmin`. Stored in `user_roles`, enforced server-side. (Dropped warehouse/content_editor as unnecessary for v1 — easy to add later.)

## 6. Product data model

`products`: name, slug, brand, category, SKU, manufacturer part number, description, type (hardware / license / software / cable / accessory), status (draft / pending / published / archived), cost price, selling price, currency, stock, warranty months, requires_serial, requires_license, digital_delivery, master/slave flag, OBD / BENCH / BOOT flags.

Plus: `product_specs` (technical specifications, language-independent), `product_media` (images), `product_documents` (manuals, datasheets), `product_compatibility` (vehicles + ECUs), `product_translations` (name, description, marketing text only).

Language-independent by design: SKU, MPN, part numbers, hardware/software numbers, technical spec values, compatibility data.

## 7. ECU / TCU data model

`ecu_products`: manufacturer, part number, hardware number, software number, ECU type, ECU manufacturer, vehicle brand, model, year, engine, condition (new / used / refurbished), stock, price, images, compatibility.

Linked to the vehicle tree (make → model → engine) and to tool products via `product_ecu_coverage` (which tool covers which unit, and for which operation). Imports from authorized CSV/XML exports such as ECUSell go through the same review/approve pipeline as products.

## 8. Multilingual architecture

- `languages` table drives everything — adding a language is a row, never a schema change.
- Content: `*_translations` tables per entity. UI: `ui_translations`, editable in admin.
- URL locale prefix (`/de/…`, `/ru/…`) with hreflang + canonical for SEO.
- Fallback: requested language → English → key. Untranslated fields show English, never blank.
- One product record, many translations — never duplicate products per language.
- Launch languages: EN, DE, NL, FR, IT, ES, PT, PL, CS, SK, HU, RO, BG, HR, SL, EL, DA, SV, NO, FI, ET, LV, LT, GA, RU, TR.
- Practical note: 26 languages is a lot of translation work. I'll build the system so admin can machine-translate a product into all languages in one click and then edit, so you don't type 26 versions by hand.

## 9. Currency architecture

EUR (base), USD, RUB. Rates stored in `fx_rates` and refreshed from a provider — never hard-coded, editable in admin. Prices stored as integer minor units. Per-product manual price override per currency always wins over the converted rate. Currency is locked onto the order at checkout.

## 10. Payment architecture

Two methods only:
- **Card (credit/debit) via Stripe** — hosted checkout, order confirmed by webhook.
- **Bank transfer** — order created as `awaiting_payment`, bank details + reference on the confirmation page and invoice, stays pending until an admin marks it paid in the Orders screen. Nothing ships or issues a license until then.

No SEPA, iDEAL, Bancontact, Klarna, crypto, Wise, installments or financing.

Modular by design: payments go through one internal payment-provider interface, so a second provider is a new adapter, not a rewrite.

## 11. Tax / VAT (deliberately basic)

Settings hold seller VAT number and invoice details. Customers/companies can store a VAT number. One configurable standard VAT rate (plus optional per-country override rows if you ever need them). Prices flagged VAT-included or VAT-excluded. VAT lines shown in cart, checkout and on the PDF invoice with sequential invoice numbering.

No OSS engine, no VIES validation, no per-jurisdiction rate tables in v1 — the schema leaves room for all of it later.

## 12. Import architecture

Flow, enforced for every source: **IMPORT → REVIEW → APPROVE → PUBLISH**. Imported data lands in `staged_products` / staging rows and is **never** publicly visible until you approve it.

- Upload CSV/XLSX/XML, or a saved supplier feed.
- Reusable per-supplier column-mapping profile — map once, reuse forever.
- Row validation: valid rows to Pending Approval, invalid rows to Import Errors with the reason and inline fix + re-run.
- Pending Approval screen: full edit of every field (name, description, prices, images, category, translations) before publishing; bulk approve/reject.
- Idempotent by supplier + external key, so re-importing updates rather than duplicates. Price/stock-only refreshes can be auto-applied to already-published products (your choice per supplier), while new products always require approval.
- Target suppliers: FLEX / Magicmotorsport, AutoTuner, Alientech, SMOK, CarProTool, Thinkcar, OBDSTAR, plus ECUSell-style ECU exports.

## 13. Out of scope for v1

Product reviews, wishlist, abandoned cart, dealer commissions, reseller portal, firmware updates, support ticketing, multi-warehouse, dangerous-goods/export rules. The schema won't block any of them later.

## 14. Development phases

1. Design system + storefront shell (home, brands, categories, static pages).
2. Cloud enablement, catalog + translation schema, admin product/brand/category CRUD.
3. Product listing, filtering, search, product detail.
4. Cart, checkout, Stripe card payment, bank transfer + admin confirmation, orders, PDF invoices, basic VAT.
5. Customer account: orders, devices, licenses, warranty, downloads.
6. Serial number + license engine (issue, activate, revoke) and warranty registration.
7. Admin operations: stock, pricing, price lists, B2B customers.
8. ECU database, vehicle compatibility search, ECU product pages.
9. Import engine: mapping profiles, staging, Pending Approval, Import Errors; supplier + ECUSell formats.
10. Multilingual rollout (26 languages, bulk machine translation + editing), EUR/USD/RUB, SEO, security review, go-live.

Each phase ends with a working, usable system — you can sell after Phase 4.

## Assumptions worth confirming

- EU-registered seller, EUR base currency, single storefront.
- Stripe is the card processor (built into Lovable, no separate account setup needed).
- Licenses bind to a device serial / hardware ID, not just an account.
- Physical goods ship; licenses and software deliver digitally after payment is confirmed.
- Supplier imports are file/feed based, not live supplier APIs (added later per supplier if they offer one).

Approve this and I'll build Phase 1 only.
