import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@lobar.go.id'
  const password = 'admin123' // GANTI PASSWORD INI!

  console.log('🔄 Membuat admin...')

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  })

  if (existingAdmin) {
    console.log('⚠️  Admin dengan email ini sudah ada!')
    console.log('Email:', email)
    console.log('ID:', existingAdmin.id)
    return
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create admin
  const admin = await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
    },
  })

  console.log('✅ Admin berhasil dibuat!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📧 Email:', email)
  console.log('🔑 Password:', password)
  console.log('🆔 ID:', admin.id)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('⚠️  PENTING: Ganti password setelah login pertama!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })