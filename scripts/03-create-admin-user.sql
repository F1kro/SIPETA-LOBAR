-- NOTE: Admin user dibuat melalui Supabase Auth UI karena security
-- Ikuti langkah berikut untuk setup admin user:
-- 
-- 1. Buka Supabase Dashboard
-- 2. Go to Authentication > Users
-- 3. Click "Add user" 
-- 4. Email: admin@dpmptsp.id
-- 5. Password: AdminLombokBarat2024!
-- 6. Create user
--
-- ATAU gunakan Supabase CLI:
-- npx supabase auth admin create-user admin@dpmptsp.id --password "AdminLombokBarat2024!"
--
-- Setelah user dibuat, jalankan script ini untuk menambahkan role admin ke user:

-- Pastikan user dengan email admin@dpmptsp.id sudah ada di auth.users
-- Kemudian update metadata untuk menandai sebagai admin
UPDATE auth.users 
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb), 
  '{role}', 
  '"admin"'::jsonb
)
WHERE email = 'admin@dpmptsp.id';

-- Verifikasi email
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'admin@dpmptsp.id';
