// 'use client'

// import React from "react"

// import { useState, useEffect } from 'react'
// import { useRouter, useParams } from 'next/navigation'
// import { Card } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { ArrowLeft } from 'lucide-react'
// import Link from 'next/link'

// const SECTORS = [
//   'Pariwisata',
//   'Pertanian',
//   'Perikanan',
//   'Peternakan',
//   'Perdagangan',
//   'Industri',
//   'Jasa',
//   'Pendidikan',
//   'Kesehatan',
//   'Lainnya',
// ]

// export default function EditUsahaPage() {
//   const router = useRouter()
//   const params = useParams()
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [imagePreview, setImagePreview] = useState<string | null>(null)
//   const [formData, setFormData] = useState({
//     nama: '',
//     sektor: '',
//     status: 'aktif',
//     latitude: '',
//     longitude: '',
//     kecamatan: '',
//     desa: '',
//     nomerTelp: '',
//     email: '',
//     deskripsi: '',
//     gambar: '',
//     investasi: '',
//     tahunBerdiri: '',
//   })

//   useEffect(() => {
//     fetchUsaha()
//   }, [params.id])

//   const fetchUsaha = async () => {
//     try {
//       const res = await fetch(`/api/usaha/${params.id}`)
//       const data = await res.json()
//       setFormData(data)
//       if (data.gambar) {
//         setImagePreview(data.gambar)
//       }
//     } catch (error) {
//       console.error('Error fetching usaha:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         setImagePreview(reader.result as string)
//         setFormData((prev) => ({ ...prev, gambar: reader.result as string }))
//       }
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setSaving(true)

//     try {
//       const res = await fetch(`/api/usaha/${params.id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       })

//       if (res.ok) {
//         router.push('/admin/usaha')
//       }
//     } catch (error) {
//       console.error('Error updating usaha:', error)
//     } finally {
//       setSaving(false)
//     }
//   }

//   if (loading) {
//     return <div className="text-center py-8">Loading...</div>
//   }

//   return (
//     <div>
//       <div className="mb-6 flex items-center gap-2">
//         <Link href="/admin/usaha">
//           <Button variant="outline" size="sm">
//             <ArrowLeft className="w-4 h-4" />
//           </Button>
//         </Link>
//         <div>
//           <h1 className="text-3xl font-bold text-gray-800">Edit Lokasi Usaha</h1>
//           <p className="text-gray-600 mt-2">Mengubah data lokasi usaha</p>
//         </div>
//       </div>

//       <Card>
//         <form onSubmit={handleSubmit} className="p-8 space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Nama */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Nama Usaha</label>
//               <input
//                 type="text"
//                 required
//                 value={formData.nama}
//                 onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Nama usaha"
//               />
//             </div>

//             {/* Sektor */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Sektor</label>
//               <select
//                 required
//                 value={formData.sektor}
//                 onChange={(e) => setFormData({ ...formData, sektor: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="">Pilih sektor</option>
//                 {SECTORS.map((sector) => (
//                   <option key={sector} value={sector}>
//                     {sector}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Koordinat Lokasi */}
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium text-gray-700 mb-2">Koordinat Lokasi (Copy dari Google Maps)</label>
//               <div className="flex gap-3">
//                 <input
//                   type="number"
//                   required
//                   step="0.000001"
//                   value={formData.latitude}
//                   onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
//                   className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Latitude (-8.123456)"
//                 />
//                 <input
//                   type="number"
//                   required
//                   step="0.000001"
//                   value={formData.longitude}
//                   onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
//                   className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Longitude (116.123456)"
//                 />
//               </div>
//               <p className="text-xs text-gray-500 mt-2">Format: -8.123456, 116.123456</p>
//             </div>

//             {/* Kecamatan */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Kecamatan</label>
//               <input
//                 type="text"
//                 required
//                 value={formData.kecamatan}
//                 onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             {/* Desa */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Desa</label>
//               <input
//                 type="text"
//                 required
//                 value={formData.desa}
//                 onChange={(e) => setFormData({ ...formData, desa: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             {/* Nomor Telepon */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon Pemilik</label>
//               <input
//                 type="tel"
//                 required
//                 value={formData.nomerTelp}
//                 onChange={(e) => setFormData({ ...formData, nomerTelp: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Email Pemilik</label>
//               <input
//                 type="email"
//                 required
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             {/* Status */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//               <select
//                 value={formData.status}
//                 onChange={(e) => setFormData({ ...formData, status: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="aktif">Aktif</option>
//                 <option value="nonaktif">Nonaktif</option>
//               </select>
//             </div>

//             {/* Investasi */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Investasi (Rp)</label>
//               <input
//                 type="number"
//                 value={formData.investasi}
//                 onChange={(e) => setFormData({ ...formData, investasi: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="5000000000"
//               />
//             </div>

//             {/* Tahun Berdiri */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Tahun Berdiri</label>
//               <input
//                 type="number"
//                 min="1900"
//                 max={new Date().getFullYear()}
//                 value={formData.tahunBerdiri}
//                 onChange={(e) => setFormData({ ...formData, tahunBerdiri: e.target.value })}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder={new Date().getFullYear().toString()}
//               />
//             </div>
//           </div>

//           {/* Deskripsi */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
//             <textarea
//               value={formData.deskripsi}
//               onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Deskripsi usaha"
//               rows={4}
//             />
//           </div>

//           {/* Gambar */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Foto Usaha</label>
//             <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//               {imagePreview ? (
//                 <div className="space-y-4">
//                   <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="h-48 mx-auto object-contain rounded" />
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     className="hidden"
//                     id="image-input"
//                   />
//                   <label htmlFor="image-input" className="cursor-pointer text-blue-600 hover:text-blue-700">
//                     Ubah Gambar
//                   </label>
//                 </div>
//               ) : (
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="hidden"
//                   id="image-input"
//                 />
//               )}
//               <label htmlFor="image-input" className="block cursor-pointer">
//                 <p className="text-gray-600">Drag and drop gambar di sini atau klik untuk memilih</p>
//               </label>
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex gap-4 pt-6">
//             <Link href="/admin/usaha" className="flex-1">
//               <Button variant="outline" className="w-full bg-transparent">
//                 Batal
//               </Button>
//             </Link>
//             <Button type="submit" disabled={saving} className="flex-1">
//               {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
//             </Button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   )
// }


'use client'

import React from "react"
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

const SECTORS = [
  'Pariwisata',
  'Pertanian',
  'Perikanan',
  'Peternakan',
  'Perdagangan',
  'Industri',
  'Jasa',
  'Pendidikan',
  'Kesehatan',
  'Lainnya',
]

export default function EditUsahaPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    nama: '',
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

  useEffect(() => {
    fetchUsaha()
  }, [params.id])

  const fetchUsaha = async () => {
    try {
      const res = await fetch(`/api/usaha/${params.id}`)
      const data = await res.json()
      setFormData(data)
    } catch (error) {
      console.error('Error fetching usaha:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch(`/api/usaha/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push('/admin/usaha')
      }
    } catch (error) {
      console.error('Error updating usaha:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <Link href="/admin/usaha">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Edit Lokasi Usaha</h1>
          <p className="text-gray-600 mt-2">Mengubah data lokasi usaha</p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Usaha</label>
              <input
                type="text"
                required
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nama usaha"
              />
            </div>

            {/* Sektor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sektor</label>
              <select
                required
                value={formData.sektor}
                onChange={(e) => setFormData({ ...formData, sektor: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih sektor</option>
                {SECTORS.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
            </div>

            {/* Koordinat Lokasi */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Koordinat Lokasi</label>
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
            </div>

            {/* Kecamatan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kecamatan</label>
              <input
                type="text"
                required
                value={formData.kecamatan}
                onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              />
            </div>

            {/* Nomor Telepon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
              <input
                type="tel"
                required
                value={formData.nomerTelp}
                onChange={(e) => setFormData({ ...formData, nomerTelp: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>

            {/* Investasi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Investasi (Rp)</label>
              <input
                type="number"
                value={formData.investasi}
                onChange={(e) => setFormData({ ...formData, investasi: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contoh: 5000000000"
              />
            </div>
          </div>

          {/* URL Gambar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL Gambar Usaha</label>
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <input
                  type="url"
                  value={formData.gambar}
                  onChange={(e) => setFormData({ ...formData, gambar: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/gambar.jpg"
                />
                <p className="text-xs text-gray-500 mt-1 italic">Masukkan link gambar dari internet (Unsplash, Google Drive, dll)</p>
              </div>
              {formData.gambar && (
                <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-gray-50 flex items-center justify-center">
                  <img 
                    src={formData.gambar} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg"
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
            <textarea
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Deskripsi usaha"
              rows={4}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <Link href="/admin/usaha" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent" type="button">
                Batal
              </Button>
            </Link>
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}