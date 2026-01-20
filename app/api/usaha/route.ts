import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

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

    // Validate required fields
    const requiredFields = ['nama', 'sektor', 'latitude', 'longitude', 'kecamatan', 'desa', 'nomerTelp', 'email']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Field ${field} wajib diisi` },
          { status: 400 }
        )
      }
    }

    const usaha = await prisma.usaha.create({
      data: {
        nama: body.nama,
        sektor: body.sektor,
        status: body.status || 'Aktif',
        latitude: parseFloat(body.latitude),
        longitude: parseFloat(body.longitude),
        kecamatan: body.kecamatan,
        desa: body.desa,
        nomerTelp: body.nomerTelp,
        email: body.email,
        deskripsi: body.deskripsi || null,
        gambar: body.gambar || null,
        investasi: body.investasi ? BigInt(body.investasi) : null,
        tahunBerdiri: body.tahunBerdiri ? parseInt(body.tahunBerdiri) : null,
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