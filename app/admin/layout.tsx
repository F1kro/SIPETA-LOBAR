'use client'

import type React from 'react'
import { AdminNavbar } from '@/components/admin/navbar'
import { AdminSidebar } from '@/components/admin/sidebar'
import { useState } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <AdminNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
        <footer className="w-full bg-white border-t border-slate-200 py-2 mt-auto">
          <div className="max-w-7xl mx-auto px-4 flex justify-center items-center">
            <div className="flex flex-col items-center gap-2">
              {/* Garis aksen kecil di atas teks agar lebih manis */}
              <div className="w-8 h-1 bg-blue-600 rounded-full mb-1" />

              <p className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] text-center leading-relaxed">
                © 2026 DPMPTSP KABUPATEN LOMBOK BARAT
              </p>

            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
