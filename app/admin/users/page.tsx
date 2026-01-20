'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Edit2, Trash2, Plus, Shield } from 'lucide-react'

interface Admin {
  id: string
  email: string
  createdAt: string
}

export default function UsersListPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/admin')
      const data = await res.json()
      setAdmins(data)
    } catch (error) {
      console.error('Error fetching admins:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus admin ini?')) return

    try {
      const res = await fetch(`/api/admin/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchAdmins()
      }
    } catch (error) {
      console.error('Error deleting admin:', error)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Users / Admin</h1>
          <p className="text-gray-600 mt-2">Kelola akun admin sistem DPMPTSP</p>
        </div>
        <Link href="/admin/users/tambah">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Tambah Admin
          </Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : admins.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Belum ada admin yang ditambahkan</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Dibuat Pada</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{admin.email}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-blue-600">
                        <Shield className="w-4 h-4" />
                        Admin
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(admin.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link href={`/admin/users/${admin.id}`}>
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(admin.id)}
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
