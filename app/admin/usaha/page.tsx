"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Edit2, 
  Trash2, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Building2, 
  Briefcase, 
  Phone, 
  Mail,
  MapPin,
  User
} from "lucide-react"

interface Usaha {
  id: string
  nama: string
  namaPemilik: string // Field Baru Sesuai Schema
  sektor: string
  status: string
  kecamatan: string
  desa: string
  nomerTelp: string
  email: string
}

export default function UsahaListPage() {
  const [usahas, setUsahas] = useState<Usaha[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  useEffect(() => {
    fetchUsahas()
  }, [])

  const fetchUsahas = async () => {
    try {
      const res = await fetch("/api/usaha")
      const data = await res.json()
      setUsahas(data)
    } catch (error) {
      console.error("Error fetching usahas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data usaha ini?")) return
    try {
      const res = await fetch(`/api/usaha/${id}`, { method: "DELETE" })
      if (res.ok) fetchUsahas()
    } catch (error) {
      console.error("Error deleting usaha:", error)
    }
  }

  // Filter Search diperluas untuk Nama Pemilik
  const filteredUsahas = usahas.filter((u) => 
    u.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.namaPemilik.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.sektor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.kecamatan.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredUsahas.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredUsahas.slice(indexOfFirstItem, indexOfLastItem)

  return (
    <div className="space-y-8 font-poppins pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Building2 size={18} />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Data Management</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            Lokasi Usaha
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-3">
            Kelola database potensi & unit usaha Kabupaten Lombok Barat
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text"
              placeholder="CARI NAMA / PEMILIK..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-11 pr-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-blue-600 transition-all w-full sm:w-64 shadow-sm"
            />
          </div>
          <Link href="/admin/usaha/tambah">
            <Button className="bg-blue-600 hover:bg-slate-900 text-white px-6 py-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 transition-all flex gap-3">
              <Plus size={18} /> Tambah Usaha
            </Button>
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white p-0">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 text-center">
              <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sinkronisasi Data...</p>
            </div>
          ) : filteredUsahas.length === 0 ? (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Search size={32} />
              </div>
              <p className="text-sm font-black text-slate-500 uppercase tracking-widest">Tidak ada data ditemukan</p>
            </div>
          ) : (
            <div className="flex flex-col">
              <table className="w-full border-separate border-spacing-0">
                <thead className="bg-slate-900 overflow-hidden text-left">
                  <tr>
                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] first:rounded-tl-[2.5rem]">
                      Informasi Usaha
                    </th>
                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Nama Pemilik
                    </th>
                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Sektor & Status
                    </th>
                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Wilayah
                    </th>
                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Detail Kontak
                    </th>
                    <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] last:rounded-tr-[2.5rem]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-left">
                  {currentItems.map((usaha) => (
                    <tr key={usaha.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 uppercase tracking-tight text-sm group-hover:text-blue-600 transition-colors">
                            {usaha.nama}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1 italic">
                            ID: {usaha.id.substring(0, 8)}...
                          </span>
                        </div>
                      </td>
                      {/* KOLOM BARU: NAMA PEMILIK */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                            <User size={14} />
                          </div>
                          <span className="text-[11px] font-black text-slate-700 uppercase">
                            {usaha.namaPemilik || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Briefcase size={12} className="text-blue-500" />
                            <span className="text-[11px] font-black text-slate-700 uppercase">{usaha.sektor}</span>
                          </div>
                          <span className={`w-fit px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                            usaha.status.toLowerCase() === "potensi" || usaha.status.toLowerCase() === "aktif"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {usaha.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-2">
                          <MapPin size={14} className="text-slate-400 mt-0.5" />
                          <div className="flex flex-col">
                            <span className="text-[11px] font-black text-slate-700 uppercase">{usaha.kecamatan}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Desa {usaha.desa}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Phone size={12} />
                            <span className="text-[11px] font-bold">{usaha.nomerTelp}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Mail size={12} />
                            <span className="text-[10px] font-medium italic">{usaha.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/usaha/${usaha.id}`}>
                            <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl border-slate-200 text-slate-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all font-black text-[10px] uppercase tracking-widest gap-2">
                              <Edit2 className="w-3 h-3" /> Edit
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(usaha.id)}
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

              {/* NAVIGASI PAGINATION */}
              <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-6 bg-slate-50 border-t border-slate-100">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 sm:mb-0 text-left">
                  Menampilkan <span className="text-slate-900">{indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredUsahas.length)}</span> Dari <span className="text-slate-900">{filteredUsahas.length}</span> Database
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
                        className={`h-10 w-10 rounded-xl font-black text-xs transition-all p-0 ${
                          currentPage === page 
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