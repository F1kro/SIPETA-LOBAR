import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const wilayah = await prisma.wilayah.findUnique({
      where: { id: params.id },
    })
    if (!wilayah) {
      return NextResponse.json({ error: 'Wilayah not found' }, { status: 404 })
    }
    return NextResponse.json(wilayah)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch wilayah' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const wilayah = await prisma.wilayah.update({
      where: { id: params.id },
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
    return NextResponse.json(wilayah)
  } catch (error) {
    console.error('Error updating wilayah:', error)
    return NextResponse.json({ error: 'Failed to update wilayah' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.wilayah.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete wilayah' }, { status: 500 })
  }
}
