# Panduan Setup DPMPTSP Admin Panel - Local Development

## Prerequisites
- Node.js v18+ dan npm
- MySQL Server (versi 8.0+)
- Git
- Text Editor (VS Code recommended)

## Step 1: Persiapan Database MySQL

### 1.1 Install MySQL
Jika belum install MySQL, download dari: https://dev.mysql.com/downloads/mysql/

### 1.2 Buat Database
Buka MySQL Command Line atau MySQL Workbench:

```sql
CREATE DATABASE dpmptsp_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 1.3 Setup User MySQL (Optional)
```sql
CREATE USER 'dpmptsp_user'@'localhost' IDENTIFIED BY 'your_password_here';
GRANT ALL PRIVILEGES ON dpmptsp_db.* TO 'dpmptsp_user'@'localhost';
FLUSH PRIVILEGES;
```

## Step 2: Clone & Setup Project

### 2.1 Clone Repository
```bash
git clone <repo-url>
cd dpmptsp-admin-panel
```

### 2.2 Install Dependencies
```bash
npm install
```

Ini akan menginstall semua package yang diperlukan (Next.js, Prisma, Tailwind CSS, dll).

## Step 3: Setup Environment Variables

### 3.1 Edit .env.local
Buka file `.env.local` dan isi dengan data database Anda:

```env
# Database
DATABASE_URL="mysql://root:@localhost:3306/dpmptsp_db"
# Atau jika menggunakan user custom:
# DATABASE_URL="mysql://dpmptsp_user:your_password_here@localhost:3306/dpmptsp_db"

# Node Environment
NODE_ENV="development"
```

**Penjelasan:**
- `mysql://` = Database driver
- `root` = Username MySQL (atau `dpmptsp_user` jika custom)
- `:` = Pemisah username dan password
- `@localhost:3306` = Host dan port MySQL (3306 adalah default)
- `dpmptsp_db` = Nama database

## Step 4: Setup Database Schema dengan Prisma

### 4.1 Generate Prisma Client
```bash
npx prisma generate
```

### 4.2 Jalankan Migration (Push Schema ke Database)
```bash
npx prisma db push
```

Ini akan membuat semua tabel di database berdasarkan schema di `prisma/schema.prisma`.

### 4.3 Seed Database (Optional - untuk test data)
```bash
npx prisma db seed
```

Jika ingin menambah sample data, edit file `prisma/seed.ts` terlebih dahulu.

## Step 5: Jalankan Development Server

### 5.1 Start Next.js Dev Server
```bash
npm run dev
```

Output akan terlihat seperti:
```
> ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### 5.2 Akses Aplikasi
Buka browser dan akses:
- **User Dashboard**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Peta Usaha**: http://localhost:3000/peta-usaha

## Step 6: Troubleshooting

### Error: "Error connect ECONNREFUSED 127.0.0.1:3306"
**Solusi:**
- Pastikan MySQL Server berjalan
- Windows: Start MySQL dari Services
- Mac: `brew services start mysql`
- Linux: `sudo systemctl start mysql`

### Error: "Unknown database 'dpmptsp_db'"
**Solusi:**
```bash
# Cek koneksi MySQL
mysql -u root -p
# Atau dengan user custom
mysql -u dpmptsp_user -p

# Di MySQL shell:
SHOW DATABASES;
```

### Error: "P1000: Authentication failed"
**Solusi:**
- Cek DATABASE_URL di `.env.local`
- Pastikan username dan password benar
- Format harus: `mysql://username:password@localhost:3306/database_name`

### Port 3000 Sudah Terpakai
**Solusi:**
```bash
npm run dev -- -p 3001
# Akses di http://localhost:3001
```

## Step 7: Development Tips

### Lihat Database di GUI
Gunakan MySQL Workbench atau DBeaver:
1. Buka tool
2. New Connection → MySQL
3. Host: `localhost`, Port: `3306`, Username: `root` (atau custom), Password: `your_password`
4. Connect dan explore database

### Lihat Schema Prisma Visual
```bash
npx prisma studio
```
Akan membuka http://localhost:5555 untuk manage data secara visual.

### Restart Development Server
Jika ada error:
```bash
# Stop dengan Ctrl+C, kemudian:
npm run dev
```

### Rebuild Prisma Schema
Jika edit `prisma/schema.prisma`:
```bash
npx prisma generate
npx prisma db push
```

## Structure Project

```
├── app/
│   ├── admin/           # Admin panel pages
│   ├── api/             # API routes
│   ├── peta-usaha/      # Public business map
│   ├── page.tsx         # Homepage user
│   └── layout.tsx       # Root layout
├── components/
│   ├── admin/           # Admin components
│   ├── public/          # Public components
│   └── ui/              # Reusable UI components
├── lib/
│   ├── db.ts            # Prisma client
│   └── utils.ts         # Utility functions
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Sample data
└── .env.local           # Environment variables
```

## Production Deployment

### Database MySQL di Server
1. Setup MySQL di server hosting (DigitalOcean, AWS, dll)
2. Update DATABASE_URL di production env vars
3. Run `npx prisma db push` di production

### Deploy ke Vercel/Netlify
1. Push ke GitHub
2. Connect repo di Vercel/Netlify
3. Setup Environment Variables di dashboard hosting
4. Automatic deploy on push

## Useful Commands

```bash
# Development
npm run dev           # Start dev server
npm run build         # Build for production
npm run start         # Start production build
npm run lint          # Check code quality

# Database
npx prisma studio    # Open Prisma Studio GUI
npx prisma db push   # Sync schema ke database
npx prisma generate  # Generate Prisma client

# Package Management
npm install           # Install dependencies
npm update           # Update dependencies
npm outdated         # Check outdated packages
```

## Support & Debugging

Jika masih error, check:
1. MySQL running? `mysql -u root -p`
2. Database exists? `SHOW DATABASES;`
3. `.env.local` correct? Check DATABASE_URL format
4. Node version? `node -v` (harus v18+)
5. Dependencies installed? `npm install`

---

**Happy Coding! 🚀**
