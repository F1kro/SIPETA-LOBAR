'use client'

import React, { useState } from 'react'
import { 
  Save, Loader2, Building2, MapPin, Phone, 
  Mail, Globe, Calendar, Wallet, Info, 
  ShieldCheck, Image as ImageIcon, FileText, ChevronDown, User 
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BusinessFormProps {
  initialData?: any
  onSuccess?: () => void
}

export default function BusinessForm({ initialData, onSuccess }: BusinessFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [coordinateError, setCoordinateError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    nama: initialData?.nama || '',
    namaPemilik: initialData?.namaPemilik || '', // Field Baru
    deskripsi: initialData?.deskripsi || '',
    sektor: initialData?.sektor || '',
    status: initialData?.status || 'Aktif',
    latitude: initialData?.latitude || '',
    longitude: initialData?.longitude || '',
    desa: initialData?.desa || '',
    kecamatan: initialData?.kecamatan || '',
    nomerTelp: initialData?.nomerTelp || '',
    email: initialData?.email || '',
    gambar: initialData?.gambar || '',
    investasi: initialData?.investasi || '',
    tahunBerdiri: initialData?.tahunBerdiri || new Date().getFullYear(),
  })

  const [coordinates, setCoordinates] = useState(
    initialData?.latitude && initialData?.longitude 
      ? `${initialData.latitude}, ${initialData.longitude}` 
      : ''
  )

  const sectors = ['Pariwisata', 'Pertanian', 'Kerajinan', 'Perikanan', 'Perdagangan', 'Manufaktur', 'Teknologi', 'Jasa']
  const statusOptions = ['Aktif', 'Non-Aktif', 'Dalam Pengembangan']

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'investasi' || name === 'tahunBerdiri' 
        ? (value === '' ? '' : Number(value)) 
        : value,
    }))
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
        setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }))
        setCoordinateError(null)
      } else {
        setCoordinateError('Koordinat di luar jangkauan Indonesia')
      }
    } else {
      setCoordinateError('Format tidak valid. Contoh: -8.7833, 116.2333')
    }
  }

  const handleCoordinateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCoordinates(value)
    parseCoordinates(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    if (!formData.latitude || !formData.longitude) {
      setError('Koordinat lokasi wajib diisi')
      setLoading(false)
      return
    }

    try {
      const dataToSubmit = {
        ...formData,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        investasi: formData.investasi ? String(formData.investasi) : null,
        tahunBerdiri: formData.tahunBerdiri ? Number(formData.tahunBerdiri) : null,
      }
      
      const url = initialData?.id ? `/api/usaha/${initialData.id}` : '/api/usaha'
      const method = initialData?.id ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      })
      
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Terjadi kesalahan')
      
      if (onSuccess) onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClassName = "w-full px-5 py-3 border-2 border-slate-200 rounded-2xl bg-slate-50 text-slate-900 font-bold text-sm focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm"

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-left font-poppins">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3 animate-in fade-in">
          <p className="text-red-700 text-xs font-black uppercase tracking-tight">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Nama Usaha */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <Building2 size={12} className="text-blue-600" /> Nama Usaha *
          </label>
          <input
            type="text"
            name="nama"
            placeholder="CONTOH: RESORT SENGGIGI"
            value={formData.nama}
            onChange={handleChange}
            className={inputClassName}
            required
          />
        </div>

        {/* Nama Pemilik (BARU) */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <User size={12} className="text-blue-600" /> Nama Pemilik / Direktur *
          </label>
          <input
            type="text"
            name="namaPemilik"
            placeholder="NAMA LENGKAP PEMILIK"
            value={formData.namaPemilik}
            onChange={handleChange}
            className={inputClassName}
            required
          />
        </div>

        {/* Sektor */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <Info size={12} className="text-blue-600" /> Sektor *
          </label>
          <div className="relative">
            <select
              name="sektor"
              value={formData.sektor}
              onChange={handleChange}
              className={`${inputClassName} appearance-none pr-10 font-bold`}
              required
            >
              <option value="">Pilih Sektor</option>
              {sectors.map((sector) => <option key={sector} value={sector}>{sector}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <ShieldCheck size={12} className="text-blue-600" /> Status
          </label>
          <div className="relative">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`${inputClassName} appearance-none pr-10 font-bold`}
            >
              {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Tahun Berdiri */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <Calendar size={12} className="text-blue-600" /> Tahun Berdiri
          </label>
          <input
            type="number"
            name="tahunBerdiri"
            value={formData.tahunBerdiri}
            onChange={handleChange}
            min="1900"
            max={new Date().getFullYear()}
            className={inputClassName}
          />
        </div>

        {/* Kecamatan */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <MapPin size={12} className="text-blue-600" /> Kecamatan *
          </label>
          <input
            type="text"
            name="kecamatan"
            placeholder="MASUKKAN KECAMATAN"
            value={formData.kecamatan}
            onChange={handleChange}
            className={inputClassName}
            required
          />
        </div>

        {/* Desa */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <MapPin size={12} className="text-blue-600" /> Desa *
          </label>
          <input
            type="text"
            name="desa"
            placeholder="MASUKKAN DESA"
            value={formData.desa}
            onChange={handleChange}
            className={inputClassName}
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <Mail size={12} className="text-blue-600" /> Email *
          </label>
          <input
            type="email"
            name="email"
            placeholder="admin@bisnis.com"
            value={formData.email}
            onChange={handleChange}
            className={inputClassName}
            required
          />
        </div>

        {/* Nomor Telepon */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <Phone size={12} className="text-blue-600" /> Nomor Telepon *
          </label>
          <input
            type="tel"
            name="nomerTelp"
            placeholder="081XXXXXXX"
            value={formData.nomerTelp}
            onChange={handleChange}
            className={inputClassName}
            required
          />
        </div>

        {/* Investasi */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <Wallet size={12} className="text-blue-600" /> Investasi (Rupiah)
          </label>
          <input
            type="number"
            name="investasi"
            placeholder="JUMLAH DALAM RUPIAH"
            value={formData.investasi}
            onChange={handleChange}
            className={inputClassName}
          />
        </div>

        {/* Koordinat */}
        <div className="md:col-span-2 lg:col-span-2 space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <Globe size={12} className="text-blue-600" /> Koordinat (Google Maps) *
          </label>
          <input
            type="text"
            value={coordinates}
            onChange={handleCoordinateChange}
            className={`w-full px-5 py-3 border-2 rounded-2xl bg-slate-50 text-slate-900 font-bold text-sm focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm ${
              coordinateError ? 'border-red-500' : 'border-slate-200'
            }`}
            placeholder="Contoh: -8.123, 116.123"
            required
          />
          {coordinateError && <p className="text-[10px] font-bold text-red-500 uppercase ml-2">{coordinateError}</p>}
          {formData.latitude && !coordinateError && (
            <p className="text-[10px] font-bold text-green-600 uppercase ml-2 italic">✓ Terbaca: {formData.latitude}, {formData.longitude}</p>
          )}
        </div>

        {/* URL Gambar */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <ImageIcon size={12} className="text-blue-600" /> URL Gambar Usaha
          </label>
          <input
            type="url"
            name="gambar"
            placeholder="https://..."
            value={formData.gambar}
            onChange={handleChange}
            className={inputClassName}
          />
        </div>

        {/* Deskripsi */}
        <div className="lg:col-span-3 space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <FileText size={12} className="text-blue-600" /> Deskripsi Usaha
          </label>
          <textarea
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            rows={3}
            placeholder="Ceritakan singkat tentang unit usaha ini..."
            className={`${inputClassName} resize-none font-bold`}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-50">
        <Button
          type="submit"
          disabled={loading || !!coordinateError}
          className="w-full md:w-80 h-14 bg-blue-600 hover:bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 transition-all flex gap-3 active:scale-95"
        >
          {loading ? (
            <><Loader2 className="animate-spin" size={18} /> Memproses...</>
          ) : (
            <>{initialData?.id ? 'Perbarui Data' : 'Simpan Database'} <Save size={18} /></>
          )}
        </Button>
      </div>
    </form>
  )
}