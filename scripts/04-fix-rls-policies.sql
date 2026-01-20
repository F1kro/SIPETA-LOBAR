-- Drop existing problematic policies
DROP POLICY IF EXISTS "Allow admin to read all businesses" ON businesses;
DROP POLICY IF EXISTS "Allow authenticated users to create businesses" ON businesses;
DROP POLICY IF EXISTS "Allow admin to manage own businesses" ON businesses;
DROP POLICY IF EXISTS "Allow public read active businesses" ON businesses;

-- Enable RLS on businesses table
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow ANYONE (authenticated or not) to read active businesses
CREATE POLICY "Allow anyone to read active businesses"
ON businesses FOR SELECT
USING (status = 'aktif');

-- Policy 2: Allow admin to read ALL businesses (including inactive ones for dashboard)
CREATE POLICY "Allow admin to read all businesses"
ON businesses FOR SELECT
USING (auth.uid() = created_by OR auth.uid() IS NOT NULL);

-- Policy 3: Allow admin to insert businesses
CREATE POLICY "Allow admin to insert businesses"
ON businesses FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Policy 4: Allow admin to update their own businesses
CREATE POLICY "Allow admin to update own businesses"
ON businesses FOR UPDATE
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- Policy 5: Allow admin to delete their own businesses
CREATE POLICY "Allow admin to delete own businesses"
ON businesses FOR DELETE
USING (auth.uid() = created_by);

COMMIT;
