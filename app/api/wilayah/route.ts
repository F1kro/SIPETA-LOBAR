import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { resolveMasterCoordinate } from '@/lib/wilayah-master'

export async function GET() {
  try {
    const wilayahs = await prisma.wilayah.findMany({
      orderBy: { createdAt: 'desc' },
    })
    
    // Pastikan selalu mengembalikan array meskipun kosong
    return NextResponse.json(wilayahs || [])
  } catch (error) {
    console.error("GET Wilayah Error:", error)
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validasi sederhana agar tidak error saat create
    if (!body.kecamatan || !body.desa) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 })
    }

    const kecamatan = String(body.kecamatan || '').trim()
    const desa = String(body.desa || '').trim()
    const masterPoint = resolveMasterCoordinate(kecamatan, desa)
    if (!masterPoint) {
      return NextResponse.json({ error: `Wilayah ${desa}, ${kecamatan} tidak ada pada referensi geolokasi` }, { status: 400 })
    }

    const wilayah = await prisma.wilayah.create({
      data: {
        kecamatan,
        desa,
        latitude: masterPoint.latitude,
        longitude: masterPoint.longitude,
        statusRdtr: body.statusRdtr,
        usahaSesuai: body.usahaSesuai, // String JSON dari client
        perluKajian: body.perluKajian, // String JSON dari client
        catatanRisiko: body.catatanRisiko || '',
        estimasiBiaya: body.estimasiBiaya || '',
        estimasiWaktu: body.estimasiWaktu || '',
        gambarRdtr: body.gambarRdtr || '',
      },
    })
    return NextResponse.json(wilayah, { status: 201 })
  } catch (error) {
    console.error("POST Wilayah Error:", error)
    return NextResponse.json({ error: 'Gagal membuat data' }, { status: 500 })
  }
}
