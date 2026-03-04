import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const sectors = await prisma.usaha.findMany({
      distinct: ['sektor'],
      select: { sektor: true },
      orderBy: { sektor: 'asc' },
    })

    return NextResponse.json({
      sectors: sectors.map((s) => s.sektor).filter(Boolean),
    })
  } catch (error) {
    console.error('Error fetching usaha meta:', error)
    return NextResponse.json({ sectors: [] }, { status: 200 })
  }
}
