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

// GET single usaha
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const usaha = await prisma.usaha.findUnique({
      where: { id },
    })

    if (!usaha) {
      return NextResponse.json({ error: 'Usaha not found' }, { status: 404 })
    }

    // Convert BigInt to string agar tidak error saat JSON serialization
    const serializedUsaha = {
      ...usaha,
      investasi: usaha.investasi ? usaha.investasi.toString() : null,
    }

    return NextResponse.json(serializedUsaha)
  } catch (error) {
    console.error('Error fetching usaha:', error)
    return NextResponse.json({ error: 'Failed to fetch usaha' }, { status: 500 })
  }
}

// PUT update usaha
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()

    // Cek apakah data usaha ada
    const existingUsaha = await prisma.usaha.findUnique({
      where: { id },
    })

    if (!existingUsaha) {
      return NextResponse.json({ error: 'Usaha not found' }, { status: 404 })
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

    const usaha = await prisma.usaha.update({
      where: { id },
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

    // Convert BigInt to string
    const serializedUsaha = {
      ...usaha,
      investasi: usaha.investasi ? usaha.investasi.toString() : null,
    }

    return NextResponse.json(serializedUsaha)
  } catch (error: any) {
    console.error('Error updating usaha:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update usaha' },
      { status: 500 }
    )
  }
}

// DELETE usaha
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const existingUsaha = await prisma.usaha.findUnique({
      where: { id },
    })

    if (!existingUsaha) {
      return NextResponse.json({ error: 'Usaha not found' }, { status: 404 })
    }

    await prisma.usaha.delete({
      where: { id },
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Usaha deleted successfully' 
    })
  } catch (error: any) {
    console.error('Error deleting usaha:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete usaha' },
      { status: 500 }
    )
  }
}
