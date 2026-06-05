import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder-service-key";

const isConfigured =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
export { isConfigured };

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      brands: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          country_of_hq: string | null;
          primary_manufacturing_countries: string[] | null;
          indigo_score: number | null;
          material_score: number | null;
          labor_score: number | null;
          chemical_score: number | null;
          environmental_score: number | null;
          brand_ethics_score: number | null;
          grade: string | null;
          certifications: string[] | null;
          red_flags: string[] | null;
          green_flags: string[] | null;
          last_updated: string | null;
          sources: string[] | null;
          notes: string | null;
          collections_per_year: number | null;
        };
        Insert: Omit<Database["public"]["Tables"]["brands"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["brands"]["Row"]>;
      };
      items: {
        Row: {
          id: string;
          brand_id: string | null;
          barcode: string | null;
          name: string | null;
          material_composition: Json | null;
          country_of_manufacture: string | null;
          certifications: string[] | null;
          performance_claims: string[] | null;
          indigo_score: number | null;
          material_score: number | null;
          labor_score: number | null;
          chemical_score: number | null;
          environmental_score: number | null;
          scan_count: number | null;
          created_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["items"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["items"]["Row"]>;
      };
      wardrobe_items: {
        Row: {
          id: string;
          user_id: string | null;
          item_id: string | null;
          brand_name: string | null;
          item_name: string | null;
          indigo_score: number | null;
          added_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["wardrobe_items"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["wardrobe_items"]["Row"]>;
      };
      scan_history: {
        Row: {
          id: string;
          user_id: string | null;
          barcode: string | null;
          brand_name: string | null;
          result_score: number | null;
          scanned_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["scan_history"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["scan_history"]["Row"]>;
      };
    };
  };
}
