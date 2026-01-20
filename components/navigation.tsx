"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { MapPin, Menu, X } from "lucide-react"
import { useState } from "react"

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/cek-wilayah", label: "Cek Wilayah" },
  { href: "/peta-usaha", label: "Peta Usaha" },
  { href: "/perizinan", label: "Info Perizinan" },
  { href: "/konsultasi", label: "Konsultasi" },
  { href: "/faq", label: "FAQ" },
  { href: "/tentang", label: "Tentang" },
  { href: "/admin", label: "Admin", admin: true },
]

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Fungsi pembantu untuk cek status aktif
  const isActive = (href: string) => {
    // Menu aktif jika path cocok, ATAU jika ini menu Konsultasi dan kita sedang di Hubungi Kami
    return pathname === href || (href === "/konsultasi" && pathname === "/hubungi-kami")
  }

  return (
    <nav className="sticky top-0 z-[9999] border-b border-slate-100 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-slate-900 font-black leading-none tracking-tighter text-xl">SIPETA</span>
              <span className="text-blue-600 font-bold text-[10px] uppercase tracking-widest">Lombok Barat</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                  isActive(item.href)
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-500 hover:bg-slate-50 hover:text-blue-600",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-50"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-6 pt-2 space-y-1 animate-in fade-in slide-in-from-top-4 duration-300">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-xl text-sm font-bold transition-colors",
                  isActive(item.href)
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "text-slate-600 hover:bg-slate-50",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}