# Quick Start - 5 Menit Setup

## 1️⃣ Pastikan MySQL Berjalan
```bash
# Windows: Mulai dari Services atau:
net start MySQL80

# Mac:
brew services start mysql

# Linux:
sudo systemctl start mysql
```

## 2️⃣ Buat Database
```bash
mysql -u root -p
# Masukkan password jika ada, kemudian:
CREATE DATABASE dpmptsp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

## 3️⃣ Copy & Setup Project
```bash
# Jika belum clone:
git clone <repo-url>
cd dpmptsp-admin-panel

# Install dependencies:
npm install
```

## 4️⃣ Setup Environment
```bash
# Copy template:
cp .env.local.example .env.local

# Edit .env.local dengan DATABASE_URL yang sesuai
# Contoh (default):
# DATABASE_URL="mysql://root:@localhost:3306/dpmptsp_db"
```

## 5️⃣ Setup Database & Jalankan
```bash
# Push schema ke database:
npx prisma db push

# Start development server:
npm run dev
```

## ✅ Done!
- User Dashboard: http://localhost:3000
- Admin Panel: http://localhost:3000/admin
- Peta Usaha: http://localhost:3000/peta-usaha

---

**Jika ada error, lihat SETUP_LOCAL.md untuk troubleshooting lengkap**
