/*
  # Create services table

  1. New Tables
    - `services`
      - `id` (uuid, primary key) - Unique identifier for each service
      - `user_id` (uuid) - Reference to the user who created the service
      - `title` (text) - Title/name of the service
      - `description` (text) - Short description of the service
      - `content` (text) - Main content/body of the service
      - `status` (text) - Status of the service (draft, published, unpublished)
      - `created_at` (timestamptz) - When the service was created
      - `updated_at` (timestamptz) - When the service was last updated

  2. Security
    - Enable RLS on `services` table
    - Add policy for authenticated users to view their own services
    - Add policy for authenticated users to insert their own services
    - Add policy for authenticated users to update their own services
    - Add policy for authenticated users to delete their own services
*/

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  content text DEFAULT '',
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own services"
  ON services
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own services"
  ON services
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own services"
  ON services
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own services"
  ON services
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS services_user_id_idx ON services(user_id);
CREATE INDEX IF NOT EXISTS services_status_idx ON services(status);
CREATE INDEX IF NOT EXISTS services_created_at_idx ON services(created_at DESC);