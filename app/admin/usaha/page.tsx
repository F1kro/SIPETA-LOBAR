'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Edit2, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react'

interface Usaha {
  id: string
  nama: string
  sektor: string
  status: string
  kecamatan: string
  desa: string
  nomerTelp: string
  email: string
}

export default function UsahaListPage() {
  const [usahas, setUsahas] = useState<Usaha[]>([])
  const [loading, setLoading] = useState(true)
  
  // State untuk Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7 // <--- Maximal 7 data per halaman sesuai request

  useEffect(() => {
    fetchUsahas()
  }, [])

  const fetchUsahas = async () => {
    try {
      const res = await fetch('/api/usaha')
      const data = await res.json()
      setUsahas(data)
    } catch (error) {
      console.error('Error fetching usahas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus usaha ini?')) return

    try {
      const res = await fetch(`/api/usaha/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchUsahas()
      }
    } catch (error) {
      console.error('Error deleting usaha:', error)
    }
  }

  // Logika Pagination
  const totalPages = Math.ceil(usahas.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = usahas.slice(indexOfFirstItem, indexOfLastItem)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Lokasi Usaha</h1>
          <p className="text-gray-600 mt-2">Kelola semua lokasi usaha yang terdaftar</p>
        </div>
        <Link href="/admin/usaha/tambah">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Tambah Usaha
          </Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : usahas.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Belum ada usaha yang ditambahkan</div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nama Usaha</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Sektor</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Lokasi</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Kontak</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {currentItems.map((usaha) => (
                    <tr key={usaha.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{usaha.nama}</td>
                      <td className="px-6 py-4 text-gray-600">{usaha.sektor}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            usaha.status.toLowerCase() === 'aktif'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {usaha.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {usaha.kecamatan}, {usaha.desa}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="text-sm font-semibold">{usaha.nomerTelp}</div>
                        <div className="text-sm text-gray-400">{usaha.email}</div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Link href={`/admin/usaha/${usaha.id}`}>
                          <Button variant="outline" size="sm" className="gap-2 bg-transparent border-blue-200 text-blue-600 hover:bg-blue-50">
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(usaha.id)}
                          className="gap-2 shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Hapus
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* NAVIGASI PAGINATION */}
              <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t rounded-b-lg">
                <div className="text-xs md:text-sm text-gray-500 font-medium">
                  Data <span className="text-gray-900">{indexOfFirstItem + 1}</span> - <span className="text-gray-900">{Math.min(indexOfLastItem, usahas.length)}</span> dari total <span className="text-gray-900">{usahas.length}</span> usaha
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className={`h-8 w-8 p-0 text-xs ${currentPage === page ? 'bg-blue-600' : ''}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}