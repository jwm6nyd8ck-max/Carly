-- Indigo Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Brands table ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  country_of_hq TEXT,
  primary_manufacturing_countries TEXT[],
  indigo_score INTEGER CHECK (indigo_score >= 0 AND indigo_score <= 100),
  material_score INTEGER CHECK (material_score >= 0 AND material_score <= 25),
  labor_score INTEGER CHECK (labor_score >= 0 AND labor_score <= 25),
  chemical_score INTEGER CHECK (chemical_score >= 0 AND chemical_score <= 20),
  environmental_score INTEGER CHECK (environmental_score >= 0 AND environmental_score <= 20),
  brand_ethics_score INTEGER CHECK (brand_ethics_score >= 0 AND brand_ethics_score <= 10),
  grade TEXT CHECK (grade IN ('A+', 'A', 'B', 'C', 'D', 'F')),
  certifications TEXT[],
  red_flags TEXT[],
  green_flags TEXT[],
  notes TEXT,
  collections_per_year INTEGER,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  sources TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS brands_slug_idx ON brands(slug);
CREATE INDEX IF NOT EXISTS brands_indigo_score_idx ON brands(indigo_score DESC);
CREATE INDEX IF NOT EXISTS brands_name_idx ON brands USING gin(to_tsvector('english', name));

-- ── Items table ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  barcode TEXT,
  name TEXT,
  material_composition JSONB,
  country_of_manufacture TEXT,
  certifications TEXT[],
  performance_claims TEXT[],
  indigo_score INTEGER CHECK (indigo_score >= 0 AND indigo_score <= 100),
  material_score INTEGER,
  labor_score INTEGER,
  chemical_score INTEGER,
  environmental_score INTEGER,
  scan_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS items_barcode_idx ON items(barcode);
CREATE INDEX IF NOT EXISTS items_brand_id_idx ON items(brand_id);

-- ── User wardrobes ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wardrobe_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id UUID REFERENCES items(id) ON DELETE SET NULL,
  brand_name TEXT,
  item_name TEXT,
  indigo_score INTEGER CHECK (indigo_score >= 0 AND indigo_score <= 100),
  added_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS wardrobe_items_user_id_idx ON wardrobe_items(user_id);

-- ── Scan history ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scan_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  barcode TEXT,
  brand_name TEXT,
  result_score INTEGER,
  scanned_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS scan_history_user_id_idx ON scan_history(user_id);

-- ── Row Level Security ────────────────────────────────────────────────────
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wardrobe_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;

-- Public can read brands and items
CREATE POLICY "Public brands read" ON brands FOR SELECT USING (true);
CREATE POLICY "Public items read" ON items FOR SELECT USING (true);

-- Users can only access their own data
CREATE POLICY "Users own wardrobe" ON wardrobe_items
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own scan history" ON scan_history
  FOR ALL USING (auth.uid() = user_id);

-- Service role can write brands/items
CREATE POLICY "Service role can manage brands" ON brands
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage items" ON items
  FOR ALL USING (auth.role() = 'service_role');
