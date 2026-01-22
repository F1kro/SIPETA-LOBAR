// import { prisma } from '@/lib/prisma'
// import { NextRequest, NextResponse } from 'next/server'
// import bcrypt from 'bcryptjs'

// export async function GET(
//   req: NextRequest, 
//   { params }: { params: Promise<{ id: string }> } // Gunakan Promise di sini
// ) {
//   try {
//     const { id } = await params // Await params-nya
    
//     const admin = await prisma.admin.findUnique({
//       where: { id: id },
//       select: {
//         id: true,
//         email: true,
//         createdAt: true,
//       },
//     })
    
//     if (!admin) {
//       return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
//     }
    
//     return NextResponse.json(admin)
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to fetch admin' }, { status: 500 })
//   }
// }

// export async function PUT(
//   req: NextRequest, 
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params
//     const body = await req.json()

//     let data: any = {
//       email: body.email,
//     }

//     if (body.password && body.password.trim()) {
//       data.password = await bcrypt.hash(body.password, 10)
//     }

//     const admin = await prisma.admin.update({
//       where: { id: id },
//       data,
//       select: {
//         id: true,
//         email: true,
//         createdAt: true,
//       },
//     })

//     return NextResponse.json(admin)
//   } catch (error) {
//     console.error('Error updating admin:', error)
//     return NextResponse.json({ error: 'Failed to update admin' }, { status: 500 })
//   }
// }

// export async function DELETE(
//   req: NextRequest, 
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params
    
//     await prisma.admin.delete({
//       where: { id: id },
//     })
//     return NextResponse.json({ success: true })
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 })
//   }
// }

import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function GET(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const admin = await prisma.admin.findUnique({
      where: { id: id },
      select: {
        id: true,
        email: true,
        role: true, // Tambahkan role untuk dikirim ke client
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

export async function PUT(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    // Siapkan data update dasar
    let data: any = {
      email: body.email,
      role: body.role, // Tambahkan update role sesuai schema baru
    }

    // Jika ada password baru, lakukan hashing
    if (body.password && body.password.trim()) {
      data.password = await bcrypt.hash(body.password, 10)
    }

    const admin = await prisma.admin.update({
      where: { id: id },
      data,
      select: {
        id: true,
        email: true,
        role: true, // Kembalikan data role terbaru
        createdAt: true,
      },
    })

    return NextResponse.json(admin)
  } catch (error) {
    console.error('Error updating admin:', error)
    return NextResponse.json({ error: 'Failed to update admin' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await prisma.admin.delete({
      where: { id: id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete admin' }, { status: 500 })
  }
}