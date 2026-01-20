-- Enable RLS on businesses table
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Policy untuk READ semua usaha yang aktif (public access)
CREATE POLICY "Allow public read active businesses"
ON businesses FOR SELECT
USING (status = 'aktif');

-- Policy untuk admin bisa read/update/delete usaha mereka sendiri
CREATE POLICY "Allow admin to manage own businesses"
ON businesses FOR ALL
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- Policy untuk admin bisa read semua usaha (untuk dashboard)
CREATE POLICY "Allow admin to read all businesses"
ON businesses FOR SELECT
USING (auth.role() = 'authenticated' AND EXISTS (
  SELECT 1 FROM auth.users 
  WHERE auth.users.id = auth.uid()
));

-- Allow anyone to insert (but only their own, controlled by trigger/app logic)
CREATE POLICY "Allow authenticated users to create businesses"
ON businesses FOR INSERT
WITH CHECK (auth.uid() = created_by);
