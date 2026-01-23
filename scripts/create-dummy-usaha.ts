import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Memulai proses seeding massal (100 data per tabel)...')

  // 1. CLEANUP
  await prisma.usaha.deleteMany()
  await prisma.admin.deleteMany()
  await prisma.wilayah.deleteMany()

  // 2. SEED ADMIN (100 Akun)
  const hashedDefaultPassword = await bcrypt.hash('pegawai123', 10)
  const superAdminPassword = await bcrypt.hash('admin123', 10)

  const admins = Array.from({ length: 100 }).map((_, i) => ({
    email: i === 0 ? 'admin@lobar.go.id' : `pegawai${i}@lobar.go.id`,
    password: i === 0 ? superAdminPassword : hashedDefaultPassword,
    role: i === 0 ? Role.SUPERADMIN : Role.PEGAWAI,
  }))

  await prisma.admin.createMany({ data: admins })
  console.log('✅ 100 Data Admin berhasil dibuat.')

  // 3. SEED WILAYAH (100 Data Unik)
  const listKec = ['Gerung', 'Kediri', 'Narmada', 'Sekotong', 'Labuapi', 'Gunungsari', 'Batu Layar', 'Kuripan', 'Lingsar', 'Lembar'];
  const dataWilayah = [];
  
  for (let i = 0; i < 100; i++) {
    const kec = listKec[i % listKec.length];
    dataWilayah.push({
      kecamatan: kec,
      desa: `Desa Contoh ${i + 1}`,
      latitude: -8.6 + (Math.random() * 0.2),
      longitude: 116.1 + (Math.random() * 0.2),
      statusRdtr: i % 3 === 0 ? 'Tersedia' : 'Proses',
      usahaSesuai: JSON.stringify(['Pariwisata', 'Pertanian', 'Perdagangan']),
      perluKajian: JSON.stringify(['Industri Berat']),
      catatanRisiko: 'Kawasan pengembangan strategis',
      estimasiBiaya: `Rp. ${((i + 1) * 500000).toLocaleString('id-ID')}`,
      estimasiWaktu: '14 Hari Kerja'
    });
  }

  await prisma.wilayah.createMany({ data: dataWilayah })
  console.log('✅ 100 Data Wilayah berhasil dibuat.')

  // 4. SEED USAHA (100 Data dengan Gambar Asli)
  const listPemilik = ['H. Muhammad Nasir', 'Siti Aminah', 'I Gede Putu', 'Ahmad Zaini', 'Lalu Syarif', 'Ni Made Anita', 'Bapak Samsul'];
  const listSektor = ['Pariwisata', 'Pertanian', 'Perikanan', 'Perdagangan', 'Industri'];
  const statusUsaha = ['Aktif', 'Potensi', 'Non-Aktif'];

  const images = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534939561126-855b8675edd7?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504150559433-c4a5c3d80768?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=800&auto=format&fit=crop",
  ];

  for (let i = 0; i < 100; i++) {
    // FIX: Gunakan Math.floor agar angka menjadi bulat sebelum dikonversi ke BigInt
    const nilaiInvestasi = Math.floor(100000000 + (Math.random() * 5000000000));

    await prisma.usaha.create({
      data: {
        nama: `Unit Usaha ${i + 1} Lobar`,
        namaPemilik: listPemilik[i % listPemilik.length],
        sektor: listSektor[i % listSektor.length],
        status: statusUsaha[i % statusUsaha.length],
        latitude: -8.7 + (Math.random() * 0.3),
        longitude: 116.0 + (Math.random() * 0.3),
        kecamatan: listKec[i % listKec.length],
        desa: `Desa Contoh ${i + 1}`,
        nomerTelp: `08${Math.floor(Math.random() * 1000000000)}`,
        email: `bisnis${i + 1}@lobar.go.id`,
        investasi: BigInt(nilaiInvestasi),
        tahunBerdiri: 2010 + (i % 15),
        deskripsi: 'Deskripsi lengkap unit bisnis untuk keperluan analisis investasi daerah.',
        gambar: images[i % images.length],
      }
    });
  }
  console.log('✅ 100 Data Usaha berhasil dibuat dengan gambar valid.')
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });