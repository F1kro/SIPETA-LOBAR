'use client'

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, Map, Globe, ShieldCheck, 
  ChevronDown, Save, Loader2, Info, 
  Clock, Wallet, X, Edit3, Link as LinkIcon
} from 'lucide-react'
import Link from 'next/link'

// List Statis Sektor Usaha (Sama dengan Tambah Wilayah)
const SEKTOR_LIST = [
  'Pariwisata', 'Pertanian', 'Perikanan', 'Peternakan', 
  'Perdagangan', 'Industri', 'Jasa', 'Manufaktur', 'Teknologi'
]

export default function EditWilayahPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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

  // State untuk Multi-select (Konversi dari JSON string database)
  const [selectedUsahaSesuai, setSelectedUsahaSesuai] = useState<string[]>([])
  const [selectedPerluKajian, setSelectedPerluKajian] = useState<string[]>([])
  const [coordinates, setCoordinates] = useState('')

  useEffect(() => {
    fetchWilayah()
  }, [params.id])

  const fetchWilayah = async () => {
    try {
      const res = await fetch(`/api/wilayah/${params.id}`)
      if (!res.ok) throw new Error('Gagal mengambil data')
      const data = await res.json()
      
      // Sinkronisasi Form Data
      setFormData({
        kecamatan: data.kecamatan || '',
        desa: data.desa || '',
        latitude: data.latitude?.toString() || '',
        longitude: data.longitude?.toString() || '',
        statusRdtr: data.statusRdtr || 'Tersedia',
        catatanRisiko: data.catatanRisiko || '',
        estimasiBiaya: data.estimasiBiaya || '',
        estimasiWaktu: data.estimasiWaktu || '',
        gambarRdtr: data.gambarRdtr || '',
      })

      // Parse JSON Sektor ke Array State
      setSelectedUsahaSesuai(JSON.parse(data.usahaSesuai || '[]'))
      setSelectedPerluKajian(JSON.parse(data.perluKajian || '[]'))
      
      if (data.latitude && data.longitude) {
        setCoordinates(`${data.latitude}, ${data.longitude}`)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

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
    if (coordinateError || !formData.latitude) return
    setSaving(true)

    try {
      const payload = {
        ...formData,
        usahaSesuai: JSON.stringify(selectedUsahaSesuai),
        perluKajian: JSON.stringify(selectedPerluKajian),
      }

      const res = await fetch(`/api/wilayah/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) router.push('/admin/wilayah')
    } catch (error) {
      alert('Terjadi kesalahan saat menyimpan data')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sinkronisasi Data Wilayah...</p>
      </div>
    )
  }

  const inputClassName = "w-full px-5 py-3 border-2 border-slate-200 rounded-2xl bg-slate-50 text-slate-900 font-bold text-sm focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm"

  return (
    <div className="font-poppins pb-10 w-full max-w-[1400px] mx-auto animate-in fade-in duration-500 space-y-6">
      
      {/* 1. HEADER SECTION */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200 shrink-0">
            <Edit3 className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Edit Wilayah</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">ID Wilayah: {params.id?.toString().toUpperCase()}</p>
          </div>
        </div>
        <Link href="/admin/wilayah">
          <Button variant="outline" className="border-2 border-slate-200 rounded-xl px-5 py-5 font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 hover:text-white transition-all flex gap-2">
            <ArrowLeft size={16} /> Kembali
          </Button>
        </Link>
      </div>

      {/* 2. MAIN CARD */}
      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white p-0">
        <div className="bg-slate-900 px-8 py-6 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg"><Map size={20} /></div>
            <div>
              <h2 className="text-white font-black uppercase tracking-widest text-[10px]">Update Pemetaan Wilayah</h2>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-tighter mt-1 italic">Sesuaikan parameter investasi</p>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8 bg-slate-50/30">
          <div className="w-full bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Inputs Row 1 */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Map size={12} className="text-blue-600" /> Kecamatan *</label>
                  <input type="text" required value={formData.kecamatan} onChange={(e) => setFormData({...formData, kecamatan: e.target.value})} className={inputClassName} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Map size={12} className="text-blue-600" /> Desa *</label>
                  <input type="text" required value={formData.desa} onChange={(e) => setFormData({...formData, desa: e.target.value})} className={inputClassName} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><ShieldCheck size={12} className="text-blue-600" /> Status RDTR</label>
                  <div className="relative">
                    <select value={formData.statusRdtr} onChange={(e) => setFormData({...formData, statusRdtr: e.target.value})} className={`${inputClassName} appearance-none pr-10`}>
                      <option value="Tersedia">TERSEDIA</option>
                      <option value="Proses">PROSES</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Smart Coordinate Row */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Globe size={12} className="text-blue-600" /> Koordinat Lokasi (Maps) *</label>
                  <input type="text" value={coordinates} onChange={(e) => {setCoordinates(e.target.value); parseCoordinates(e.target.value)}} placeholder="-8.123, 116.123" className={`${inputClassName} ${coordinateError ? 'border-red-500' : 'border-slate-200'}`} />
                  {coordinateError && <p className="text-[10px] font-bold text-red-500 uppercase ml-2">{coordinateError}</p>}
                  {!coordinateError && formData.latitude && (
                    <p className="text-[10px] font-bold text-green-600 uppercase ml-2 italic">✓ Terbaca: {formData.latitude}, {formData.longitude}</p>
                  )}
                </div>

                {/* RDTR Link Row */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><LinkIcon size={12} className="text-blue-600" /> Link G-Drive Gambar RDTR</label>
                  <input type="url" value={formData.gambarRdtr} onChange={(e) => setFormData({...formData, gambarRdtr: e.target.value})} className={inputClassName} placeholder="https://drive.google.com/..." />
                </div>

                {/* MULTI SELECT SECTOR SECTION */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-y border-slate-50">
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

                {/* Additional Info Row */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Wallet size={12} className="text-blue-600" /> Estimasi Biaya Izin</label>
                  <input type="text" value={formData.estimasiBiaya} onChange={(e) => setFormData({...formData, estimasiBiaya: e.target.value})} className={inputClassName} placeholder="Contoh: Rp. 5jt - 10jt" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Clock size={12} className="text-blue-600" /> Estimasi Waktu</label>
                  <input type="text" value={formData.estimasiWaktu} onChange={(e) => setFormData({...formData, estimasiWaktu: e.target.value})} className={inputClassName} placeholder="Contoh: 14 hari kerja" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-2"><Info size={12} className="text-blue-600" /> Catatan Risiko Wilayah</label>
                  <textarea value={formData.catatanRisiko} onChange={(e) => setFormData({...formData, catatanRisiko: e.target.value})} className={`${inputClassName} resize-none`} rows={1} placeholder="Input catatan risiko..." />
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="flex justify-end pt-6 border-t border-slate-100">
                <Button type="submit" disabled={saving || !!coordinateError} className="w-full md:w-80 h-14 bg-blue-600 hover:bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 transition-all flex gap-3">
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Simpan Perubahan</>}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Card>
      
    </div>
  )
}