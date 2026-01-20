'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MapPin, Map, Users, Home, X, ArrowLeft, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { href: '/admin', icon: Home, label: 'Dashboard' },
  { href: '/admin/usaha', icon: MapPin, label: 'Lokasi Usaha' },
  { href: '/admin/wilayah', icon: Map, label: 'Wilayah' },
  { href: '/admin/users', icon: Users, label: 'Users/Admin' },
]

export function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/60 md:hidden z-40 backdrop-blur-sm" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'w-64 bg-slate-950 text-white transition-all duration-300 flex flex-col border-r border-slate-800',
          'fixed md:relative md:translate-x-0 z-50 h-screen',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header / Logo Section */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="font-black tracking-tighter text-xl italic text-blue-500">SIPETA-LOBAR</span>
          </div>
          {/* Close Button (Mobile) */}
          <button onClick={onClose} className="md:hidden p-1.5 hover:bg-slate-800 rounded-md transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Menu Navigasi</p>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400')} />
                <span className="font-semibold text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer Section */}
        <div className="p-4 bg-slate-900/50 border-t border-slate-800">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-800 hover:bg-blue-600 rounded-xl transition-all duration-300 group shadow-inner"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300 group-hover:text-white">Halaman Utama</span>
          </Link>
          
          <div className="mt-4 flex flex-col items-center">
            <div className="h-1 w-8 bg-slate-800 rounded-full mb-3" />
            <p className="text-[10px] font-medium text-slate-600 tracking-tight">DPMPTSP LOBAR • v1.0.4</p>
          </div>
        </div>
      </aside>
    </>
  )
}