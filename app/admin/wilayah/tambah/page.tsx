'use client'

import React, { useState } from "react"
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, Map, Globe, ShieldCheck, 
  ChevronDown, Save, Loader2, Info, 
  Clock, Wallet, X, PlusCircle, Link as LinkIcon, CheckCircle2
} from 'lucide-react'
import Link from 'next/link'

// List Statis Sektor Usaha
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
    estimasiBiaya: '',
    estimasiWaktu: '',
    gambarRdtr: '',
  })

  // State untuk Multi-select
  const [selectedUsahaSesuai, setSelectedUsahaSesuai] = useState<string[]>([])
  const [selectedPerluKajian, setSelectedPerluKajian] = useState<string[]>([])
  const [coordinates, setCoordinates] = useState('')

  const toggleSektor = (sektor: string, type: 'sesuai' | 'kajian') => {
    if (type === 'sesuai') {
      setSelectedUsahaSesuai(prev => 
        prev.includes(sektor) ? prev.filter(s => s !== sektor) : [...prev, sektor]
      )
    } else {
      setSelectedPerluKajian(prev => 
        prev.includes(sektor) ? prev.filter(s => s !== sektor) : [...prev, sektor]
      )
    }
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
      setCoordinateError('Format tidak valid')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.latitude) return alert("Koordinat wajib diisi")
    setLoading(true)

    try {
      const payload = {
        ...formData,
        usahaSesuai: JSON.stringify(selectedUsahaSesuai),
        perluKajian: JSON.stringify(selectedPerluKajian),
      }

      const res = await fetch('/api/wilayah', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) router.push('/admin/wilayah')
    } catch (error) {
      alert('Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const inputClassName = "w-full px-5 py-3 border-2 border-slate-200 rounded-2xl bg-slate-50 text-slate-900 font-bold text-sm focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm"

  return (
    <div className="font-poppins pb-10 w-full max-w-[1400px] mx-auto animate-in fade-in duration-500 space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <PlusCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Tambah Wilayah</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Database Zonasi Investasi</p>
          </div>
        </div>
        <Link href="/admin/wilayah">
          <Button variant="outline" className="border-2 border-slate-200 rounded-xl px-5 py-5 font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 hover:text-white transition-all">
            <ArrowLeft size={16} className="mr-2" /> Kembali
          </Button>
        </Link>
      </div>

      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white p-0">
        <div className="bg-slate-900 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white"><Map size={20} /></div>
            <div>
              <h2 className="text-white font-black uppercase tracking-widest text-[10px]">Formulir Wilayah</h2>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-tighter">Lengkapi Data RDTR</p>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8 bg-slate-50/30">
          <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Row 1 */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Map size={12} /> Kecamatan *</label>
                  <input type="text" required value={formData.kecamatan} onChange={(e) => setFormData({...formData, kecamatan: e.target.value})} className={inputClassName} placeholder="Nama Kecamatan" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Map size={12} /> Desa *</label>
                  <input type="text" required value={formData.desa} onChange={(e) => setFormData({...formData, desa: e.target.value})} className={inputClassName} placeholder="Nama Desa" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><ShieldCheck size={12} /> Status RDTR</label>
                  <select value={formData.statusRdtr} onChange={(e) => setFormData({...formData, statusRdtr: e.target.value})} className={inputClassName}>
                    <option value="Tersedia">Tersedia</option>
                    <option value="Proses">Proses</option>
                  </select>
                </div>

                {/* Row 2 */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Globe size={12} /> Koordinat Maps *</label>
                  <input type="text" placeholder="Paste koordinat: -8.123, 116.123" onChange={(e) => {setCoordinates(e.target.value); parseCoordinates(e.target.value)}} className={inputClassName} />
                  {formData.latitude && <p className="text-[9px] text-green-600 font-bold uppercase italic">✓ Terbaca: {formData.latitude}, {formData.longitude}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><LinkIcon size={12} /> Link G-Drive Gambar RDTR</label>
                  <input type="url" value={formData.gambarRdtr} onChange={(e) => setFormData({...formData, gambarRdtr: e.target.value})} className={inputClassName} placeholder="https://drive.google.com/..." />
                </div>

                {/* Multi Select Section */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8 py-4 border-y border-slate-50">
                  {/* Usaha Sesuai */}
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

                  {/* Perlu Kajian */}
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

                {/* Estimasi & Risiko */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Wallet size={12} /> Estimasi Biaya</label>
                  <input type="text" value={formData.estimasiBiaya} onChange={(e) => setFormData({...formData, estimasiBiaya: e.target.value})} className={inputClassName} placeholder="Rp. 5jt - 10jt" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Clock size={12} /> Estimasi Waktu</label>
                  <input type="text" value={formData.estimasiWaktu} onChange={(e) => setFormData({...formData, estimasiWaktu: e.target.value})} className={inputClassName} placeholder="14 Hari Kerja" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Info size={12} /> Catatan Risiko</label>
                  <textarea value={formData.catatanRisiko} onChange={(e) => setFormData({...formData, catatanRisiko: e.target.value})} className={inputClassName} rows={1} />
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button type="submit" disabled={loading} className="w-full md:w-80 h-14 bg-blue-600 hover:bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 transition-all">
                  {loading ? <Loader2 className="animate-spin" /> : <><Save className="mr-2" /> Simpan Wilayah</>}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Card>
    </div>
  )
}