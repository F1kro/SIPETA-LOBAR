# Setup Admin Account

## Credentials Admin Default

Untuk mengakses dashboard admin, gunakan credentials berikut:

**Email:** admin@dpmptsp.id
**Password:** AdminLombokBarat2024!

## Cara Akses

1. Pergi ke halaman `/auth/login`
2. Login menggunakan email dan password di atas
3. Setelah login berhasil, Anda akan diarahkan ke dashboard admin di `/admin`

## Fitur Admin

Di dashboard admin, Anda dapat:

- **Melihat semua usaha yang terdaftar** - Tabel lengkap dengan informasi usaha
- **Tambah Usaha Baru** - Klik tombol "Tambah Usaha Baru" untuk membuka form
- **Edit Usaha** - Klik tombol Edit pada usaha yang ingin diubah
- **Hapus Usaha** - Klik tombol Delete untuk menghapus usaha dari database
- **Filter dan Cari** - Gunakan fitur search untuk menemukan usaha tertentu

## Form Tambah/Edit Usaha

Field yang harus diisi:

- **Nama Usaha** - Nama lengkap usaha/bisnis
- **Deskripsi** - Penjelasan singkat tentang usaha
- **Sektor** - Kategori sektor usaha (Pariwisata, Pertanian, dll)
- **Jenis Usaha** - Tipe bisnis spesifik
- **Nama Pemilik** - Nama pemilik/pengelola usaha
- **Alamat Lengkap** - Alamat fisik usaha
- **Desa** - Nama desa lokasi usaha
- **Kecamatan** - Nama kecamatan lokasi usaha
- **Latitude & Longitude** - Koordinat GPS lokasi usaha
- **Investasi** - Besarnya investasi dalam IDR
- **Badge Status** - PELUANG, POTENSI, atau PENGEMBANGAN
- **Tahun Berdiri** - Tahun usaha didirikan
- **URL Foto** - Link ke foto usaha (bisa dari cloud storage)
- **Status** - aktif atau tidak aktif

## Menemukan Koordinat (Latitude & Longitude)

1. Buka Google Maps
2. Klik kanan pada lokasi usaha
3. Salin latitude dan longitude dari popup yang muncul
4. Paste ke field Latitude dan Longitude di form

Contoh: -8.5518, 116.0754

## Note

- Hanya usaha dengan status "aktif" yang akan ditampilkan di peta publik
- Semua data usaha akan langsung muncul di halaman "Peta Usaha" setelah tersimpan
- User biasa dapat melihat dan mengklik marker usaha di peta untuk melihat detail lengkap
