# DPMPTSP Admin Panel - Lombok Barat

Sistem admin panel lengkap untuk mengelola data usaha, wilayah, dan users di DPMPTSP Kabupaten Lombok Barat.

## 🎯 Fitur Utama

### Admin Panel (`/admin`)
- **Dashboard** - Overview statistik usaha, wilayah, dan users
- **CRUD Usaha** - Tambah, edit, hapus lokasi usaha dengan upload foto
- **CRUD Wilayah** - Kelola wilayah, RDTR, dan rekomendasi usaha
- **CRUD Users/Admin** - Manage akun admin dan users

### User Biasa
- **Homepage** - Informasi umum dan panduan
- **Cek Wilayah** - Check area potensial dan rekomendasi usaha
- **Peta Usaha** - Lihat semua usaha di map dengan detail lengkap
- **Info Perizinan** - Edukasi tentang proses perizinan
- **FAQ & Contact** - Tanya jawab dan form kontak

## 🚀 Quick Start

Lihat **QUICK_START.md** untuk setup 5 menit, atau **SETUP_LOCAL.md** untuk dokumentasi lengkap.

```bash
# 1. Setup MySQL
mysql -u root -p
# CREATE DATABASE dpmptsp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 2. Install & Setup
npm install
cp .env.local.example .env.local
# Edit .env.local dengan DATABASE_URL yang benar

# 3. Database migration
npx prisma db push

# 4. Run development
npm run dev
```

Akses di:
- User: http://localhost:3000
- Admin: http://localhost:3000/admin

## 📁 Project Structure

```
├── app/
│   ├── admin/           # Admin panel pages & forms
│   ├── api/             # API routes (CRUD)
│   ├── (public pages)   # User pages (peta-usaha, cek-wilayah, dll)
├── components/
│   ├── admin/           # Admin components (navbar, sidebar)
│   ├── public/          # Public components (business map)
│   └── ui/              # Reusable UI components
├── lib/
│   ├── db.ts            # Prisma client
│   └── utils.ts         # Utility functions
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Sample data
└── public/              # Static assets
```

## 🗄️ Database Schema

### Usaha (Business Listings)
- ID, nama, sektor, deskripsi, lokasi (lat/lon)
- Kontak: nama pemilik, telepon, email
- Gambar: foto usaha (base64)
- Status: aktif/nonaktif

### Wilayah (Districts & Villages)
- Kecamatan (District): nama, lokasi, status RDTR
- Desa (Village): nama, kecamatan, rekomendasi usaha (JSON)
- Informasi: usaha_sesuai, perlu_kajian, catatan risiko

### Admin (Users Management)
- Email, password (hashed dengan bcrypt)
- Role: admin, moderator
- Timestamps: created_at, updated_at

## 🔐 Security

- Password hashing dengan bcrypt
- Environment variables untuk sensitive data
- Prepared queries untuk prevent SQL injection
- Role-based access control

## 🛠️ Tech Stack

- **Frontend**: React + Next.js 16
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: MySQL
- **ORM**: Prisma
- **Map**: Leaflet + OpenStreetMap
- **Icons**: Lucide React

## 📝 Development

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start prod server
npm run lint         # Check code quality

# Database tools
npx prisma studio   # Open Prisma GUI
npx prisma db push  # Sync schema
npx prisma generate # Generate client
```

## 🐛 Troubleshooting

**Error: "Error connect ECONNREFUSED"**
- MySQL server tidak berjalan, start MySQL

**Error: "Unknown database"**
- Cek database sudah dibuat: `mysql -u root -p` → `SHOW DATABASES;`

**Error: "Authentication failed"**
- Cek DATABASE_URL di `.env.local`
- Format harus: `mysql://username:password@localhost:3306/db_name`

Lihat **SETUP_LOCAL.md** untuk troubleshooting lebih lengkap.

## 📚 Documentation

- **QUICK_START.md** - Setup cepat 5 menit
- **SETUP_LOCAL.md** - Dokumentasi setup lengkap
- **ADMIN_SETUP.md** - Info admin credentials
- **STRUCTURE.md** - Detail struktur folder & files

## 📧 Support

Untuk pertanyaan atau issue, hubungi tim DPMPTSP Lombok Barat.

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**License**: MIT
