/*
  # Create News and Case Studies Tables

  ## Overview
  Creates tables to store news articles and case studies with support for rich content,
  metadata, and SEO information.

  ## New Tables
  
  ### `news`
  Stores news articles with comprehensive metadata
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - User who created the news
  - `title` (text) - News article title
  - `slug` (text, unique) - URL-friendly identifier
  - `location` (text) - Geographic location reference
  - `time_period` (text) - Time period or date string
  - `short_description` (text) - Brief summary
  - `content` (text) - Full article content (markdown supported)
  - `hero_image` (text) - Hero image reference/URL
  - `cover_image` (text, nullable) - Optional cover image
  - `locale` (text) - Language locale (default: 'en')
  - `breadcrumb` (jsonb) - Navigation breadcrumb data
  - `seo` (jsonb) - SEO metadata (title, description, keywords, etc.)
  - `category_chip` (jsonb) - Category information
  - `published_at` (timestamptz) - Publication timestamp
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `case_studies`
  Stores case study content with similar structure to news
  - Same fields as news table for consistency
  - Optimized for case study specific content

  ## Security
  - Enable RLS on both tables
  - Authenticated users can read all published content
  - Users can only create/update/delete their own content
  
  ## Indexes
  - Index on `slug` for fast lookups
  - Index on `published_at` for chronological queries
  - Index on `user_id` for user-specific queries
*/

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL DEFAULT '',
  slug text UNIQUE NOT NULL,
  location text DEFAULT '',
  time_period text DEFAULT '',
  short_description text DEFAULT '',
  content text DEFAULT '',
  hero_image text DEFAULT '',
  cover_image text,
  locale text DEFAULT 'en',
  breadcrumb jsonb DEFAULT '[]'::jsonb,
  seo jsonb DEFAULT '{}'::jsonb,
  category_chip jsonb DEFAULT '{}'::jsonb,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create case_studies table
CREATE TABLE IF NOT EXISTS case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL DEFAULT '',
  slug text UNIQUE NOT NULL,
  location text DEFAULT '',
  time_period text DEFAULT '',
  short_description text DEFAULT '',
  content text DEFAULT '',
  hero_image text DEFAULT '',
  cover_image text,
  locale text DEFAULT 'en',
  breadcrumb jsonb DEFAULT '[]'::jsonb,
  seo jsonb DEFAULT '{}'::jsonb,
  category_chip jsonb DEFAULT '{}'::jsonb,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for news
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_user_id ON news(user_id);

-- Create indexes for case_studies
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_published_at ON case_studies(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_case_studies_user_id ON case_studies(user_id);

-- Enable RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for news table
CREATE POLICY "Anyone can view published news"
  ON news FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own news"
  ON news FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own news"
  ON news FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own news"
  ON news FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for case_studies table
CREATE POLICY "Anyone can view published case studies"
  ON case_studies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own case studies"
  ON case_studies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own case studies"
  ON case_studies FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own case studies"
  ON case_studies FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);