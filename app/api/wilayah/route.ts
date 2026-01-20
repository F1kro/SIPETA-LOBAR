import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const wilayahs = await prisma.wilayah.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(wilayahs)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch wilayah' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const wilayah = await prisma.wilayah.create({
      data: {
        kecamatan: body.kecamatan,
        desa: body.desa,
        statusRdtr: body.statusRdtr,
        usahaSesuai: body.usahaSesuai,
        perluKajian: body.perluKajian,
        catatanRisiko: body.catatanRisiko || '',
        gambarRdtr: body.gambarRdtr,
      },
    })
    return NextResponse.json(wilayah, { status: 201 })
  } catch (error) {
    console.error('Error creating wilayah:', error)
    return NextResponse.json({ error: 'Failed to create wilayah' }, { status: 500 })
  }
}
