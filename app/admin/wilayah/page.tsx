'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Edit2,
  Trash2,
  Plus,
  Search,
  Map,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Globe,
  Wallet
} from 'lucide-react'

interface Wilayah {
  id: string
  kecamatan: string
  desa: string
  statusRdtr: string
  latitude: number
  longitude: number
  estimasiBiaya?: string
}

export default function WilayahListPage() {
  const [wilayahs, setWilayahs] = useState<Wilayah[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  useEffect(() => {
    fetchWilayahs()
  }, [])

  const fetchWilayahs = async () => {
    try {
      const res = await fetch('/api/wilayah')
      if (!res.ok) throw new Error('Gagal mengambil data')
      const data = await res.json()
      setWilayahs(data)
    } catch (error) {
      console.error('Error fetching wilayahs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data wilayah ini?')) return

    try {
      const res = await fetch(`/api/wilayah/${id}`, { method: 'DELETE' })
      if (res.ok) fetchWilayahs()
    } catch (error) {
      console.error('Error deleting wilayah:', error)
    }
  }

  // Filter Logic
  const filteredWilayahs = wilayahs.filter((w) =>
    w.kecamatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.desa.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination Logic
  const totalPages = Math.ceil(filteredWilayahs.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredWilayahs.slice(indexOfFirstItem, indexOfLastItem)

  return (
    <div className="space-y-8 font-poppins pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Map size={18} />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Regional Mapping</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            Data Wilayah
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-3">
            Kelola zonasi RDTR dan sebaran wilayah administrasi
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="CARI KECAMATAN / DESA..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-11 pr-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-blue-600 transition-all w-full sm:w-64 shadow-sm"
            />
          </div>
          <Link href="/admin/wilayah/tambah">
            <Button className="bg-blue-600 hover:bg-slate-900 text-white px-6 py-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 transition-all flex gap-3">
              <Plus size={18} /> Tambah Wilayah
            </Button>
          </Link>
        </div>
      </div>

      {/* Table Card Section */}
      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white p-0">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center">
              <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sinkronisasi Wilayah...</p>
            </div>
          ) : filteredWilayahs.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Search size={32} />
              </div>
              <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Wilayah tidak ditemukan</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Table Section */}
              <table className="w-full border-separate border-spacing-0">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] first:rounded-tl-[2.5rem]">
                      Kecamatan
                    </th>
                    <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Desa / Kelurahan
                    </th>
                    <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Koordinat
                    </th>
                    <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Status RDTR
                    </th>
                    <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] last:rounded-tr-[2.5rem]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {currentItems.map((wilayah) => (
                    <tr key={wilayah.id} className="hover:bg-blue-50/30 transition-colors group">
                      {/* KECAMATAN */}
                      <td className="px-8 py-5">
                        <span className="font-black text-slate-900 uppercase tracking-tight text-sm group-hover:text-blue-600 transition-colors">
                          {wilayah.kecamatan}
                        </span>
                      </td>

                      {/* DESA */}
                      <td className="px-6 py-5">
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                          {wilayah.desa}
                        </span>
                      </td>

                      {/* KOORDINAT */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Globe size={14} className="text-blue-500" />
                          <span className="text-[10px] font-mono font-bold">
                            {wilayah.latitude.toFixed(4)}, {wilayah.longitude.toFixed(4)}
                          </span>
                        </div>
                      </td>

                      {/* STATUS RDTR */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          {wilayah.statusRdtr === 'Tersedia' && <ShieldCheck size={14} className="text-green-500" />}
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${wilayah.statusRdtr === 'Tersedia'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-amber-100 text-amber-700'
                            }`}>
                            {wilayah.statusRdtr}
                          </span>
                        </div>
                      </td>

                      {/* AKSI */}
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/wilayah/${wilayah.id}`}>
                            <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 text-slate-600 hover:bg-blue-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest gap-2">
                              <Edit2 className="w-3 h-3" /> Edit
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(wilayah.id)}
                            className="h-9 px-4 rounded-xl bg-slate-900 hover:bg-red-600 transition-all font-black text-[10px] uppercase tracking-widest gap-2"
                          >
                            <Trash2 className="w-3 h-3" /> Hapus
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Component */}
              <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-6 bg-slate-50 border-t border-slate-100">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 sm:mb-0">
                  Data <span className="text-slate-900">{indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredWilayahs.length)}</span> Dari <span className="text-slate-900">{filteredWilayahs.length}</span> Wilayah
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="h-10 w-10 rounded-xl border-slate-200 bg-white hover:bg-blue-600 hover:text-white transition-all p-0"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <div className="flex gap-1.5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        className={`h-10 w-10 rounded-xl font-black text-xs transition-all p-0 ${currentPage === page
                            ? "bg-blue-600 shadow-lg shadow-blue-200 border-blue-600 text-white"
                            : "bg-white border-slate-200 text-slate-400 hover:text-blue-600"
                          }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="h-10 w-10 rounded-xl border-slate-200 bg-white hover:bg-blue-600 hover:text-white transition-all p-0"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}