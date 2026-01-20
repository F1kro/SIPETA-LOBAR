'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Edit2, Trash2, Plus } from 'lucide-react'

interface Wilayah {
  id: string
  kecamatan: string
  desa: string
  statusRdtr: string
}

export default function WilayahListPage() {
  const [wilayahs, setWilayahs] = useState<Wilayah[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWilayahs()
  }, [])

  const fetchWilayahs = async () => {
    try {
      const res = await fetch('/api/wilayah')
      const data = await res.json()
      setWilayahs(data)
    } catch (error) {
      console.error('Error fetching wilayahs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus wilayah ini?')) return

    try {
      const res = await fetch(`/api/wilayah/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchWilayahs()
      }
    } catch (error) {
      console.error('Error deleting wilayah:', error)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Wilayah</h1>
          <p className="text-gray-600 mt-2">Kelola data wilayah, RDTR, dan rekomendasi usaha</p>
        </div>
        <Link href="/admin/wilayah/tambah">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Tambah Wilayah
          </Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : wilayahs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Belum ada wilayah yang ditambahkan</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Kecamatan</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Desa</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status RDTR</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {wilayahs.map((wilayah) => (
                  <tr key={wilayah.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{wilayah.kecamatan}</td>
                    <td className="px-6 py-4 text-gray-600">{wilayah.desa}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          wilayah.statusRdtr === 'Tersedia'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {wilayah.statusRdtr}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link href={`/admin/wilayah/${wilayah.id}`}>
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(wilayah.id)}
                        className="gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Hapus
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  )
}
