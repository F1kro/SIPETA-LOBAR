import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    })
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }
    return NextResponse.json(admin)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admin' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()

    // If password is being updated, hash it
    let data: any = {
      email: body.email,
    }

    if (body.password && body.password.trim()) {
      data.password = await bcrypt.hash(body.password, 10)
    }

    const admin = await prisma.admin.update({
      where: { id: params.id },
      data,
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    })

    return NextResponse.json(admin)
  } catch (error) {
    console.error('Error updating admin:', error)
    return NextResponse.json({ error: 'Failed to update admin' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.admin.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 })
  }
}
