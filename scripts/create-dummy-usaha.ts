import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Memulai proses seeding (Admin & Usaha)...')

  // 1. CLEANUP: Hapus data lama agar tidak terjadi error duplicate saat redeploy
  // Pastikan nama model 'usaha' dan 'admin' sesuai dengan di schema.prisma kamu
  await prisma.usaha.deleteMany()
  await prisma.admin.deleteMany()

  // 2. SEED ADMIN (Menggunakan EMAIL sesuai skema database kamu)
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.admin.create({
    data: {
      id: 'cmkkkr6qi0000uadkix7dgf0k', // Manual ID atau biarkan auto-generate
      email: 'admin@lobar.go.id',
      password: hashedPassword,
    }
  })
  console.log('✅ Admin berhasil dibuat (Email: admin@lobar.go.id, Pass: admin123)')

  // 3. DATA USAHA (Source gambar menggunakan Picsum agar stabil)
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
    {
      nama: 'Perkebunan Manggis Narmada Super',
      sektor: 'Pertanian',
      status: 'Potensi',
      latitude: -8.5833,
      longitude: 116.2167,
      kecamatan: 'Narmada',
      desa: 'Lembuak',
      nomerTelp: '087812345678',
      email: 'narmada.agro@example.com',
      investasi: BigInt(2500000000),
      tahunBerdiri: 2010,
      gambar: 'https://picsum.photos/seed/narmada/800/600',
      deskripsi: 'Sentra produksi manggis kualitas ekspor dengan sistem pengairan modern dari mata air Narmada.',
    },
    {
      nama: 'Budidaya Lobster Sekotong Bay',
      sektor: 'Perikanan',
      status: 'Potensi',
      latitude: -8.7233,
      longitude: 116.0125,
      kecamatan: 'Sekotong',
      desa: 'Sekotong Barat',
      nomerTelp: '081122334455',
      email: 'lobster.sekotong@example.com',
      investasi: BigInt(4200000000),
      tahunBerdiri: 2020,
      gambar: 'https://picsum.photos/seed/sekotong/800/600',
      deskripsi: 'Area budidaya lobster air laut yang sangat potensial karena perairan yang masih murni dan tenang.',
    },
    {
      nama: 'Pusat Kerajinan Gerabah Banyumulek',
      sektor: 'Industri',
      status: 'Potensi',
      latitude: -8.6333,
      longitude: 116.1167,
      kecamatan: 'Kediri',
      desa: 'Banyumulek',
      nomerTelp: '081999887766',
      email: 'banyumulek.clay@example.com',
      investasi: BigInt(1200000000),
      tahunBerdiri: 1995,
      gambar: 'https://picsum.photos/seed/banyumulek/800/600',
      deskripsi: 'Sentra kerajinan gerabah legendaris yang sudah menembus pasar internasional.',
    },
    {
      nama: 'Gudang Logistik Pelabuhan Lembar',
      sektor: 'Jasa',
      status: 'Potensi',
      latitude: -8.7167,
      longitude: 116.0833,
      kecamatan: 'Lembar',
      desa: 'Labuan Tereng',
      nomerTelp: '081233445566',
      email: 'lembar.logistik@example.com',
      investasi: BigInt(8000000000),
      tahunBerdiri: 2018,
      gambar: 'https://picsum.photos/seed/lembar/800/600',
      deskripsi: 'Gudang penyimpanan strategis dekat pintu masuk utama logistik pulau Lombok.',
    },
  ]

  // Loop untuk membuat 15 data random tambahan
  const sektors = ['Pariwisata', 'Pertanian', 'Perikanan', 'Perdagangan', 'Industri', 'Jasa']
  const kecamatans = ['Gerung', 'Kediri', 'Narmada', 'Lingsar', 'Gunungsari', 'Batu Layar', 'Kuripan', 'Labuapi', 'Lembar', 'Sekotong']

  for (let i = 0; i < 15; i++) {
    const randomSektor = sektors[Math.floor(Math.random() * sektors.length)]
    const randomKecamatan = kecamatans[Math.floor(Math.random() * kecamatans.length)]
    
    dataUsaha.push({
      nama: `${randomSektor} Mandiri - Project ${i + 1}`,
      sektor: randomSektor,
      status: 'Potensi',
      latitude: -8.6500 + (Math.random() * 0.1 - 0.05),
      longitude: 116.1500 + (Math.random() * 0.1 - 0.05),
      kecamatan: randomKecamatan,
      desa: 'Kebun Ayu',
      nomerTelp: `081${Math.floor(Math.random() * 900000000 + 100000000)}`,
      email: `usaha${i}@lobar.go.id`,
      investasi: BigInt(Math.floor(Math.random() * 5000 + 500) * 1000000),
      tahunBerdiri: 2000 + Math.floor(Math.random() * 25),
      gambar: `https://picsum.photos/seed/projek${i}/800/600`,
      deskripsi: `Potensi investasi di sektor ${randomSektor} di wilayah ${randomKecamatan}.`,
    })
  }

  // Masukkan data ke database
  for (const usaha of dataUsaha) {
    await prisma.usaha.create({
      data: usaha
    })
  }

  console.log('✅ Berhasil memasukkan 20 data usaha & Akun Admin!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })