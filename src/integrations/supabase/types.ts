export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string
          company: string | null
          country_code: string
          created_at: string
          full_name: string
          id: string
          is_default_billing: boolean
          is_default_shipping: boolean
          label: string | null
          line1: string
          line2: string | null
          phone: string | null
          postal_code: string
          updated_at: string
          user_id: string
        }
        Insert: {
          city: string
          company?: string | null
          country_code: string
          created_at?: string
          full_name: string
          id?: string
          is_default_billing?: boolean
          is_default_shipping?: boolean
          label?: string | null
          line1: string
          line2?: string | null
          phone?: string | null
          postal_code: string
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string
          company?: string | null
          country_code?: string
          created_at?: string
          full_name?: string
          id?: string
          is_default_billing?: boolean
          is_default_shipping?: boolean
          label?: string | null
          line1?: string
          line2?: string | null
          phone?: string | null
          postal_code?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          details: Json
          entity_id: string | null
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          details?: Json
          entity_id?: string | null
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
      b2b_applications: {
        Row: {
          company_name: string
          contact_email: string | null
          country_code: string | null
          created_at: string
          id: string
          message: string | null
          reviewed_by: string | null
          status: string
          updated_at: string
          user_id: string | null
          vat_number: string | null
        }
        Insert: {
          company_name: string
          contact_email?: string | null
          country_code?: string | null
          created_at?: string
          id?: string
          message?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          vat_number?: string | null
        }
        Update: {
          company_name?: string
          contact_email?: string | null
          country_code?: string | null
          created_at?: string
          id?: string
          message?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          vat_number?: string | null
        }
        Relationships: []
      }
      brand_translations: {
        Row: {
          brand_id: string
          created_at: string
          description: string | null
          id: string
          language_code: string
          tagline: string | null
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          description?: string | null
          id?: string
          language_code: string
          tagline?: string | null
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          description?: string | null
          id?: string
          language_code?: string
          tagline?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_translations_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brand_translations_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
        ]
      }
      brands: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_demo: boolean
          logo_url: string | null
          name: string
          origin: string | null
          slug: string
          sort_order: number
          tagline: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_demo?: boolean
          logo_url?: string | null
          name: string
          origin?: string | null
          slug: string
          sort_order?: number
          tagline?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_demo?: boolean
          logo_url?: string | null
          name?: string
          origin?: string | null
          slug?: string
          sort_order?: number
          tagline?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          cart_id: string
          created_at: string
          id: string
          product_id: string
          quantity: number
          unit_price_minor: number
          variant_id: string | null
        }
        Insert: {
          cart_id: string
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          unit_price_minor?: number
          variant_id?: string | null
        }
        Update: {
          cart_id?: string
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          unit_price_minor?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      carts: {
        Row: {
          created_at: string
          currency_code: string
          id: string
          session_token: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          currency_code?: string
          id?: string
          session_token?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          currency_code?: string
          id?: string
          session_token?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean
          is_demo: boolean
          name: string
          parent_id: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_demo?: boolean
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_demo?: boolean
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      category_translations: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          id: string
          language_code: string
          name: string | null
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          language_code: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          language_code?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_translations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_translations_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
        ]
      }
      companies: {
        Row: {
          country_code: string | null
          created_at: string
          id: string
          is_approved: boolean
          name: string
          owner_id: string | null
          price_list_id: string | null
          registration_number: string | null
          updated_at: string
          vat_number: string | null
        }
        Insert: {
          country_code?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          name: string
          owner_id?: string | null
          price_list_id?: string | null
          registration_number?: string | null
          updated_at?: string
          vat_number?: string | null
        }
        Update: {
          country_code?: string | null
          created_at?: string
          id?: string
          is_approved?: boolean
          name?: string
          owner_id?: string | null
          price_list_id?: string | null
          registration_number?: string | null
          updated_at?: string
          vat_number?: string | null
        }
        Relationships: []
      }
      currencies: {
        Row: {
          code: string
          created_at: string
          is_active: boolean
          is_base: boolean
          minor_unit: number
          name: string
          symbol: string
        }
        Insert: {
          code: string
          created_at?: string
          is_active?: boolean
          is_base?: boolean
          minor_unit?: number
          name: string
          symbol: string
        }
        Update: {
          code?: string
          created_at?: string
          is_active?: boolean
          is_base?: boolean
          minor_unit?: number
          name?: string
          symbol?: string
        }
        Relationships: []
      }
      devices: {
        Row: {
          created_at: string
          hardware_id: string | null
          id: string
          nickname: string | null
          product_id: string | null
          registered_at: string
          serial_number_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          hardware_id?: string | null
          id?: string
          nickname?: string | null
          product_id?: string | null
          registered_at?: string
          serial_number_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          hardware_id?: string | null
          id?: string
          nickname?: string | null
          product_id?: string | null
          registered_at?: string
          serial_number_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devices_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devices_serial_number_id_fkey"
            columns: ["serial_number_id"]
            isOneToOne: false
            referencedRelation: "serial_numbers"
            referencedColumns: ["id"]
          },
        ]
      }
      ecu_products: {
        Row: {
          condition: string
          created_at: string
          currency_code: string
          ecu_unit_id: string | null
          engine_id: string | null
          id: string
          image_url: string | null
          is_demo: boolean
          make_id: string | null
          model_id: string | null
          price_minor: number
          product_id: string | null
          status: Database["public"]["Enums"]["product_status"]
          stock: number
          updated_at: string
        }
        Insert: {
          condition?: string
          created_at?: string
          currency_code?: string
          ecu_unit_id?: string | null
          engine_id?: string | null
          id?: string
          image_url?: string | null
          is_demo?: boolean
          make_id?: string | null
          model_id?: string | null
          price_minor?: number
          product_id?: string | null
          status?: Database["public"]["Enums"]["product_status"]
          stock?: number
          updated_at?: string
        }
        Update: {
          condition?: string
          created_at?: string
          currency_code?: string
          ecu_unit_id?: string | null
          engine_id?: string | null
          id?: string
          image_url?: string | null
          is_demo?: boolean
          make_id?: string | null
          model_id?: string | null
          price_minor?: number
          product_id?: string | null
          status?: Database["public"]["Enums"]["product_status"]
          stock?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ecu_products_ecu_unit_id_fkey"
            columns: ["ecu_unit_id"]
            isOneToOne: false
            referencedRelation: "ecu_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ecu_products_engine_id_fkey"
            columns: ["engine_id"]
            isOneToOne: false
            referencedRelation: "engines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ecu_products_make_id_fkey"
            columns: ["make_id"]
            isOneToOne: false
            referencedRelation: "vehicle_makes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ecu_products_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "vehicle_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ecu_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      ecu_units: {
        Row: {
          created_at: string
          ecu_type: string
          hardware_number: string | null
          id: string
          is_demo: boolean
          manufacturer: string
          notes: string | null
          part_number: string | null
          software_number: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          ecu_type: string
          hardware_number?: string | null
          id?: string
          is_demo?: boolean
          manufacturer: string
          notes?: string | null
          part_number?: string | null
          software_number?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          ecu_type?: string
          hardware_number?: string | null
          id?: string
          is_demo?: boolean
          manufacturer?: string
          notes?: string | null
          part_number?: string | null
          software_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      engines: {
        Row: {
          created_at: string
          displacement: string | null
          fuel_type: string | null
          id: string
          is_demo: boolean
          model_id: string | null
          name: string
          power_hp: number | null
        }
        Insert: {
          created_at?: string
          displacement?: string | null
          fuel_type?: string | null
          id?: string
          is_demo?: boolean
          model_id?: string | null
          name: string
          power_hp?: number | null
        }
        Update: {
          created_at?: string
          displacement?: string | null
          fuel_type?: string | null
          id?: string
          is_demo?: boolean
          model_id?: string | null
          name?: string
          power_hp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "engines_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "vehicle_models"
            referencedColumns: ["id"]
          },
        ]
      }
      fx_rates: {
        Row: {
          base_code: string
          created_at: string
          effective_at: string
          id: string
          quote_code: string
          rate: number
          source: string
        }
        Insert: {
          base_code: string
          created_at?: string
          effective_at?: string
          id?: string
          quote_code: string
          rate: number
          source?: string
        }
        Update: {
          base_code?: string
          created_at?: string
          effective_at?: string
          id?: string
          quote_code?: string
          rate?: number
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "fx_rates_base_code_fkey"
            columns: ["base_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "fx_rates_quote_code_fkey"
            columns: ["quote_code"]
            isOneToOne: false
            referencedRelation: "currencies"
            referencedColumns: ["code"]
          },
        ]
      }
      import_errors: {
        Row: {
          created_at: string
          field: string | null
          id: string
          import_job_id: string
          import_row_id: string | null
          message: string
          resolved: boolean
        }
        Insert: {
          created_at?: string
          field?: string | null
          id?: string
          import_job_id: string
          import_row_id?: string | null
          message: string
          resolved?: boolean
        }
        Update: {
          created_at?: string
          field?: string | null
          id?: string
          import_job_id?: string
          import_row_id?: string | null
          message?: string
          resolved?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "import_errors_import_job_id_fkey"
            columns: ["import_job_id"]
            isOneToOne: false
            referencedRelation: "import_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_errors_import_row_id_fkey"
            columns: ["import_row_id"]
            isOneToOne: false
            referencedRelation: "import_rows"
            referencedColumns: ["id"]
          },
        ]
      }
      import_jobs: {
        Row: {
          created_at: string
          created_by: string | null
          error_rows: number
          file_name: string | null
          id: string
          mapping_profile: Json
          source_type: string
          status: Database["public"]["Enums"]["import_status"]
          supplier_id: string | null
          total_rows: number
          updated_at: string
          valid_rows: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          error_rows?: number
          file_name?: string | null
          id?: string
          mapping_profile?: Json
          source_type?: string
          status?: Database["public"]["Enums"]["import_status"]
          supplier_id?: string | null
          total_rows?: number
          updated_at?: string
          valid_rows?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          error_rows?: number
          file_name?: string | null
          id?: string
          mapping_profile?: Json
          source_type?: string
          status?: Database["public"]["Enums"]["import_status"]
          supplier_id?: string | null
          total_rows?: number
          updated_at?: string
          valid_rows?: number
        }
        Relationships: [
          {
            foreignKeyName: "import_jobs_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      import_rows: {
        Row: {
          created_at: string
          id: string
          import_job_id: string
          raw_data: Json
          row_number: number
          status: Database["public"]["Enums"]["import_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          import_job_id: string
          raw_data?: Json
          row_number?: number
          status?: Database["public"]["Enums"]["import_status"]
        }
        Update: {
          created_at?: string
          id?: string
          import_job_id?: string
          raw_data?: Json
          row_number?: number
          status?: Database["public"]["Enums"]["import_status"]
        }
        Relationships: [
          {
            foreignKeyName: "import_rows_import_job_id_fkey"
            columns: ["import_job_id"]
            isOneToOne: false
            referencedRelation: "import_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          created_at: string
          id: string
          location: string
          product_id: string
          quantity: number
          reserved: number
          updated_at: string
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string
          product_id: string
          quantity?: number
          reserved?: number
          updated_at?: string
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          location?: string
          product_id?: string
          quantity?: number
          reserved?: number
          updated_at?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          currency_code: string
          id: string
          invoice_number: string
          issued_at: string
          order_id: string
          pdf_url: string | null
          total_minor: number
        }
        Insert: {
          created_at?: string
          currency_code?: string
          id?: string
          invoice_number: string
          issued_at?: string
          order_id: string
          pdf_url?: string | null
          total_minor?: number
        }
        Update: {
          created_at?: string
          currency_code?: string
          id?: string
          invoice_number?: string
          issued_at?: string
          order_id?: string
          pdf_url?: string | null
          total_minor?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      languages: {
        Row: {
          code: string
          created_at: string
          is_active: boolean
          is_default: boolean
          name: string
          native_name: string
          sort_order: number
        }
        Insert: {
          code: string
          created_at?: string
          is_active?: boolean
          is_default?: boolean
          name: string
          native_name: string
          sort_order?: number
        }
        Update: {
          code?: string
          created_at?: string
          is_active?: boolean
          is_default?: boolean
          name?: string
          native_name?: string
          sort_order?: number
        }
        Relationships: []
      }
      license_activations: {
        Row: {
          activated_at: string
          created_at: string
          device_id: string | null
          id: string
          ip_address: string | null
          license_id: string
        }
        Insert: {
          activated_at?: string
          created_at?: string
          device_id?: string | null
          id?: string
          ip_address?: string | null
          license_id: string
        }
        Update: {
          activated_at?: string
          created_at?: string
          device_id?: string | null
          id?: string
          ip_address?: string | null
          license_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "license_activations_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "license_activations_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "licenses"
            referencedColumns: ["id"]
          },
        ]
      }
      licenses: {
        Row: {
          created_at: string
          device_id: string | null
          id: string
          license_key: string
          order_id: string | null
          product_id: string | null
          status: Database["public"]["Enums"]["license_status"]
          updated_at: string
          user_id: string | null
          valid_from: string
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          device_id?: string | null
          id?: string
          license_key: string
          order_id?: string | null
          product_id?: string | null
          status?: Database["public"]["Enums"]["license_status"]
          updated_at?: string
          user_id?: string | null
          valid_from?: string
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          device_id?: string | null
          id?: string
          license_key?: string
          order_id?: string | null
          product_id?: string | null
          status?: Database["public"]["Enums"]["license_status"]
          updated_at?: string
          user_id?: string | null
          valid_from?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "licenses_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "licenses_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "licenses_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          name: string
          order_id: string
          product_id: string | null
          quantity: number
          sku: string | null
          total_minor: number
          unit_price_minor: number
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          order_id: string
          product_id?: string | null
          quantity?: number
          sku?: string | null
          total_minor?: number
          unit_price_minor?: number
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          sku?: string | null
          total_minor?: number
          unit_price_minor?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address_id: string | null
          created_at: string
          currency_code: string
          id: string
          is_demo: boolean
          notes: string | null
          order_number: string
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          shipping_address_id: string | null
          shipping_minor: number
          status: Database["public"]["Enums"]["order_status"]
          subtotal_minor: number
          total_minor: number
          updated_at: string
          user_id: string | null
          vat_minor: number
        }
        Insert: {
          billing_address_id?: string | null
          created_at?: string
          currency_code?: string
          id?: string
          is_demo?: boolean
          notes?: string | null
          order_number: string
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          shipping_address_id?: string | null
          shipping_minor?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_minor?: number
          total_minor?: number
          updated_at?: string
          user_id?: string | null
          vat_minor?: number
        }
        Update: {
          billing_address_id?: string | null
          created_at?: string
          currency_code?: string
          id?: string
          is_demo?: boolean
          notes?: string | null
          order_number?: string
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          shipping_address_id?: string | null
          shipping_minor?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_minor?: number
          total_minor?: number
          updated_at?: string
          user_id?: string | null
          vat_minor?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_billing_address_id_fkey"
            columns: ["billing_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_minor: number
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string
          currency_code: string
          id: string
          method: Database["public"]["Enums"]["payment_method"]
          order_id: string
          provider_reference: string | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
        }
        Insert: {
          amount_minor?: number
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          currency_code?: string
          id?: string
          method: Database["public"]["Enums"]["payment_method"]
          order_id: string
          provider_reference?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Update: {
          amount_minor?: number
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          currency_code?: string
          id?: string
          method?: Database["public"]["Enums"]["payment_method"]
          order_id?: string
          provider_reference?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      price_list_items: {
        Row: {
          created_at: string
          id: string
          price_list_id: string
          price_minor: number
          product_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          price_list_id: string
          price_minor: number
          product_id: string
        }
        Update: {
          created_at?: string
          id?: string
          price_list_id?: string
          price_minor?: number
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_list_items_price_list_id_fkey"
            columns: ["price_list_id"]
            isOneToOne: false
            referencedRelation: "price_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_list_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      price_lists: {
        Row: {
          created_at: string
          currency_code: string
          discount_percent: number
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency_code?: string
          discount_percent?: number
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency_code?: string
          discount_percent?: number
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_compatibility: {
        Row: {
          created_at: string
          ecu_reference: string | null
          engine: string | null
          id: string
          is_demo: boolean
          note: string | null
          operation: string | null
          product_id: string
          vehicle_make: string | null
          vehicle_model: string | null
        }
        Insert: {
          created_at?: string
          ecu_reference?: string | null
          engine?: string | null
          id?: string
          is_demo?: boolean
          note?: string | null
          operation?: string | null
          product_id: string
          vehicle_make?: string | null
          vehicle_model?: string | null
        }
        Update: {
          created_at?: string
          ecu_reference?: string | null
          engine?: string | null
          id?: string
          is_demo?: boolean
          note?: string | null
          operation?: string | null
          product_id?: string
          vehicle_make?: string | null
          vehicle_model?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_compatibility_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_documents: {
        Row: {
          created_at: string
          doc_type: string
          id: string
          is_demo: boolean
          is_public: boolean
          product_id: string
          title: string
          url: string
        }
        Insert: {
          created_at?: string
          doc_type?: string
          id?: string
          is_demo?: boolean
          is_public?: boolean
          product_id: string
          title: string
          url: string
        }
        Update: {
          created_at?: string
          doc_type?: string
          id?: string
          is_demo?: boolean
          is_public?: boolean
          product_id?: string
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_documents_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_ecu_coverage: {
        Row: {
          connection_mode: string | null
          created_at: string
          ecu_unit_id: string
          id: string
          is_demo: boolean
          operation: string
          product_id: string
        }
        Insert: {
          connection_mode?: string | null
          created_at?: string
          ecu_unit_id: string
          id?: string
          is_demo?: boolean
          operation?: string
          product_id: string
        }
        Update: {
          connection_mode?: string | null
          created_at?: string
          ecu_unit_id?: string
          id?: string
          is_demo?: boolean
          operation?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_ecu_coverage_ecu_unit_id_fkey"
            columns: ["ecu_unit_id"]
            isOneToOne: false
            referencedRelation: "ecu_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_ecu_coverage_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_media: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          is_demo: boolean
          product_id: string
          sort_order: number
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          is_demo?: boolean
          product_id: string
          sort_order?: number
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          is_demo?: boolean
          product_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_media_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_specs: {
        Row: {
          created_at: string
          id: string
          is_demo: boolean
          product_id: string
          sort_order: number
          spec_group: string
          spec_key: string
          spec_value: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_demo?: boolean
          product_id: string
          sort_order?: number
          spec_group?: string
          spec_key: string
          spec_value: string
        }
        Update: {
          created_at?: string
          id?: string
          is_demo?: boolean
          product_id?: string
          sort_order?: number
          spec_group?: string
          spec_key?: string
          spec_value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_specs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_translations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          language_code: string
          name: string | null
          product_id: string
          short_description: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          language_code: string
          name?: string | null
          product_id: string
          short_description?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          language_code?: string
          name?: string | null
          product_id?: string
          short_description?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_translations_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "product_translations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          attributes: Json
          created_at: string
          id: string
          is_demo: boolean
          name: string
          price_minor: number | null
          product_id: string
          sku: string
          stock: number
          updated_at: string
        }
        Insert: {
          attributes?: Json
          created_at?: string
          id?: string
          is_demo?: boolean
          name: string
          price_minor?: number | null
          product_id: string
          sku: string
          stock?: number
          updated_at?: string
        }
        Update: {
          attributes?: Json
          created_at?: string
          id?: string
          is_demo?: boolean
          name?: string
          price_minor?: number | null
          product_id?: string
          sku?: string
          stock?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand_id: string | null
          category_id: string | null
          cost_price_minor: number
          created_at: string
          currency_code: string
          description: string | null
          digital_delivery: boolean
          id: string
          is_demo: boolean
          is_master: boolean
          is_slave: boolean
          low_stock_threshold: number
          mpn: string | null
          name: string
          price_minor: number
          primary_image_url: string | null
          product_type: Database["public"]["Enums"]["product_type"]
          published_at: string | null
          requires_license: boolean
          requires_serial: boolean
          short_description: string | null
          sku: string
          slug: string
          status: Database["public"]["Enums"]["product_status"]
          stock: number
          supports_bench: boolean
          supports_boot: boolean
          supports_obd: boolean
          updated_at: string
          warranty_months: number
        }
        Insert: {
          brand_id?: string | null
          category_id?: string | null
          cost_price_minor?: number
          created_at?: string
          currency_code?: string
          description?: string | null
          digital_delivery?: boolean
          id?: string
          is_demo?: boolean
          is_master?: boolean
          is_slave?: boolean
          low_stock_threshold?: number
          mpn?: string | null
          name: string
          price_minor?: number
          primary_image_url?: string | null
          product_type?: Database["public"]["Enums"]["product_type"]
          published_at?: string | null
          requires_license?: boolean
          requires_serial?: boolean
          short_description?: string | null
          sku: string
          slug: string
          status?: Database["public"]["Enums"]["product_status"]
          stock?: number
          supports_bench?: boolean
          supports_boot?: boolean
          supports_obd?: boolean
          updated_at?: string
          warranty_months?: number
        }
        Update: {
          brand_id?: string | null
          category_id?: string | null
          cost_price_minor?: number
          created_at?: string
          currency_code?: string
          description?: string | null
          digital_delivery?: boolean
          id?: string
          is_demo?: boolean
          is_master?: boolean
          is_slave?: boolean
          low_stock_threshold?: number
          mpn?: string | null
          name?: string
          price_minor?: number
          primary_image_url?: string | null
          product_type?: Database["public"]["Enums"]["product_type"]
          published_at?: string | null
          requires_license?: boolean
          requires_serial?: boolean
          short_description?: string | null
          sku?: string
          slug?: string
          status?: Database["public"]["Enums"]["product_status"]
          stock?: number
          supports_bench?: boolean
          supports_boot?: boolean
          supports_obd?: boolean
          updated_at?: string
          warranty_months?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_id: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          preferred_currency: string
          preferred_language: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          preferred_currency?: string
          preferred_language?: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_currency?: string
          preferred_language?: string
          updated_at?: string
        }
        Relationships: []
      }
      serial_numbers: {
        Row: {
          assigned_to: string | null
          created_at: string
          id: string
          is_demo: boolean
          order_id: string | null
          product_id: string | null
          serial: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          id?: string
          is_demo?: boolean
          order_id?: string | null
          product_id?: string | null
          serial: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          id?: string
          is_demo?: boolean
          order_id?: string | null
          product_id?: string | null
          serial?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "serial_numbers_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "serial_numbers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          is_public: boolean
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          is_public?: boolean
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          is_public?: boolean
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      shipping_methods: {
        Row: {
          carrier: string | null
          countries: string[] | null
          created_at: string
          currency_code: string
          id: string
          is_active: boolean
          name: string
          price_minor: number
          updated_at: string
        }
        Insert: {
          carrier?: string | null
          countries?: string[] | null
          created_at?: string
          currency_code?: string
          id?: string
          is_active?: boolean
          name: string
          price_minor?: number
          updated_at?: string
        }
        Update: {
          carrier?: string | null
          countries?: string[] | null
          created_at?: string
          currency_code?: string
          id?: string
          is_active?: boolean
          name?: string
          price_minor?: number
          updated_at?: string
        }
        Relationships: []
      }
      staged_products: {
        Row: {
          change_type: string
          created_at: string
          external_key: string | null
          id: string
          import_job_id: string | null
          payload: Json
          previous_payload: Json | null
          product_id: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["import_status"]
          supplier_id: string | null
          updated_at: string
        }
        Insert: {
          change_type?: string
          created_at?: string
          external_key?: string | null
          id?: string
          import_job_id?: string | null
          payload?: Json
          previous_payload?: Json | null
          product_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["import_status"]
          supplier_id?: string | null
          updated_at?: string
        }
        Update: {
          change_type?: string
          created_at?: string
          external_key?: string | null
          id?: string
          import_job_id?: string | null
          payload?: Json
          previous_payload?: Json | null
          product_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["import_status"]
          supplier_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staged_products_import_job_id_fkey"
            columns: ["import_job_id"]
            isOneToOne: false
            referencedRelation: "import_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staged_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staged_products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_movements: {
        Row: {
          change: number
          created_at: string
          created_by: string | null
          id: string
          product_id: string | null
          reason: string
          reference: string | null
          variant_id: string | null
        }
        Insert: {
          change: number
          created_at?: string
          created_by?: string | null
          id?: string
          product_id?: string | null
          reason?: string
          reference?: string | null
          variant_id?: string | null
        }
        Update: {
          change?: number
          created_at?: string
          created_by?: string | null
          id?: string
          product_id?: string | null
          reason?: string
          reference?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          contact_email: string | null
          created_at: string
          id: string
          import_mode: string
          is_active: boolean
          name: string
          requires_approval: boolean
          slug: string
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          id?: string
          import_mode?: string
          is_active?: boolean
          name: string
          requires_approval?: boolean
          slug: string
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          id?: string
          import_mode?: string
          is_active?: boolean
          name?: string
          requires_approval?: boolean
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      tax_settings: {
        Row: {
          country_code: string | null
          created_at: string
          id: string
          is_default: boolean
          prices_include_vat: boolean
          standard_rate: number
          updated_at: string
        }
        Insert: {
          country_code?: string | null
          created_at?: string
          id?: string
          is_default?: boolean
          prices_include_vat?: boolean
          standard_rate?: number
          updated_at?: string
        }
        Update: {
          country_code?: string | null
          created_at?: string
          id?: string
          is_default?: boolean
          prices_include_vat?: boolean
          standard_rate?: number
          updated_at?: string
        }
        Relationships: []
      }
      ui_translations: {
        Row: {
          created_at: string
          id: string
          key: string
          language_code: string
          namespace: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          language_code: string
          namespace?: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          language_code?: string
          namespace?: string
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "ui_translations_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["code"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicle_makes: {
        Row: {
          created_at: string
          id: string
          is_demo: boolean
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_demo?: boolean
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          is_demo?: boolean
          name?: string
          slug?: string
        }
        Relationships: []
      }
      vehicle_models: {
        Row: {
          created_at: string
          id: string
          is_demo: boolean
          make_id: string
          name: string
          slug: string
          year_from: number | null
          year_to: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_demo?: boolean
          make_id: string
          name: string
          slug: string
          year_from?: number | null
          year_to?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          is_demo?: boolean
          make_id?: string
          name?: string
          slug?: string
          year_from?: number | null
          year_to?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_models_make_id_fkey"
            columns: ["make_id"]
            isOneToOne: false
            referencedRelation: "vehicle_makes"
            referencedColumns: ["id"]
          },
        ]
      }
      warranties: {
        Row: {
          created_at: string
          device_id: string | null
          ends_at: string | null
          id: string
          order_id: string | null
          starts_at: string
          status: Database["public"]["Enums"]["warranty_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          device_id?: string | null
          ends_at?: string | null
          id?: string
          order_id?: string | null
          starts_at?: string
          status?: Database["public"]["Enums"]["warranty_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          device_id?: string | null
          ends_at?: string | null
          id?: string
          order_id?: string | null
          starts_at?: string
          status?: Database["public"]["Enums"]["warranty_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "warranties_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warranties_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      warranty_claims: {
        Row: {
          created_at: string
          description: string | null
          id: string
          status: Database["public"]["Enums"]["claim_status"]
          subject: string
          updated_at: string
          user_id: string | null
          warranty_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          status?: Database["public"]["Enums"]["claim_status"]
          subject: string
          updated_at?: string
          user_id?: string | null
          warranty_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          status?: Database["public"]["Enums"]["claim_status"]
          subject?: string
          updated_at?: string
          user_id?: string | null
          warranty_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "warranty_claims_warranty_id_fkey"
            columns: ["warranty_id"]
            isOneToOne: false
            referencedRelation: "warranties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "customer" | "b2b_customer" | "support" | "admin" | "superadmin"
      claim_status: "open" | "in_review" | "approved" | "rejected" | "closed"
      import_status:
        | "pending"
        | "processing"
        | "review"
        | "approved"
        | "rejected"
        | "failed"
        | "completed"
      license_status: "issued" | "active" | "suspended" | "revoked" | "expired"
      order_status:
        | "draft"
        | "awaiting_payment"
        | "paid"
        | "processing"
        | "shipped"
        | "completed"
        | "cancelled"
        | "refunded"
      payment_method: "card" | "bank_transfer"
      payment_status: "pending" | "confirmed" | "failed" | "refunded"
      product_status: "draft" | "pending" | "published" | "archived"
      product_type:
        | "hardware"
        | "license"
        | "software"
        | "cable"
        | "accessory"
        | "control_unit"
      warranty_status: "active" | "expired" | "void"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["customer", "b2b_customer", "support", "admin", "superadmin"],
      claim_status: ["open", "in_review", "approved", "rejected", "closed"],
      import_status: [
        "pending",
        "processing",
        "review",
        "approved",
        "rejected",
        "failed",
        "completed",
      ],
      license_status: ["issued", "active", "suspended", "revoked", "expired"],
      order_status: [
        "draft",
        "awaiting_payment",
        "paid",
        "processing",
        "shipped",
        "completed",
        "cancelled",
        "refunded",
      ],
      payment_method: ["card", "bank_transfer"],
      payment_status: ["pending", "confirmed", "failed", "refunded"],
      product_status: ["draft", "pending", "published", "archived"],
      product_type: [
        "hardware",
        "license",
        "software",
        "cable",
        "accessory",
        "control_unit",
      ],
      warranty_status: ["active", "expired", "void"],
    },
  },
} as const
