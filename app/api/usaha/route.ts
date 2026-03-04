import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import {
  asSafeString,
  parseRupiahToBigInt,
  parseYearFromDateText,
  resolveWilayahCoordinate,
  toNullableString,
} from '@/lib/usaha-utils'

// GET all usaha
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const sektor = searchParams.get('sektor')
    const kecamatan = searchParams.get('kecamatan')
    const desa = searchParams.get('desa')

    const where: any = {}
    
    if (sektor) where.sektor = sektor
    if (kecamatan) where.kecamatan = kecamatan
    if (desa) where.desa = desa

    const usahas = await prisma.usaha.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    // Convert BigInt to string for JSON serialization
    const serializedUsahas = usahas.map(usaha => ({
      ...usaha,
      investasi: usaha.investasi ? usaha.investasi.toString() : null,
    }))

    return NextResponse.json(serializedUsahas)
  } catch (error) {
    console.error('Error fetching usaha:', error)
    return NextResponse.json({ error: 'Failed to fetch usaha' }, { status: 500 })
  }
}

// POST create usaha
export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const requiredFields = ['nama', 'namaPemilik', 'sektor', 'kecamatan', 'desa']

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Field ${field} wajib diisi` },
          { status: 400 }
        )
      }
    }

    const kecamatan = asSafeString(body.kecamatan)
    const desa = asSafeString(body.desa)
    const regionPoint = await resolveWilayahCoordinate(kecamatan, desa)
    if (!regionPoint) {
      return NextResponse.json(
        { error: `Wilayah tidak ditemukan untuk ${desa}, ${kecamatan}` },
        { status: 400 },
      )
    }

    const usaha = await prisma.usaha.create({
      data: {
        nama: asSafeString(body.nama),
        namaPemilik: asSafeString(body.namaPemilik),
        sektor: asSafeString(body.sektor),
        status: asSafeString(body.status) || 'Aktif',
        latitude: regionPoint.latitude,
        longitude: regionPoint.longitude,
        kecamatan,
        desa,
        nomerTelp: asSafeString(body.nomerTelp) || '-',
        email: asSafeString(body.email) || '-',
        deskripsi: toNullableString(body.deskripsi),
        gambar: toNullableString(body.gambar),
        investasi: parseRupiahToBigInt(body.investasi),
        tahunBerdiri:
          typeof body.tahunBerdiri === 'number'
            ? body.tahunBerdiri
            : parseYearFromDateText(body.tahunBerdiri),
      },
    })

    // Convert BigInt to string for JSON
    const serializedUsaha = {
      ...usaha,
      investasi: usaha.investasi ? usaha.investasi.toString() : null,
    }

    return NextResponse.json(serializedUsaha, { status: 201 })
  } catch (error: any) {
    console.error('Error creating usaha:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create usaha' },
      { status: 500 }
    )
  }
}
