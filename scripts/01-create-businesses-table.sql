-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  
  -- Basic Info
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sector VARCHAR(100) NOT NULL, -- e.g., "Pariwisata", "Pertanian", "Kerajinan"
  business_type VARCHAR(100), -- e.g., "Resort", "Restoran", "Homestay"
  
  -- Location
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  village VARCHAR(100), -- Desa
  district VARCHAR(100), -- Kecamatan
  address TEXT,
  
  -- Business Details
  status VARCHAR(50) NOT NULL DEFAULT 'aktif', -- aktif, nonaktif
  badge VARCHAR(50), -- PELUANG, POTENSI, dll
  investment_amount BIGINT, -- Investment in Rupiah
  year_established INTEGER,
  
  -- Images
  image_url VARCHAR(500),
  before_image_url VARCHAR(500),
  after_image_url VARCHAR(500),
  
  -- Additional Info
  owner_name VARCHAR(255),
  owner_email VARCHAR(255),
  owner_phone VARCHAR(20),
  
  -- Admin tracking
  created_by UUID REFERENCES auth.users(id),
  
  -- Enable RLS
  user_id UUID REFERENCES auth.users(id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_businesses_sector ON businesses(sector);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_created_by ON businesses(created_by);
CREATE INDEX IF NOT EXISTS idx_businesses_latitude ON businesses(latitude);
CREATE INDEX IF NOT EXISTS idx_businesses_longitude ON businesses(longitude);

-- Enable Row Level Security
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Everyone can view public/aktif businesses
CREATE POLICY "Businesses are viewable by everyone"
  ON businesses FOR SELECT
  USING (status = 'aktif');

-- RLS Policy: Admins can view all businesses
CREATE POLICY "Admins can view all businesses"
  ON businesses FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- RLS Policy: Only admins can insert
CREATE POLICY "Only admins can create businesses"
  ON businesses FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- RLS Policy: Only admins can update
CREATE POLICY "Only admins can update businesses"
  ON businesses FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- RLS Policy: Only admins can delete
CREATE POLICY "Only admins can delete businesses"
  ON businesses FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users 
      WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create sample data (optional)
INSERT INTO businesses (name, description, sector, business_type, latitude, longitude, village, district, address, status, badge, investment_amount, year_established, image_url)
VALUES 
  ('Pantai Lestari Resort', 'Resort bintang 4 dengan pemandangan pantai yang indah', 'Pariwisata', 'Resort', -8.8123, 116.1456, 'Meniga', 'Bayan', 'Jl. Pantai Utama No. 1', 'aktif', 'PELUANG', 50000000000, 2020, 'https://via.placeholder.com/400x300?text=Pantai+Lestari'),
  ('Sentra Kerajinan Lombok', 'Pusat kerajinan tradisional dan modern', 'Kerajinan', 'Pusat Kerajinan', -8.7890, 116.2345, 'Senaru', 'Bayan', 'Jl. Kerajinan No. 5', 'aktif', 'POTENSI', 5000000000, 2018, 'https://via.placeholder.com/400x300?text=Kerajinan'),
  ('Diving Center Paradise', 'Pusat diving dengan instruktur bersertifikat internasional', 'Pariwisata', 'Diving Center', -8.8456, 116.3210, 'Tanjung', 'Sekarbela', 'Jl. Pantai Timur No. 8', 'aktif', 'PELUANG', 2000000000, 2019, 'https://via.placeholder.com/400x300?text=Diving');
