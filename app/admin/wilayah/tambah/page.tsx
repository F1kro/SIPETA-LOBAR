'use client'

import React, { useState } from "react"
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, Map, Globe, ShieldCheck, 
  ChevronDown, Save, Loader2, Info, 
  Wallet, PlusCircle, Link as LinkIcon
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner' // Import library Sonner

const SEKTOR_LIST = [
  'Pariwisata', 'Pertanian', 'Perikanan', 'Peternakan', 
  'Perdagangan', 'Industri', 'Jasa', 'Manufaktur', 'Teknologi'
]

export default function TambahWilayahPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [coordinateError, setCoordinateError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    kecamatan: '',
    desa: '',
    latitude: '',
    longitude: '',
    statusRdtr: 'Tersedia',
    catatanRisiko: '',
    gambarRdtr: '',
  })

  const [sektorDetails, setSektorDetails] = useState<Record<string, { biaya: string, waktu: string }>>({})
  const [selectedUsahaSesuai, setSelectedUsahaSesuai] = useState<string[]>([])
  const [selectedPerluKajian, setSelectedPerluKajian] = useState<string[]>([])
  const [coordinates, setCoordinates] = useState('')

  const toggleSektor = (sektor: string, type: 'sesuai' | 'kajian') => {
    if (type === 'sesuai') {
      if (selectedUsahaSesuai.includes(sektor)) {
        setSelectedUsahaSesuai(prev => prev.filter(s => s !== sektor))
        const newDetails = { ...sektorDetails }
        delete newDetails[sektor]
        setSektorDetails(newDetails)
      } else {
        setSelectedUsahaSesuai(prev => [...prev, sektor])
      }
    } else {
      setSelectedPerluKajian(prev => prev.includes(sektor) ? prev.filter(s => s !== sektor) : [...prev, sektor])
    }
  }

  const handleDetailChange = (sektor: string, field: 'biaya' | 'waktu', value: string) => {
    setSektorDetails(prev => ({
      ...prev,
      [sektor]: { ...prev[sektor], [field]: value }
    }))
  }

  const parseCoordinates = (input: string) => {
    setCoordinateError(null)
    const cleaned = input.trim()
    if (!cleaned) return
    let match = cleaned.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/)
    if (!match) match = cleaned.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/)
    
    if (match) {
      setFormData(prev => ({ ...prev, latitude: match![1], longitude: match![2] }))
    } else {
      setCoordinateError('Format tidak valid (Contoh: -8.123, 116.123)')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.latitude || !formData.longitude) {
      toast.error("Koordinat Wajib Diisi", {
        description: "Silakan masukkan titik koordinat Maps yang valid."
      })
      return
    }

    setLoading(true)

    const promise = async () => {
      const payload = {
        ...formData,
        usahaSesuai: JSON.stringify(selectedUsahaSesuai),
        perluKajian: JSON.stringify(selectedPerluKajian),
        estimasiBiaya: JSON.stringify(sektorDetails), 
        estimasiWaktu: "MULTI_SECTOR_DATA"
      }

      const res = await fetch('/api/wilayah', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Gagal menyimpan data wilayah")
      }
      
      return res.json()
    }

    toast.promise(promise(), {
      loading: 'Menyimpan data wilayah baru...',
      success: () => {
        router.push('/admin/wilayah')
        return `Wilayah ${formData.desa} Berhasil Ditambahkan`
      },
      error: (err) => {
        setLoading(false)
        return `Gagal: ${err.message}`
      }
    })
  }

  const inputClassName = "w-full px-5 py-3 border-2 border-slate-200 rounded-2xl bg-slate-50 text-slate-900 font-bold text-sm focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm"

  return (
    <div className="font-poppins pb-10 w-full max-w-[1400px] mx-auto animate-in fade-in duration-500 space-y-6 text-left">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 shrink-0">
            <PlusCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Tambah Wilayah</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Database Zonasi Investasi</p>
          </div>
        </div>
        <Link href="/admin/wilayah">
          <Button variant="outline" className="border-2 border-slate-200 rounded-xl px-5 py-5 font-black uppercase tracking-widest text-[10px] hover:bg-slate-900 hover:text-white transition-all flex gap-2 shadow-sm">
            <ArrowLeft size={16} /> Kembali
          </Button>
        </Link>
      </div>

      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white p-0 text-left">
        <div className="bg-slate-900 px-8 py-6 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg"><Map size={20} /></div>
            <div className="text-left">
              <h2 className="text-white font-black uppercase tracking-widest text-[10px] md:text-xs leading-none">Formulir Pemetaan Wilayah</h2>
              <p className="text-slate-400 text-[14px] font-bold tracking-tighter mt-1 italic">Lengkapi informasi zonasi secara akurat</p>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8 bg-slate-50/30">
          <div className="w-full bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Map size={12} className="text-blue-600" /> Kecamatan *</label>
                  <input type="text" required value={formData.kecamatan} onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })} className={inputClassName} placeholder="Nama Kecamatan" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Map size={12} className="text-blue-600" /> Desa/Kelurahan *</label>
                  <input type="text" required value={formData.desa} onChange={(e) => setFormData({ ...formData, desa: e.target.value })} className={inputClassName} placeholder="Nama Desa" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><ShieldCheck size={12} className="text-blue-600" /> Status RDTR</label>
                  <div className="relative">
                    <select value={formData.statusRdtr} onChange={(e) => setFormData({ ...formData, statusRdtr: e.target.value })} className={`${inputClassName} appearance-none pr-10 font-bold`}>
                      <option value="Tersedia">TERSEDIA</option>
                      <option value="Proses">PROSES</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Globe size={12} className="text-blue-600" /> Koordinat Maps *</label>
                  <input type="text" value={coordinates} onChange={(e) => {setCoordinates(e.target.value); parseCoordinates(e.target.value)}} required placeholder="-8.123, 116.123" className={`${inputClassName} ${coordinateError ? 'border-red-500' : 'border-slate-200'}`} />
                  {coordinateError && <p className="text-[10px] font-bold text-red-500 uppercase ml-2">{coordinateError}</p>}
                  {!coordinateError && formData.latitude && <p className="text-[10px] font-bold text-green-600 uppercase ml-2 italic">✓ Terbaca: {formData.latitude}, {formData.longitude}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><LinkIcon size={12} className="text-blue-600" /> Link G-Drive Gambar RDTR</label>
                  <input type="url" value={formData.gambarRdtr} onChange={(e) => setFormData({ ...formData, gambarRdtr: e.target.value })} className={inputClassName} placeholder="https://drive.google.com/..." />
                </div>
              </div>

              <div className="lg:col-span-3 space-y-8 py-4 border-y border-slate-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Usaha Sesuai (Pilih Multiple)</label>
                    <div className="flex flex-wrap gap-2">
                      {SEKTOR_LIST.map(sektor => (
                        <button key={sektor} type="button" onClick={() => toggleSektor(sektor, 'sesuai')} 
                          className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border-2 ${selectedUsahaSesuai.includes(sektor) ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-blue-200'}`}>
                          {sektor}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Perlu Kajian (Pilih Multiple)</label>
                    <div className="flex flex-wrap gap-2">
                      {SEKTOR_LIST.map(sektor => (
                        <button key={sektor} type="button" onClick={() => toggleSektor(sektor, 'kajian')} 
                          className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border-2 ${selectedPerluKajian.includes(sektor) ? 'bg-amber-500 border-amber-500 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-amber-200'}`}>
                          {sektor}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedUsahaSesuai.length > 0 && (
                  <div className="space-y-4 animate-in slide-in-from-top-2 duration-500">
                    <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Wallet size={14} className="text-blue-600" /> Detail Perizinan Per Sektor
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedUsahaSesuai.map(sektor => (
                        <div key={sektor} className="p-6 rounded-[2rem] border-2 border-blue-50 bg-blue-50/20 space-y-4">
                          <p className="font-black text-blue-600 text-xs uppercase tracking-tighter italic">{sektor}</p>
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="Biaya (Rp)" className={inputClassName} value={sektorDetails[sektor]?.biaya || ''} onChange={(e) => handleDetailChange(sektor, 'biaya', e.target.value)} />
                            <input type="text" placeholder="Waktu (Hari)" className={inputClassName} value={sektorDetails[sektor]?.waktu || ''} onChange={(e) => handleDetailChange(sektor, 'waktu', e.target.value)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 lg:col-span-3">
                <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Info size={12} /> Catatan Risiko</label>
                <textarea value={formData.catatanRisiko} onChange={(e) => setFormData({ ...formData, catatanRisiko: e.target.value })} className={`${inputClassName} resize-none font-bold`} rows={2} />
              </div>

              <div className="flex justify-end pt-6 border-t border-slate-50">
                <Button type="submit" disabled={loading} className="w-full md:w-80 h-14 bg-blue-600 hover:bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 transition-all flex gap-3 active:scale-95">
                  {loading ? <><Loader2 className="animate-spin" size={18} /> Memproses...</> : <><Save size={18} /> Simpan Wilayah</>}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Card>
    </div>
  )
}