"use server"

import { prisma } from "@/lib/prisma"

export async function getDashboardStats() {
  try {
    // Mengambil data real dari database
    const [usahaCount, adminCount, wilayahCount] = await Promise.all([
      prisma.usaha.count(),
      prisma.admin.count(),
      prisma.wilayah.count(),
    ])

    return {
      usaha: usahaCount,
      wilayah: wilayahCount, // Statis untuk 10 kecamatan di Lobar
      admin: adminCount,
    }
  } catch (error) {
    console.error("Gagal mengambil statistik:", error)
    return { usaha: 0, wilayah: 0, admin: 0 }
  }
}