// import { prisma } from '@/lib/prisma'
// import { NextRequest, NextResponse } from 'next/server'
// import bcrypt from 'bcryptjs'

// export async function GET(req: NextRequest) {
//   try {
//     const admins = await prisma.admin.findMany({
//       select: {
//         id: true,
//         email: true,
//         createdAt: true,
//       },
//       orderBy: { createdAt: 'desc' },
//     })
//     return NextResponse.json(admins)
//   } catch (error) {
//     return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 })
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json()

//     // Check if email already exists
//     const existing = await prisma.admin.findUnique({
//       where: { email: body.email },
//     })

//     if (existing) {
//       return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 })
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(body.password, 10)

//     const admin = await prisma.admin.create({
//       data: {
//         email: body.email,
//         password: hashedPassword,
//       },
//       select: {
//         id: true,
//         email: true,
//         createdAt: true,
//       },
//     })

//     return NextResponse.json(admin, { status: 201 })
//   } catch (error) {
//     console.error('Error creating admin:', error)
//     return NextResponse.json({ error: 'Failed to create admin' }, { status: 500 })
//   }
// }

import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function GET(req: NextRequest) {
  try {
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        role: true, // Ambil Role
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(admins)
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const existing = await prisma.admin.findUnique({ where: { email: body.email } })
    if (existing) return NextResponse.json({ error: 'Email terdaftar' }, { status: 400 })

    const hashedPassword = await bcrypt.hash(body.password, 10)
    const admin = await prisma.admin.create({
      data: {
        email: body.email,
        password: hashedPassword,
        role: body.role, // Masukkan Role (SUPERADMIN/PEGAWAI)
      }
    })
    return NextResponse.json(admin, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}