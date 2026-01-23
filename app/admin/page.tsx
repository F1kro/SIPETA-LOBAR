"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { MapPin, Map, Users, LayoutDashboard, ArrowUpRight, Info, ShieldCheck, UserCog } from "lucide-react"
import Link from "next/link"
import { getDashboardStats } from "./dashboard-action"

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ usaha: 0, wilayah: 0, admin: 0 })
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    async function loadStats() {
      const stats = await getDashboardStats()
      setCounts(stats)
      setLoading(false)
    }
    
    // Ambil role dari browser
    const savedRole = localStorage.getItem('role')?.toUpperCase()
    setRole(savedRole || 'PEGAWAI')
    
    loadStats()
  }, [])

  const isSuperAdmin = role === 'SUPERADMIN'

  // Data statistik dinamis berdasarkan Role
  const stats = [
    {
      title: "Lokasi Usaha",
      count: counts.usaha,
      label: "Total Unit Usaha",
      icon: MapPin,
      href: "/admin/usaha",
      color: "bg-blue-600",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
      show: true
    },
    {
      title: "Wilayah",
      count: counts.wilayah,
      label: "Kecamatan Terdata",
      icon: Map,
      href: "/admin/wilayah",
      color: "bg-slate-900",
      lightColor: "bg-slate-100",
      textColor: "text-slate-900",
      show: true
    },
    {
      title: "Users/Admin",
      count: counts.admin,
      label: "Pengelola Sistem",
      icon: Users,
      href: "/admin/users",
      color: "bg-blue-500",
      lightColor: "bg-blue-50",
      textColor: "text-blue-500",
      show: isSuperAdmin // Hanya muncul jika Superadmin
    },
  ]

  return (
    <div className="space-y-8 font-poppins pb-10 text-left">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <LayoutDashboard size={18} />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Management Overview</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">
            {isSuperAdmin ? "Superadmin Dashboard" : "Pegawai Dashboard"}
          </h1>
        </div>
        <div className="bg-slate-100 px-5 py-3 rounded-2xl border-2 border-slate-200">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status Server</p>
          <div className="flex items-center gap-2 justify-end mt-1">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-black text-slate-700 uppercase tracking-tight">System Online</span>
          </div>
        </div>
      </div>

      {/* Stats Grid - Menyesuaikan jumlah kolom berdasarkan role */}
      <div className={`grid grid-cols-1 ${isSuperAdmin ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
        {stats.filter(s => s.show).map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href} className="group">
              <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden group-hover:scale-[1.02] transition-all duration-300 bg-white">
                <div className="p-8">
                  <div className="flex items-start justify-between">
                    <div className={`${stat.lightColor} p-5 rounded-[1.5rem]`}>
                      <Icon className={`w-8 h-8 ${stat.textColor}`} />
                    </div>
                    <ArrowUpRight className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="mt-8">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
                      {stat.title}
                    </p>
                    <div className="flex items-baseline gap-2 mt-3">
                      <h2 className="text-5xl font-black text-slate-900 tracking-tighter">
                        {loading ? "..." : stat.count}
                      </h2>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {stat.label}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`h-2.5 w-full ${stat.color}`} />
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Info System Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-2xl rounded-[3rem] bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full -mr-40 -mt-40 blur-[80px] pointer-events-none" />
          <div className="p-10 md:p-12 relative z-10">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                    <ShieldCheck className="text-white" />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">Kendali Otoritas</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  {isSuperAdmin 
                    ? "Anda masuk sebagai pengelola tertinggi. Anda memiliki wewenang penuh atas konfigurasi user, ekspor laporan finansial, dan audit data."
                    : "Anda masuk sebagai staf operasional. Fokus utama Anda adalah pemutakhiran data lokasi usaha dan verifikasi ketersediaan RDTR wilayah."}
                </p>
                <div className="bg-white/5 border border-white/10 rounded-[1.5rem] p-5">
                  <div className="flex items-center gap-3">
                    <UserCog size={16} className="text-blue-500" />
                    <div>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Otoritas Akun</p>
                        <p className="text-base font-black uppercase tracking-tight text-white">{role}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tugas Utama Anda:</p>
                <ul className="space-y-4">
                  {(isSuperAdmin 
                    ? ["Kelola Database Investasi", "Manajemen Akun Pengguna", "Ekspor Laporan Strategis", "Audit Log Perubahan"]
                    : ["Update Lokasi Usaha Baru", "Sinkronisasi Data Wilayah", "Monitoring Potensi Daerah"]
                  ).map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-sm font-black text-slate-300 uppercase tracking-tight">
                      <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-none shadow-xl rounded-[3rem] bg-blue-600 text-white p-12 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 opacity-10 translate-x-1/4 translate-y-1/4 rotate-12 group-hover:rotate-6 transition-transform duration-500">
                <LayoutDashboard size={250} />
            </div>
            <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-3">Pusat Bantuan</h3>
                <p className="text-blue-100 text-sm font-bold mb-8 italic opacity-80 leading-relaxed">
                  "Jika terdapat kendala pada data spasial atau sinkronisasi API, segera hubungi tim IT DPMPTSP."
                </p>
                <Link href="https://wa.me/628123456789" target="_blank">
                  <button className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all w-full md:w-fit shadow-2xl active:scale-95">
                    Tiket Support
                  </button>
                </Link>
            </div>
        </Card>
      </div>
    </div>
  )
}