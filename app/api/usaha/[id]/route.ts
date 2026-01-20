import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

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

    // Convert BigInt to string
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

    // Check if usaha exists
    const existingUsaha = await prisma.usaha.findUnique({
      where: { id },
    })

    if (!existingUsaha) {
      return NextResponse.json({ error: 'Usaha not found' }, { status: 404 })
    }

    const usaha = await prisma.usaha.update({
      where: { id },
      data: {
        nama: body.nama,
        sektor: body.sektor,
        status: body.status,
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

    // Check if usaha exists
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