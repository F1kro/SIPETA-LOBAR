'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  Save,
  Loader2,
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Wallet,
  Info,
  ShieldCheck,
  FileText,
  ChevronDown,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface BusinessFormProps {
  initialData?: any
  onSuccess?: () => void
}

interface WilayahItem {
  id: string
  kecamatan: string
  desa: string
}

export default function BusinessForm({ initialData, onSuccess }: BusinessFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [wilayahs, setWilayahs] = useState<WilayahItem[]>([])
  const [loadingWilayah, setLoadingWilayah] = useState(true)

  const [formData, setFormData] = useState({
    nama: initialData?.nama || '',
    namaPemilik: initialData?.namaPemilik || '',
    deskripsi: initialData?.deskripsi || '',
    sektor: initialData?.sektor || '',
    status: initialData?.status || 'PMDN',
    desa: initialData?.desa || '',
    kecamatan: initialData?.kecamatan || '',
    nomerTelp: initialData?.nomerTelp || '',
    email: initialData?.email || '',
    investasi: initialData?.investasi || '',
    tahunBerdiri: initialData?.tahunBerdiri || '',
  })

  useEffect(() => {
    const loadWilayahs = async () => {
      try {
        const res = await fetch('/api/wilayah')
        const data = await res.json()
        setWilayahs(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error('Gagal load wilayah:', e)
      } finally {
        setLoadingWilayah(false)
      }
    }

    loadWilayahs()
  }, [])

  const districtOptions = useMemo(() => {
    return [...new Set(wilayahs.map((w) => w.kecamatan))].sort((a, b) => a.localeCompare(b))
  }, [wilayahs])

  const villageOptions = useMemo(() => {
    const filtered = wilayahs.filter((w) => w.kecamatan === formData.kecamatan)
    return [...new Set(filtered.map((w) => w.desa))].sort((a, b) => a.localeCompare(b))
  }, [wilayahs, formData.kecamatan])

  const sectors = [
    'Kementerian Pariwisata',
    'Kementerian Perdagangan',
    'Kementerian Perindustrian',
    'Kementerian Pekerjaan Umum',
    'Kementerian Kesehatan',
    'Kementerian Kelautan dan Perikanan',
    'Lainnya',
  ]
  const statusOptions = ['PMDN', 'PMA', 'Lainnya']

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === 'kecamatan') {
      setFormData((prev) => ({ ...prev, kecamatan: value, desa: '' }))
      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'investasi' || name === 'tahunBerdiri' ? (value === '' ? '' : Number(value)) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const promise = async () => {
      const dataToSubmit = {
        ...formData,
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
      return result
    }

    toast.promise(promise(), {
      loading: 'Menghubungkan ke server...',
      success: () => {
        if (onSuccess) onSuccess()
        return initialData?.id
          ? `Data ${formData.nama} berhasil diperbarui`
          : `Data ${formData.nama} berhasil disimpan`
      },
      error: (err) => {
        setError(err.message)
        return `Gagal: ${err.message}`
      },
      finally: () => {
        setLoading(false)
      },
    })
  }

  const inputClassName =
    'w-full px-5 py-3 border-2 border-slate-200 rounded-2xl bg-slate-50 text-slate-900 font-bold text-sm focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm'

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-left font-poppins">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-center gap-3 animate-in fade-in">
          <p className="text-red-700 text-xs font-black uppercase tracking-tight">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <Building2 size={12} className="text-blue-600" /> Nama Proyek / Usaha *
          </label>
          <input
            type="text"
            name="nama"
            placeholder="CONTOH: HOTEL PURI SENGGIGI"
            value={formData.nama}
            onChange={handleChange}
            className={inputClassName}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <User size={12} className="text-blue-600" /> Nama Perusahaan / Pemilik *
          </label>
          <input
            type="text"
            name="namaPemilik"
            placeholder="NAMA PERUSAHAAN"
            value={formData.namaPemilik}
            onChange={handleChange}
            className={inputClassName}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <Info size={12} className="text-blue-600" /> Sektor Pembina *
          </label>
          <div className="relative">
            <select
              name="sektor"
              value={formData.sektor}
              onChange={handleChange}
              className={`${inputClassName} appearance-none pr-10 font-bold`}
              required
            >
              <option value="">Pilih sektor</option>
              {sectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <ShieldCheck size={12} className="text-blue-600" /> Status Penanaman Modal
          </label>
          <div className="relative">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`${inputClassName} appearance-none pr-10 font-bold`}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <MapPin size={12} className="text-blue-600" /> Kecamatan *
          </label>
          <div className="relative">
            <select
              name="kecamatan"
              value={formData.kecamatan}
              onChange={handleChange}
              className={`${inputClassName} appearance-none pr-10 font-bold`}
              required
              disabled={loadingWilayah}
            >
              <option value="">Pilih kecamatan</option>
              {districtOptions.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <MapPin size={12} className="text-blue-600" /> Desa / Kelurahan *
          </label>
          <div className="relative">
            <select
              name="desa"
              value={formData.desa}
              onChange={handleChange}
              className={`${inputClassName} appearance-none pr-10 font-bold`}
              required
              disabled={!formData.kecamatan || loadingWilayah}
            >
              <option value="">Pilih desa</option>
              {villageOptions.map((village) => (
                <option key={village} value={village}>
                  {village}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <Mail size={12} className="text-blue-600" /> Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="email@perusahaan.com"
            value={formData.email}
            onChange={handleChange}
            className={inputClassName}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <Phone size={12} className="text-blue-600" /> Nomor Telepon
          </label>
          <input
            type="tel"
            name="nomerTelp"
            placeholder="08xxxxxxxxxx"
            value={formData.nomerTelp}
            onChange={handleChange}
            className={inputClassName}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <Wallet size={12} className="text-blue-600" /> Jumlah Investasi (Rp)
          </label>
          <input
            type="number"
            name="investasi"
            placeholder="0"
            value={formData.investasi}
            onChange={handleChange}
            className={inputClassName}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <Calendar size={12} className="text-blue-600" /> Tahun Terbit OSS / Berdiri
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

        <div className="lg:col-span-3 space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
            <FileText size={12} className="text-blue-600" /> Ringkasan Data Proyek (Alamat, KBLI, Risiko, dll)
          </label>
          <textarea
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            rows={4}
            placeholder="Masukkan ringkasan data proyek yang relevan"
            className={`${inputClassName} resize-none font-bold`}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-50">
        <Button
          type="submit"
          disabled={loading || loadingWilayah}
          className="w-full md:w-80 h-14 bg-blue-600 hover:bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 transition-all flex gap-3 active:scale-95"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Memproses...
            </>
          ) : (
            <>
              {initialData?.id ? 'Perbarui Data' : 'Simpan Data'} <Save size={18} />
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
