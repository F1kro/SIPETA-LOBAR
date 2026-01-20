import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Memulai proses seeding (Admin, Usaha, & Wilayah)...')

  // 1. CLEANUP: Hapus data lama
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
    }
  })
  console.log('✅ Admin berhasil dibuat')

  // 3. SEED WILAYAH (20 Data Desa di Lombok Barat)
  const dataWilayah = [
    {
      kecamatan: 'Sekotong',
      desa: 'Sekotong Barat',
      latitude: -8.7542,
      longitude: 115.9083,
      statusRdtr: 'Tersedia',
      usahaSesuai: JSON.stringify(['Pariwisata', 'Perikanan']),
      perluKajian: JSON.stringify(['Industri']),
      catatanRisiko: 'Kawasan konservasi mangrove',
      estimasiBiaya: 'Rp. 5.000.000 - Rp. 15.000.000',
      estimasiWaktu: '14 Hari Kerja',
      gambarRdtr: 'https://link-to-gdrive.com/rdtr-sekotong'
    },
    {
      kecamatan: 'Sekotong',
      desa: 'Pelangan',
      latitude: -8.7611,
      longitude: 115.9333,
      statusRdtr: 'Proses',
      usahaSesuai: JSON.stringify(['Pertanian', 'Pariwisata']),
      perluKajian: JSON.stringify(['Pertambangan']),
      catatanRisiko: 'Area perbukitan curam',
      estimasiBiaya: 'Rp. 3.000.000',
      estimasiWaktu: '20 Hari Kerja'
    },
    {
      kecamatan: 'Batu Layar',
      desa: 'Senggigi',
      latitude: -8.5042,
      longitude: 116.0411,
      statusRdtr: 'Tersedia',
      usahaSesuai: JSON.stringify(['Pariwisata', 'Perdagangan', 'Jasa']),
      perluKajian: JSON.stringify(['Manufaktur']),
      catatanRisiko: 'Padat lalu lintas saat musim liburan',
      estimasiBiaya: 'Rp. 10.000.000',
      estimasiWaktu: '7 Hari Kerja'
    },
    {
      kecamatan: 'Gerung',
      desa: 'Gerung Utara',
      latitude: -8.6833,
      longitude: 116.1167,
      statusRdtr: 'Tersedia',
      usahaSesuai: JSON.stringify(['Perdagangan', 'Jasa', 'Teknologi']),
      perluKajian: JSON.stringify(['Industri Berat']),
      catatanRisiko: 'Pusat pemerintahan kabupaten',
      estimasiBiaya: 'Rp. 2.500.000',
      estimasiWaktu: '5 Hari Kerja'
    },
    {
      kecamatan: 'Narmada',
      desa: 'Lembuak',
      latitude: -8.5833,
      longitude: 116.2167,
      statusRdtr: 'Tersedia',
      usahaSesuai: JSON.stringify(['Pertanian', 'Pariwisata', 'Industri']),
      perluKajian: JSON.stringify(['Perumahan Skala Besar']),
      catatanRisiko: 'Kawasan sumber mata air utama',
      estimasiBiaya: 'Rp. 4.000.000',
      estimasiWaktu: '10 Hari Kerja'
    }
  ]

  // Tambahkan data random wilayah untuk menggenapi 20
  const listKec = ['Kediri', 'Lingsar', 'Gunungsari', 'Kuripan', 'Labuapi']
  const listDesa = ['Kebun Ayu', 'Menuran', 'Dasan Baru', 'Kuripan Utara', 'Merembu', 'Perampuan', 'Terong Tawah', 'Jati Sela', 'Sigerongan', 'Gelangsar', 'Banyu Urip', 'Giri Sasak', 'Dasan Tapen', 'Suka Makmur', 'Banyumulek']

  for (let i = 0; i < 15; i++) {
    dataWilayah.push({
      kecamatan: listKec[i % listKec.length],
      desa: listDesa[i],
      latitude: -8.6 + (Math.random() * 0.2 - 0.1),
      longitude: 116.1 + (Math.random() * 0.2 - 0.1),
      statusRdtr: i % 2 === 0 ? 'Tersedia' : 'Proses',
      usahaSesuai: JSON.stringify(['Pertanian', 'Perdagangan']),
      perluKajian: JSON.stringify(['Industri']),
      catatanRisiko: 'Informasi risiko dalam tinjauan teknis',
      estimasiBiaya: 'Rp. 1.000.000 - Rp. 5.000.000',
      estimasiWaktu: '10 Hari Kerja',
      gambarRdtr: ''
    })
  }

  // Masukkan Wilayah ke DB
  for (const wilayah of dataWilayah) {
    await prisma.wilayah.create({ data: wilayah })
  }
  console.log('✅ 20 Data Wilayah berhasil dibuat')

  // 4. SEED USAHA (Kode Anda yang sudah ada)
  const dataUsaha = [
    {
      nama: 'Resort Pantai Senggigi Luxury',
      sektor: 'Pariwisata',
      status: 'Potensi',
      latitude: -8.5042,
      longitude: 116.0411,
      kecamatan: 'Batu Layar',
      desa: 'Senggigi',
      nomerTelp: '081912345678',
      email: 'info@senggigiresort.com',
      investasi: BigInt(15000000000),
      tahunBerdiri: 2015,
      gambar: 'https://picsum.photos/seed/senggigi/800/600',
      deskripsi: 'Resort mewah di bibir pantai Senggigi dengan pemandangan sunset terbaik di Lombok Barat.',
    },
    // ... (Data usaha lainnya tetap sama)
  ]

  // Tambahan loop usaha random tetap dipertahankan
  for (let i = 0; i < 15; i++) {
    const randomSektor = ['Pariwisata', 'Pertanian', 'Perikanan'][Math.floor(Math.random() * 3)]
    dataUsaha.push({
      nama: `${randomSektor} Mandiri - Project ${i + 1}`,
      sektor: randomSektor,
      status: 'Potensi',
      latitude: -8.6500 + (Math.random() * 0.1 - 0.05),
      longitude: 116.1500 + (Math.random() * 0.1 - 0.05),
      kecamatan: 'Gerung',
      desa: 'Kebun Ayu',
      nomerTelp: `081${Math.floor(Math.random() * 900000000 + 100000000)}`,
      email: `usaha${i}@lobar.go.id`,
      investasi: BigInt(Math.floor(Math.random() * 5000 + 500) * 1000000),
      tahunBerdiri: 2000 + Math.floor(Math.random() * 25),
      gambar: `https://picsum.photos/seed/projek${i}/800/600`,
      deskripsi: `Potensi investasi di wilayah Lombok Barat.`,
    })
  }

  for (const usaha of dataUsaha) {
    await prisma.usaha.create({ data: usaha })
  }

  console.log('✅ Berhasil memasukkan total data & Akun Admin!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })