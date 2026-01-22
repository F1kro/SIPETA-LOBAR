"use client"

import { useState, useEffect, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  FileDown, 
  MapPin, 
  Briefcase, 
  Loader2, 
  Search, 
  Map as MapIcon, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2,
  Globe,
  User,
  Phone,
  Mail,
  ShieldCheck,
  Building2
} from "lucide-react"
import * as XLSX from "xlsx"

export default function LaporanAdminPage() {
  const [dataUsaha, setDataUsaha] = useState([])
  const [dataWilayah, setDataWilayah] = useState([])
  const [loading, setLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  const [filterKecamatan, setFilterKecamatan] = useState("")
  const [filterDesa, setFilterDesa] = useState("")
  const [filterSektor, setFilterSektor] = useState("")
  const [activeTab, setActiveTab] = useState<'usaha' | 'wilayah'>('usaha')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resUsaha, resWilayah] = await Promise.all([
          fetch('/api/usaha'),
          fetch('/api/wilayah')
        ])
        setDataUsaha(await resUsaha.json())
        setDataWilayah(await resWilayah.json())
      } catch (error) {
        console.error("Gagal fetch data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [filterKecamatan, filterDesa, filterSektor, activeTab])

  const filteredData = useMemo(() => {
    if (activeTab === 'usaha') {
      return dataUsaha.filter((u: any) => 
        (filterKecamatan === "" || u.kecamatan === filterKecamatan) &&
        (filterDesa === "" || u.desa.toLowerCase().includes(filterDesa.toLowerCase())) &&
        (filterSektor === "" || u.sektor === filterSektor)
      )
    } else {
      return dataWilayah.filter((w: any) => 
        (filterKecamatan === "" || w.kecamatan === filterKecamatan) &&
        (filterDesa === "" || w.desa.toLowerCase().includes(filterDesa.toLowerCase()))
      )
    }
  }, [dataUsaha, dataWilayah, filterKecamatan, filterDesa, filterSektor, activeTab])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const listKecamatan = Array.from(new Set(dataWilayah.map((w: any) => w.kecamatan))).sort()
  const listSektor = Array.from(new Set(dataUsaha.map((u: any) => u.sektor))).sort()

  const handleExport = (type: 'usaha' | 'wilayah') => {
    setIsExporting(true)
    const wb = XLSX.utils.book_new()
    let ws;

    if (type === 'usaha') {
      const dataToExport = filteredData.map((u: any) => ({
        "NAMA USAHA": u.nama.toUpperCase(),
        "SEKTOR": u.sektor,
        "INVESTASI (IDR)": Number(u.investasi),
        "STATUS": u.status,
        "ALAMAT LENGKAP": `${u.desa}, Kec. ${u.kecamatan}, Kab. Lombok Barat`,
        "TAHUN BERDIRI": u.tahunBerdiri || "-",
        "NAMA PEMILIK": u.namaPemilik || "-",
        "KONTAK": u.nomerTelp || "-",
        "EMAIL": u.email || "-",
        "LATITUDE": u.latitude,
        "LONGITUDE": u.longitude
      }))
      ws = XLSX.utils.json_to_sheet(dataToExport)
      XLSX.utils.book_append_sheet(wb, ws, "Database Usaha")
    } else {
      const dataToExport = filteredData.map((w: any) => ({
        "KECAMATAN": w.kecamatan.toUpperCase(),
        "DESA": w.desa.toUpperCase(),
        "STATUS RDTR": w.statusRdtr,
        "REKOMENDASI USAHA": JSON.parse(w.usahaSesuai || '[]').join(", "),
        "RISIKO": w.catatanRisiko || "-",
        "KOORDINAT": `${w.latitude}, ${w.longitude}`
      }))
      ws = XLSX.utils.json_to_sheet(dataToExport)
      XLSX.utils.book_append_sheet(wb, ws, "Database Wilayah")
    }

    XLSX.writeFile(wb, `REKAP_${type.toUpperCase()}_LOBAR.xlsx`)
    setIsExporting(false)
  }

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={48} /></div>

  return (
    <div className="font-poppins space-y-8 pb-20 animate-in fade-in duration-500 text-left mt-[-1rem]">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Building2 size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Strategic Report</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            Laporan Strategis
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-3">
             Rekapitulasi Data Investasi & Pemetaan Wilayah Lombok Barat
          </p>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-200 shadow-sm">
          <button onClick={() => setActiveTab('usaha')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'usaha' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Data Usaha</button>
          <button onClick={() => setActiveTab('wilayah')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'wilayah' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500'}`}>Data Wilayah</button>
        </div>
      </div>

      {/* FILTER BOX */}
      <Card className="border-none shadow-2xl rounded-[2.5rem] p-8 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Filter Kecamatan</label>
            <select value={filterKecamatan} onChange={(e) => setFilterKecamatan(e.target.value)} className="w-full px-5 py-3 bg-white border-2 border-slate-100 rounded-2xl text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-blue-600 transition-all shadow-sm">
              <option value="">SEMUA KECAMATAN</option>
              {listKecamatan.map(k => <option key={k} value={k}>{k.toUpperCase()}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Pencarian Desa</label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input type="text" placeholder="CARI NAMA DESA..." value={filterDesa} onChange={(e) => setFilterDesa(e.target.value)} className="pl-11 pr-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-blue-600 transition-all w-full shadow-sm" />
            </div>
          </div>
          {activeTab === 'usaha' && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Filter Sektor</label>
              <select value={filterSektor} onChange={(e) => setFilterSektor(e.target.value)} className="w-full px-5 py-3 bg-white border-2 border-slate-100 rounded-2xl text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-blue-600 transition-all shadow-sm">
                <option value="">SEMUA SEKTOR</option>
                {listSektor.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
              </select>
            </div>
          )}
        </div>
      </Card>

      {/* ACTION BOX */}
      <Card className="border-none shadow-2xl rounded-[2.5rem] p-6 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
            {activeTab === 'usaha' ? <Briefcase size={24} /> : <MapIcon size={24} />}
          </div>
          <div className="text-left">
            <h2 className="text-slate-900 font-black uppercase text-base tracking-tighter leading-none">Export Data Rekapitulasi</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1.5">{filteredData.length} Baris data ditemukan</p>
          </div>
        </div>
        <Button onClick={() => handleExport(activeTab)} disabled={isExporting} className="bg-blue-600 hover:bg-slate-900 text-white px-8 h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-200 transition-all flex gap-3 w-full sm:w-auto active:scale-95">
          {isExporting ? <Loader2 className="animate-spin" size={16} /> : <><FileDown size={18} /> Download Excel (.xlsx)</>}
        </Button>
      </Card>

      {/* TABLE SECTION - TIRU MENU USAHA & WILAYAH */}
      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead className="bg-slate-900">
              {activeTab === 'usaha' ? (
                /* Header Identik Menu Usaha */
                <tr>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] first:rounded-tl-[2.5rem]">Informasi Usaha</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nama Pemilik</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sektor & Status</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Wilayah</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] last:rounded-tr-[2.5rem]">Detail Kontak</th>
                </tr>
              ) : (
                /* Header Identik Menu Wilayah */
                <tr>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] first:rounded-tl-[2.5rem]">Kecamatan</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Desa / Kelurahan</th>
                  <th className="px-6 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Koordinat</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] last:rounded-tr-[2.5rem]">Status RDTR</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedData.map((item: any, idx: number) => (
                <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                  {activeTab === 'usaha' ? (
                    /* Body Identik Menu Usaha */
                    <>
                      <td className="px-8 py-5 text-left">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 uppercase tracking-tight text-sm group-hover:text-blue-600 transition-colors">{item.nama}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1 italic">ID: {item.id.substring(0, 8)}...</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-left">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><User size={14} /></div>
                          <span className="text-[11px] font-black text-slate-700 uppercase">{item.namaPemilik || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-left">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Briefcase size={12} className="text-blue-500" />
                            <span className="text-[11px] font-black text-slate-700 uppercase">{item.sektor}</span>
                          </div>
                          <span className="w-fit px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-blue-100 text-blue-700">{item.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-left">
                        <div className="flex items-start gap-2">
                          <MapPin size={14} className="text-slate-400 mt-0.5" />
                          <div className="flex flex-col">
                            <span className="text-[11px] font-black text-slate-700 uppercase">{item.kecamatan}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Desa {item.desa}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-left">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-600"><Phone size={12} /><span className="text-[11px] font-bold">{item.nomerTelp}</span></div>
                          <div className="flex items-center gap-2 text-slate-400"><Mail size={12} /><span className="text-[10px] font-medium italic">{item.email}</span></div>
                        </div>
                      </td>
                    </>
                  ) : (
                    /* Body Identik Menu Wilayah */
                    <>
                      <td className="px-8 py-5 text-left">
                        <span className="font-black text-slate-900 uppercase tracking-tight text-sm group-hover:text-blue-600 transition-colors">{item.kecamatan}</span>
                      </td>
                      <td className="px-6 py-5 text-left">
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{item.desa}</span>
                      </td>
                      <td className="px-6 py-5 text-left">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Globe size={14} className="text-blue-500" />
                          <span className="text-[10px] font-mono font-bold">{item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-left">
                        <div className="flex items-center gap-2">
                          {item.statusRdtr === 'Tersedia' && <ShieldCheck size={14} className="text-green-500" />}
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${item.statusRdtr === 'Tersedia' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{item.statusRdtr}</span>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION IDENTIK */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-6 bg-slate-50 border-t border-slate-100">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 sm:mb-0 text-left">
             Halaman <span className="text-slate-900">{currentPage}</span> Dari <span className="text-slate-900">{totalPages || 1}</span> Database
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-10 w-10 rounded-xl border-slate-200 bg-white hover:bg-blue-600 hover:text-white transition-all p-0" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}><ChevronLeft className="w-4 h-4" /></Button>
            <div className="flex gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button key={page} variant={currentPage === page ? "default" : "outline"} className={`h-10 w-10 rounded-xl font-black text-xs transition-all p-0 ${currentPage === page ? "bg-blue-600 shadow-lg border-blue-600 text-white" : "bg-white border-slate-200 text-slate-400 hover:text-blue-600"}`} onClick={() => setCurrentPage(page)}>{page}</Button>
              ))}
            </div>
            <Button variant="outline" className="h-10 w-10 rounded-xl border-slate-200 bg-white hover:bg-blue-600 hover:text-white transition-all p-0" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0}><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      </Card>
    </div>
  )
}