import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function setSession(userId: string, email: string) {
  const cookieStore = await cookies()
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  
  // Simpan userId sebagai cookie
  cookieStore.set('userId', userId, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
  
  cookieStore.set('userEmail', email, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

export async function getSession() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  const userEmail = cookieStore.get('userEmail')?.value
  
  if (!userId || !userEmail) {
    return null
  }
  
  // Verifikasi user masih ada di database
  const admin = await prisma.admin.findUnique({
    where: { id: userId },
  })
  
  if (!admin) {
    return null
  }
  
  return {
    userId,
    email: userEmail,
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('userId')
  cookieStore.delete('userEmail')
}

export function checkSession(request: Request) {
  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=')
    acc[key] = value
    return acc
  }, {} as Record<string, string>)
  
  return cookies['userId'] && cookies['userEmail']
}