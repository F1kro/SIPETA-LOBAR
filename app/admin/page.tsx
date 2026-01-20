"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { MapPin, Map, Users, LayoutDashboard, ArrowUpRight, Info } from "lucide-react"
import Link from "next/link"
import { getDashboardStats } from "./dashboard-action"

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ usaha: 0, wilayah: 10, admin: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      const stats = await getDashboardStats()
      setCounts(stats)
      setLoading(false)
    }
    loadStats()
  }, [])

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
    },
  ]

  return (
    <div className="space-y-8 font-poppins pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <LayoutDashboard size={18} />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Overview</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
            Dashboard Admin
          </h1>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase">Status Sistem</p>
          <div className="flex items-center gap-2 justify-end">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-black text-slate-700 uppercase tracking-tight">Server Online</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href} className="group">
              <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden group-hover:scale-[1.02] transition-all duration-300">
                <div className="p-8">
                  <div className="flex items-start justify-between">
                    <div className={`${stat.lightColor} p-4 rounded-2xl`}>
                      <Icon className={`w-8 h-8 ${stat.textColor}`} />
                    </div>
                    <ArrowUpRight className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="mt-6">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">
                      {stat.title}
                    </p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
                        {loading ? "..." : stat.count}
                      </h2>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {stat.label}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`h-2 w-full ${stat.color}`} />
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Info System Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-2xl rounded-[2.5rem] bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="p-10 relative z-10">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3">
              <Info className="text-blue-500" /> Kendali Sistem
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Selamat datang di Panel Manajemen SIPETA DPMPTSP Kabupaten Lombok Barat. 
                  Anda memiliki akses penuh untuk melakukan sinkronisasi data investasi wilayah.
                </p>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Role Anda</p>
                  <p className="text-sm font-bold uppercase tracking-tight">Super Administrator</p>
                </div>
              </div>
              <ul className="space-y-3">
                {[
                  "Kelola database lokasi usaha",
                  "Update dokumen RDTR wilayah",
                  "Manajemen akses pengelola",
                  "Audit log perubahan data"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        <Card className="border-none shadow-xl rounded-[2.5rem] bg-blue-600 text-white p-10 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute bottom-0 right-0 opacity-10 translate-x-1/4 translate-y-1/4 rotate-12">
                <LayoutDashboard size={200} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Bantuan Teknis</h3>
            <p className="text-blue-100 text-sm font-bold mb-6 italic opacity-80">
              "Pastikan data koordinat latitude dan longitude diisi dengan teliti."
            </p>
            <Link href="/hubungi-kami">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all w-fit shadow-xl">
                Buka Tiket Support
              </button>
            </Link>
        </Card>
      </div>
    </div>
  )
}