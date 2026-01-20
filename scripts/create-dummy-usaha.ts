import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Memulai Seeding Data Usaha dengan Tahun Berdiri...')

  await prisma.usaha.deleteMany()

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
      tahunBerdiri: 2015, // <--- Tambahin ini
      gambar: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9',
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
      tahunBerdiri: 2010, // <--- Tambahin ini
      gambar: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c',
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
      gambar: 'https://images.unsplash.com/photo-1559740703-085776d6560b',
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
      gambar: 'https://images.unsplash.com/photo-1520406853179-e331df49857b',
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
      gambar: 'https://images.unsplash.com/photo-1586528116311-ad8de3c8a50b',
      deskripsi: 'Gudang penyimpanan strategis dekat pintu masuk utama logistik pulau Lombok.',
    },
  ]

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
      tahunBerdiri: 2000 + Math.floor(Math.random() * 25), // Random tahun 2000-2025
      gambar: 'https://images.unsplash.com/photo-1521791136064-7986c2923216',
      deskripsi: `Potensi investasi di sektor ${randomSektor} di wilayah ${randomKecamatan}.`,
    })
  }

  for (const usaha of dataUsaha) {
    await prisma.usaha.create({
      data: usaha
    })
  }

  console.log('✅ Berhasil memasukkan 20 data usaha lengkap dengan tahun berdiri!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })