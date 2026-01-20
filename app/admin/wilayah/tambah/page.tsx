'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function TambahWilayahPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    kecamatan: '',
    desa: '',
    latitude: '',
    longitude: '',
    statusRdtr: 'Tersedia',
    usahaSesuai: JSON.stringify(['Pariwisata', 'Pertanian'], null, 2),
    perluKajian: JSON.stringify(['Industri'], null, 2),
    catatanRisiko: '',
    estimasiBiaya: '',
    estimasiWaktu: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Parse JSON strings
      const data = {
        ...formData,
        usahaSesuai: JSON.stringify(JSON.parse(formData.usahaSesuai)),
        perluKajian: JSON.stringify(JSON.parse(formData.perluKajian)),
      }

      const res = await fetch('/api/wilayah', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        router.push('/admin/wilayah')
      }
    } catch (error) {
      alert('Error: Format JSON tidak valid')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <Link href="/admin/wilayah">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Tambah Wilayah</h1>
          <p className="text-gray-600 mt-2">Menambahkan data wilayah baru</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kecamatan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kecamatan</label>
              <input
                type="text"
                required
                value={formData.kecamatan}
                onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nama kecamatan"
              />
            </div>

            {/* Desa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Desa</label>
              <input
                type="text"
                required
                value={formData.desa}
                onChange={(e) => setFormData({ ...formData, desa: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nama desa"
              />
            </div>

            {/* Koordinat Lokasi */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Koordinat Lokasi Pin (Copy dari Google Maps)</label>
              <div className="flex gap-3">
                <input
                  type="number"
                  required
                  step="0.000001"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Latitude (-8.123456)"
                />
                <input
                  type="number"
                  required
                  step="0.000001"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Longitude (116.123456)"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Lokasi pin yang ditampilkan di map cek-wilayah user</p>
            </div>

            {/* Status RDTR */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status RDTR</label>
              <select
                value={formData.statusRdtr}
                onChange={(e) => setFormData({ ...formData, statusRdtr: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Tersedia">Tersedia</option>
                <option value="Proses">Proses</option>
              </select>
            </div>
          </div>

          {/* Usaha Sesuai */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Usaha Sesuai (JSON Array)</label>
            <textarea
              required
              value={formData.usahaSesuai}
              onChange={(e) => setFormData({ ...formData, usahaSesuai: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder='["Pariwisata", "Pertanian"]'
              rows={6}
            />
            <p className="text-xs text-gray-500 mt-2">Contoh format: ["Pariwisata", "Pertanian", "Perikanan"]</p>
          </div>

          {/* Perlu Kajian */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Perlu Kajian (JSON Array)</label>
            <textarea
              required
              value={formData.perluKajian}
              onChange={(e) => setFormData({ ...formData, perluKajian: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              placeholder='["Industri"]'
              rows={6}
            />
            <p className="text-xs text-gray-500 mt-2">Contoh format: ["Industri", "Manufaktur"]</p>
          </div>

          {/* Catatan Risiko */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Risiko</label>
            <textarea
              value={formData.catatanRisiko}
              onChange={(e) => setFormData({ ...formData, catatanRisiko: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Catatan tentang risiko atau hal penting di wilayah ini"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Estimasi Biaya */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimasi Biaya Izin</label>
              <input
                type="text"
                value={formData.estimasiBiaya}
                onChange={(e) => setFormData({ ...formData, estimasiBiaya: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Rp. 5.000.000 - Rp. 10.000.000"
              />
            </div>

            {/* Estimasi Waktu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimasi Waktu Izin</label>
              <input
                type="text"
                value={formData.estimasiWaktu}
                onChange={(e) => setFormData({ ...formData, estimasiWaktu: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="7 - 14 hari kerja"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <Link href="/admin/wilayah" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Batal
              </Button>
            </Link>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Menyimpan...' : 'Simpan Wilayah'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
