'use client'

import React from "react"
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ArrowLeft, Building2, X, Save, Loader2, MapPin, Phone, 
  Mail, Globe, Calendar, Wallet, Info, ShieldCheck, 
  Image as ImageIcon, FileText, ChevronDown, Edit3, User 
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

const SECTORS = ['Pariwisata', 'Pertanian', 'Perikanan', 'Peternakan', 'Perdagangan', 'Industri', 'Jasa', 'Pendidikan', 'Kesehatan', 'Lainnya']
const STATUS_OPTIONS = ['aktif', 'nonaktif']

export default function EditUsahaPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [coordinateError, setCoordinateError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    nama: '',
    namaPemilik: '', 
    sektor: '',
    status: 'aktif',
    latitude: '',
    longitude: '',
    kecamatan: '',
    desa: '',
    nomerTelp: '',
    email: '',
    deskripsi: '',
    gambar: '',
    investasi: '',
    tahunBerdiri: '',
  })

  const [coordinates, setCoordinates] = useState('')

  useEffect(() => {
    if (params.id) fetchUsaha()
  }, [params.id])

  const fetchUsaha = async () => {
    try {
      const res = await fetch(`/api/usaha/${params.id}`)
      if (!res.ok) throw new Error("Gagal mengambil data")
      const data = await res.json()
      
      setFormData({
        nama: data.nama || '',
        namaPemilik: data.namaPemilik || '', 
        sektor: data.sektor || '',
        status: data.status || 'aktif',
        latitude: data.latitude?.toString() || '',
        longitude: data.longitude?.toString() || '',
        kecamatan: data.kecamatan || '',
        desa: data.desa || '',
        nomerTelp: data.nomerTelp || '',
        email: data.email || '',
        deskripsi: data.deskripsi || '',
        gambar: data.gambar || '',
        investasi: data.investasi || '',
        tahunBerdiri: data.tahunBerdiri || '',
      })

      if (data.latitude && data.longitude) {
        setCoordinates(`${data.latitude}, ${data.longitude}`)
      }
    } catch (error) {
      console.error('Error fetching usaha:', error)
      toast.error("Gagal Memuat Data", {
        description: "Data usaha tidak ditemukan atau terjadi kesalahan server."
      })
    } finally {
      setLoading(false)
    }
  }

  const parseCoordinates = (input: string) => {
    setCoordinateError(null)
    const cleaned = input.trim()
    if (!cleaned) {
      setFormData(prev => ({ ...prev, latitude: '', longitude: '' }))
      return
    }

    let match = cleaned.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/)
    if (!match) match = cleaned.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/)
    if (!match) match = cleaned.match(/^(-?\d+\.?\d*)\s+(-?\d+\.?\d*)$/)

    if (match) {
      const lat = parseFloat(match[1])
      const lng = parseFloat(match[2])
      if (lat >= -11 && lat <= 6 && lng >= 95 && lng <= 141) {
        setFormData(prev => ({ ...prev, latitude: lat.toString(), longitude: lng.toString() }))
        setCoordinateError(null)
      } else {
        setCoordinateError('Koordinat di luar jangkauan Indonesia')
      }
    } else {
      setCoordinateError('Format tidak valid (Contoh: -8.123, 116.123)')
    }
  }

  const handleCoordinateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCoordinates(value)
    parseCoordinates(value)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (coordinateError || !formData.latitude) {
        toast.error("Validasi Gagal", { description: "Pastikan titik koordinat sudah terisi dengan benar." })
        return
    }

    setSaving(true)

    // Menjalankan proses simpan dengan animasi toast
    const promise = async () => {
        const res = await fetch(`/api/usaha/${params.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...formData,
                latitude: Number(formData.latitude),
                longitude: Number(formData.longitude)
            }),
        })
        
        if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.error || "Gagal memperbarui data")
        }
        
        return res.json()
    }

    toast.promise(promise(), {
        loading: 'Menyimpan perubahan...',
        success: () => {
            router.push('/admin/usaha')
            router.refresh()
            return `Data ${formData.nama} Berhasil Diperbarui`
        },
        error: (err) => {
            setSaving(false)
            return `Kesalahan: ${err.message}`
        }
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sinkronisasi Data...</p>
      </div>
    )
  }

  const inputClassName = "w-full px-5 py-3 border-2 border-slate-200 rounded-2xl bg-slate-50 text-slate-900 font-bold text-sm focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm"

  return (
    <div className="font-poppins pb-10 w-full max-w-[1400px] mx-auto animate-in fade-in duration-500 text-left">
      
      <div className="flex items-center justify-between px-2 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200 shrink-0">
            <Edit3 className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Edit Usaha</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Update data lokasi usaha</p>
          </div>
        </div>
        <Link href="/admin/usaha">
          <Button variant="outline" className="border-2 border-slate-200 rounded-xl px-5 py-5 font-black uppercase tracking-widest text-[10px] hover:bg-slate-900 hover:text-white transition-all flex gap-2">
            <ArrowLeft size={16} /> Kembali
          </Button>
        </Link>
      </div>

      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white p-0">
        <div className="bg-slate-900 px-8 py-6 flex items-center justify-between relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg"><Building2 size={20} /></div>
            <div className="text-left">
              <h2 className="text-white font-black uppercase tracking-widest text-[10px] md:text-xs leading-none">Koreksi Data Unit</h2>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-tighter mt-1 italic">ID: {params.id?.toString().toUpperCase()}</p>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8 bg-slate-50/30">
          <div className="w-full bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                
                {/* Nama Usaha */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Building2 size={12} className="text-blue-600" /> Nama Usaha *</label>
                  <input type="text" name="nama" value={formData.nama} onChange={handleChange} required className={inputClassName} />
                </div>

                {/* Nama Pemilik */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><User size={12} className="text-blue-600" /> Nama Pemilik *</label>
                  <input type="text" name="namaPemilik" value={formData.namaPemilik} onChange={handleChange} required className={inputClassName} placeholder="Nama Lengkap Pemilik" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Info size={12} className="text-blue-600" /> Sektor *</label>
                  <div className="relative">
                    <select name="sektor" value={formData.sektor} onChange={handleChange} required className={`${inputClassName} appearance-none pr-10 font-bold`}>
                      <option value="">Pilih Sektor</option>
                      {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><ShieldCheck size={12} className="text-blue-600" /> Status</label>
                  <div className="relative">
                    <select name="status" value={formData.status} onChange={handleChange} className={`${inputClassName} appearance-none pr-10 font-bold`}>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Calendar size={12} className="text-blue-600" /> Tahun Berdiri</label>
                  <input type="number" name="tahunBerdiri" value={formData.tahunBerdiri} onChange={handleChange} className={inputClassName} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><MapPin size={12} className="text-blue-600" /> Kecamatan *</label>
                  <input type="text" name="kecamatan" value={formData.kecamatan} onChange={handleChange} required className={inputClassName} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><MapPin size={12} className="text-blue-600" /> Desa *</label>
                  <input type="text" name="desa" value={formData.desa} onChange={handleChange} required className={inputClassName} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Mail size={12} className="text-blue-600" /> Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClassName} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Phone size={12} className="text-blue-600" /> No. Telepon *</label>
                  <input type="tel" name="nomerTelp" value={formData.nomerTelp} onChange={handleChange} required className={inputClassName} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Wallet size={12} className="text-blue-600" /> Investasi (Rp)</label>
                  <input type="number" name="investasi" value={formData.investasi} onChange={handleChange} className={inputClassName} />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Globe size={12} className="text-blue-600" /> Koordinat Lokasi (Maps) *
                  </label>
                  <input 
                    type="text" 
                    value={coordinates} 
                    onChange={handleCoordinateChange} 
                    required 
                    placeholder="-8.123, 116.123"
                    className={`${inputClassName} ${coordinateError ? 'border-red-500' : 'border-slate-200'}`} 
                  />
                  {coordinateError && <p className="text-[10px] font-bold text-red-500 uppercase ml-2">{coordinateError}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><ImageIcon size={12} className="text-blue-600" /> URL Gambar</label>
                  <div className="flex gap-3">
                    <input type="url" name="gambar" value={formData.gambar} onChange={handleChange} className={inputClassName} placeholder="https://..." />
                    {formData.gambar && (
                      <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-slate-100 shrink-0 shadow-sm bg-slate-50">
                        <img src={formData.gambar} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "/placeholder.svg")} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-3 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><FileText size={12} className="text-blue-600" /> Deskripsi Usaha</label>
                  <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows={3} className={`${inputClassName} resize-none font-bold`} />
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-slate-100">
                <Button type="submit" disabled={saving || !!coordinateError} className="w-full md:w-80 h-14 bg-blue-600 hover:bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 transition-all flex gap-3 active:scale-95">
                  {saving ? <><Loader2 className="animate-spin" size={18} /> Menyimpan...</> : <><Save size={18} /> Simpan Perubahan</>}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Card>
    </div>
  )
}