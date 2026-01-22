import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Memulai proses seeding bersih...')

  // 1. CLEANUP: Hapus semua data lama agar tidak bentrok
  await prisma.usaha.deleteMany()
  await prisma.admin.deleteMany()
  await prisma.wilayah.deleteMany()

  // 2. SEED ADMIN
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.admin.create({
    data: {
      id: 'cmkkkr6qi0000uadkix7dgf0k',
      email: 'admin@lobar.go.id',
      password: hashedPassword,
      role: Role.SUPERADMIN,
    }
  })
  console.log('✅ Admin SUPERADMIN siap.')

  // 3. SEED WILAYAH (Gunakan Map untuk memastikan keunikan)
  const wilayahMap = new Map();

  // Data Manual Utama
  const dataManual = [
    { kec: 'Sekotong', desa: 'Sekotong Barat' },
    { kec: 'Sekotong', desa: 'Pelangan' },
    { kec: 'Batu Layar', desa: 'Senggigi' },
    { kec: 'Gerung', desa: 'Gerung Utara' },
    { kec: 'Narmada', desa: 'Lembuak' },
  ];

  dataManual.forEach(item => {
    wilayahMap.set(`${item.kec}-${item.desa}`, {
      kecamatan: item.kec,
      desa: item.desa,
      latitude: -8.7 + (Math.random() * 0.1),
      longitude: 116.0 + (Math.random() * 0.1),
      statusRdtr: 'Tersedia',
      usahaSesuai: JSON.stringify(['Pariwisata', 'Perdagangan']),
      perluKajian: JSON.stringify(['Industri']),
      catatanRisiko: 'Kawasan strategis',
      estimasiBiaya: 'Rp. 5.000.000',
      estimasiWaktu: '10 Hari Kerja'
    });
  });

  // Tambah data otomatis hingga total 20 (Hanya jika belum ada di Map)
  const listKec = ['Kediri', 'Lingsar', 'Gunungsari', 'Kuripan', 'Labuapi'];
  const listDesa = ['Menuran', 'Dasan Baru', 'Kuripan Utara', 'Merembu', 'Perampuan', 'Terong Tawah', 'Jati Sela', 'Sigerongan', 'Gelangsar', 'Banyu Urip', 'Giri Sasak', 'Dasan Tapen', 'Suka Makmur', 'Banyumulek'];

  listDesa.forEach((desa, index) => {
    const kec = listKec[index % listKec.length];
    const key = `${kec}-${desa}`;
    if (!wilayahMap.has(key) && wilayahMap.size < 20) {
      wilayahMap.set(key, {
        kecamatan: kec,
        desa: desa,
        latitude: -8.6 + (Math.random() * 0.1),
        longitude: 116.1 + (Math.random() * 0.1),
        statusRdtr: index % 2 === 0 ? 'Tersedia' : 'Proses',
        usahaSesuai: JSON.stringify(['Pertanian']),
        perluKajian: JSON.stringify(['Industri']),
        catatanRisiko: 'Dalam tinjauan teknis',
        estimasiBiaya: 'Rp. 2.000.000',
        estimasiWaktu: '14 Hari Kerja'
      });
    }
  });

  for (const data of wilayahMap.values()) {
    await prisma.wilayah.create({ data });
  }
  console.log(`✅ ${wilayahMap.size} Data Wilayah unik berhasil dibuat.`);

  // 4. SEED USAHA (Gunakan namaPemilik)
  const listPemilik = ['H. Muhammad Nasir', 'Siti Aminah', 'I Gede Putu', 'Ahmad Zaini', 'Lalu Syarif'];
  
  for (let i = 0; i < 15; i++) {
    await prisma.usaha.create({
      data: {
        nama: `Project Investasi ${i + 1}`,
        namaPemilik: listPemilik[i % listPemilik.length],
        sektor: i % 2 === 0 ? 'Pariwisata' : 'Pertanian',
        status: 'Potensi',
        latitude: -8.5 + (Math.random() * 0.3),
        longitude: 116.0 + (Math.random() * 0.2),
        kecamatan: 'Gerung',
        desa: 'Gerung Utara',
        nomerTelp: `081234567${i}`,
        email: `investor${i}@example.com`,
        investasi: BigInt(500000000 + (i * 100000000)),
        tahunBerdiri: 2020 + (i % 5),
        deskripsi: 'Lokasi strategis untuk pengembangan usaha.',
      }
    });
  }
  console.log('✅ 15 Data Usaha berhasil dibuat.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });