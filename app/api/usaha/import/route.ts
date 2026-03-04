import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'
import { Prisma } from '@prisma/client'
import {
  asSafeString,
  normalizeRegionText,
  parseRupiahToBigInt,
  parseYearFromDateText,
  toNullableString,
} from '@/lib/usaha-utils'

const HEADER_MAP = {
  projectId: 'Id Proyek',
  namaProyek: 'nama_proyek',
  namaPerusahaan: 'Nama Perusahaan',
  statusPenanamanModal: 'Uraian Status Penanaman Modal',
  sektorPembina: 'KL/Sektor Pembina',
  alamat: 'Alamat Usaha',
  kecamatan: 'kecamatan_usaha',
  desa: 'kelurahan_usaha',
  kbli: 'Kbli',
  judulKbli: 'Judul Kbli',
  risiko: 'Uraian Risiko Proyek',
  skala: 'Uraian Skala Usaha',
  jenisPerusahaan: 'Uraian Jenis Perusahaan',
  email: 'Email',
  telp: 'Nomor Telp',
  investasi: 'Jumlah Investasi',
  tanggalOss: 'Tanggal Terbit Oss',
  kabupaten: 'Kab Kota Usaha',
} as const
const MAX_IMPORT_ROWS = 100

const composeDescription = (row: Record<string, unknown>) => {
  const chunks = [
    `ID Proyek: ${asSafeString(row[HEADER_MAP.projectId]) || '-'}`,
    `Alamat: ${asSafeString(row[HEADER_MAP.alamat]) || '-'}`,
    `KBLI: ${asSafeString(row[HEADER_MAP.kbli]) || '-'}`,
    `Judul KBLI: ${asSafeString(row[HEADER_MAP.judulKbli]) || '-'}`,
    `Risiko: ${asSafeString(row[HEADER_MAP.risiko]) || '-'}`,
    `Skala Usaha: ${asSafeString(row[HEADER_MAP.skala]) || '-'}`,
    `Jenis Perusahaan: ${asSafeString(row[HEADER_MAP.jenisPerusahaan]) || '-'}`,
  ]
  return chunks.join('\n')
}

const sanitizePhone = (value: unknown) => {
  const raw = asSafeString(value)
  if (!raw) return '-'
  return raw.replace(/\s+/g, ' ').trim().slice(0, 20)
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const form = await req.formData()
    const file = form.get('file')
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'File .xlsx tidak ditemukan' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(Buffer.from(arrayBuffer), { type: 'buffer' })
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, { defval: '' })
    const wilayahs = await prisma.wilayah.findMany({
      select: { kecamatan: true, desa: true, latitude: true, longitude: true },
    })

    const wilayahMap = new Map<string, { latitude: number; longitude: number }>()
    wilayahs.forEach((w) => {
      wilayahMap.set(
        `${normalizeRegionText(w.kecamatan)}::${normalizeRegionText(w.desa)}`,
        { latitude: w.latitude, longitude: w.longitude },
      )
    })

    const createdData: Prisma.UsahaCreateManyInput[] = []
    const skipped: Array<{ row: number; reason: string }> = []

    for (let i = 0; i < rows.length; i++) {
      if (createdData.length >= MAX_IMPORT_ROWS) break
      const row = rows[i]

      const kabupatenUsaha = asSafeString(row[HEADER_MAP.kabupaten])
      if (kabupatenUsaha && !kabupatenUsaha.toLowerCase().includes('lombok barat')) {
        continue
      }

      const nama =
        asSafeString(row[HEADER_MAP.judulKbli]) ||
        asSafeString(row[HEADER_MAP.namaProyek]) ||
        asSafeString(row[HEADER_MAP.namaPerusahaan])
      const namaPemilik = asSafeString(row[HEADER_MAP.namaPerusahaan]) || '-'
      const sektor = asSafeString(row[HEADER_MAP.sektorPembina]) || 'Lainnya'
      const status = asSafeString(row[HEADER_MAP.statusPenanamanModal]) || 'Aktif'
      const kecamatan = asSafeString(row[HEADER_MAP.kecamatan])
      const desa = asSafeString(row[HEADER_MAP.desa])

      if (!nama || !kecamatan || !desa) {
        skipped.push({ row: i + 2, reason: 'Nama/kecamatan/desa kosong' })
        continue
      }

      const point = wilayahMap.get(
        `${normalizeRegionText(kecamatan)}::${normalizeRegionText(desa)}`,
      )
      if (!point) {
        skipped.push({ row: i + 2, reason: `Wilayah tidak cocok: ${desa}, ${kecamatan}` })
        continue
      }

      const telp = sanitizePhone(row[HEADER_MAP.telp])
      const email = asSafeString(row[HEADER_MAP.email]) || '-'
      const investasi = parseRupiahToBigInt(row[HEADER_MAP.investasi])
      const tahunBerdiri = parseYearFromDateText(row[HEADER_MAP.tanggalOss])
      const deskripsi = toNullableString(composeDescription(row))

      createdData.push({
        nama,
        namaPemilik,
        sektor,
        status,
        latitude: point.latitude,
        longitude: point.longitude,
        kecamatan,
        desa,
        nomerTelp: telp,
        email,
        deskripsi,
        gambar: null,
        investasi,
        tahunBerdiri,
      })
    }

    if (createdData.length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada data valid untuk diimport', skipped },
        { status: 400 },
      )
    }

    await prisma.usaha.deleteMany()

    const chunkSize = 100
    for (let i = 0; i < createdData.length; i += chunkSize) {
      await prisma.usaha.createMany({
        data: createdData.slice(i, i + chunkSize),
      })
    }

    return NextResponse.json({
      success: true,
      imported: createdData.length,
      maxImport: MAX_IMPORT_ROWS,
      skipped,
    })
  } catch (error: any) {
    console.error('Error importing usaha XLSX:', error)
    return NextResponse.json(
      { error: error?.message || 'Gagal import data usaha' },
      { status: 500 },
    )
  }
}
