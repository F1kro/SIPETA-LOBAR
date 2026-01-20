import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

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

    const wilayah = await prisma.wilayah.create({
      data: {
        kecamatan: body.kecamatan,
        desa: body.desa,
        latitude: parseFloat(body.latitude) || 0,
        longitude: parseFloat(body.longitude) || 0,
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