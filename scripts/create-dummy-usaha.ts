import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'
import villages from './data/lombok-barat-villages.json'

const prisma = new PrismaClient()

type VillageSeed = {
  desa: string
  kecamatan: string
  latitude: number
  longitude: number
}

const villageData = villages as VillageSeed[]

const owners = [
  'H. Muhammad Nasir',
  'Siti Aminah',
  'I Gede Putu',
  'Ahmad Zaini',
  'Lalu Syarif',
  'Ni Made Anita',
  'Bapak Samsul',
]

const sectors = ['Pariwisata', 'Pertanian', 'Perikanan', 'Perdagangan', 'Industri']
const statuses = ['Aktif', 'Potensi', 'Non-Aktif']

const images = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534939561126-855b8675edd7?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504150559433-c4a5c3d80768?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=800&auto=format&fit=crop',
]

async function main() {
  console.log('Reset and seed database with village names from shapefile...')

  await prisma.usaha.deleteMany()
  await prisma.wilayah.deleteMany()
  await prisma.admin.deleteMany()

  const superAdminPassword = await bcrypt.hash('admin123', 10)
  const staffPassword = await bcrypt.hash('pegawai123', 10)

  const admins = [
    { email: 'admin@lobar.go.id', password: superAdminPassword, role: Role.SUPERADMIN },
    ...Array.from({ length: 10 }, (_, i) => ({
      email: `pegawai${i + 1}@lobar.go.id`,
      password: staffPassword,
      role: Role.PEGAWAI,
    })),
  ]

  await prisma.admin.createMany({ data: admins })

  await prisma.wilayah.createMany({
    data: villageData.map((v, i) => ({
      kecamatan: v.kecamatan,
      desa: v.desa,
      latitude: v.latitude,
      longitude: v.longitude,
      statusRdtr: i % 3 === 0 ? 'Tersedia' : 'Proses',
      usahaSesuai: JSON.stringify(['Pariwisata', 'Pertanian', 'Perdagangan']),
      perluKajian: JSON.stringify(['Industri Berat']),
      catatanRisiko: 'Kawasan pengembangan strategis',
      estimasiBiaya: `Rp. ${((i + 2) * 750000).toLocaleString('id-ID')}`,
      estimasiWaktu: '14 Hari Kerja',
      gambarRdtr: '',
    })),
  })

  await prisma.usaha.createMany({
    data: villageData.map((v, i) => {
      const investasi = Math.floor(100_000_000 + Math.random() * 4_900_000_000)

      return {
        nama: `Usaha ${v.desa} ${i + 1}`,
        namaPemilik: owners[i % owners.length],
        sektor: sectors[i % sectors.length],
        status: statuses[i % statuses.length],
        latitude: v.latitude,
        longitude: v.longitude,
        kecamatan: v.kecamatan,
        desa: v.desa,
        nomerTelp: `08${String(100000000 + i).slice(0, 9)}`,
        email: `usaha-${i + 1}@lobar.go.id`,
        investasi: BigInt(investasi),
        tahunBerdiri: 2008 + (i % 15),
        deskripsi: `Data usaha batch untuk wilayah ${v.desa}, Kecamatan ${v.kecamatan}.`,
        gambar: images[i % images.length],
      }
    }),
  })

  console.log(`Done. Seeded ${admins.length} admin, ${villageData.length} wilayah, ${villageData.length} usaha.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
