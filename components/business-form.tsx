'use client'

import React, { useState } from 'react'

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

  // State untuk input koordinat gabungan
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

  // Parse koordinat dari berbagai format
  const parseCoordinates = (input: string) => {
    setCoordinateError(null)
    
    const cleaned = input.trim()
    
    if (!cleaned) {
      setFormData(prev => ({ ...prev, latitude: '', longitude: '' }))
      return
    }

    // Format 1: "lat, lng" atau "lat,lng"
    let match = cleaned.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/)
    
    // Format 2: Google Maps URL
    if (!match) {
      match = cleaned.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/)
    }
    
    // Format 3: "lat lng" (spasi)
    if (!match) {
      match = cleaned.match(/^(-?\d+\.?\d*)\s+(-?\d+\.?\d*)$/)
    }

    if (match) {
      const lat = parseFloat(match[1])
      const lng = parseFloat(match[2])
      
      // Validasi range koordinat Indonesia
      if (lat >= -11 && lat <= 6 && lng >= 95 && lng <= 141) {
        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }))
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
        tahunBerdiri: formData.tahunBerdiri
          ? Number(formData.tahunBerdiri)
          : null,
      }
      

      const url = initialData?.id 
        ? `/api/usaha/${initialData.id}` 
        : '/api/usaha'
      
      const method = initialData?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Terjadi kesalahan')
      }

      if (onSuccess) onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nama Usaha *
          </label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Sektor *
          </label>
          <select
            name="sektor"
            value={formData.sektor}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          >
            <option value="">Pilih Sektor</option>
            {sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Tahun Berdiri
          </label>
          <input
            type="number"
            name="tahunBerdiri"
            value={formData.tahunBerdiri}
            onChange={handleChange}
            min="1900"
            max={new Date().getFullYear()}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* KOORDINAT - SATU INPUT SAJA */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Koordinat Lokasi (Copy dari Google Maps) *
          </label>
          <input
            type="text"
            value={coordinates}
            onChange={handleCoordinateChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
              coordinateError ? 'border-red-300' : 'border-slate-300'
            }`}
            placeholder="Format: -8.123456, 116.123456"
            required
          />
          {coordinateError && (
            <p className="mt-1 text-sm text-red-600">{coordinateError}</p>
          )}
          {formData.latitude && formData.longitude && !coordinateError && (
            <p className="mt-1 text-sm text-green-600">
              ✓ Latitude: {formData.latitude}, Longitude: {formData.longitude}
            </p>
          )}
          <p className="mt-1 text-xs text-slate-500">
            💡 Tips: Klik kanan di Google Maps → Salin koordinat, lalu paste di sini
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Kecamatan *
          </label>
          <input
            type="text"
            name="kecamatan"
            value={formData.kecamatan}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Desa *
          </label>
          <input
            type="text"
            name="desa"
            value={formData.desa}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nomor Telepon *
          </label>
          <input
            type="tel"
            name="nomerTelp"
            value={formData.nomerTelp}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="08123456789"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Investasi (Rupiah)
          </label>
          <input
            type="number"
            name="investasi"
            value={formData.investasi}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="50000000000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            URL Gambar
          </label>
          <input
            type="url"
            name="gambar"
            value={formData.gambar}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Deskripsi
        </label>
        <textarea
          name="deskripsi"
          value={formData.deskripsi}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          placeholder="Deskripsi usaha..."
        />
      </div>

      <button
        type="submit"
        disabled={loading || !!coordinateError}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Memproses...' : initialData?.id ? 'Update Usaha' : 'Tambah Usaha'}
      </button>
    </form>
  )
}