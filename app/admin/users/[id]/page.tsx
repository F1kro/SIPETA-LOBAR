'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Admin {
  id: string
  email: string
  createdAt: string
}

export default function EditAdminPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAdmin()
  }, [params.id])

  const fetchAdmin = async () => {
    try {
      const res = await fetch(`/api/admin/${params.id}`)
      const data = await res.json()
      setAdmin(data)
      setFormData({ email: data.email, password: '', confirmPassword: '' })
    } catch (error) {
      console.error('Error fetching admin:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok')
      return
    }

    if (formData.password && formData.password.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }

    setSaving(true)

    try {
      const res = await fetch(`/api/admin/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Gagal mengubah admin')
        return
      }

      router.push('/admin/users')
    } catch (error) {
      setError('Terjadi kesalahan')
      console.error('Error:', error)
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
        <Link href="/admin/users">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Edit Admin</h1>
          <p className="text-gray-600 mt-2">Mengubah data akun admin</p>
        </div>
      </div>

      <div className="max-w-md">
        <Card>
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Admin</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Kosongkan jika tidak ingin mengubah"
              />
              <p className="text-xs text-gray-500 mt-1">Minimal 6 karakter</p>
            </div>

            {/* Confirm Password */}
            {formData.password && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ulangi password"
                />
              </div>
            )}

            {/* Info */}
            {admin && (
              <div className="p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
                <p>
                  <strong>Dibuat pada:</strong> {new Date(admin.createdAt).toLocaleDateString('id-ID')}
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <Link href="/admin/users" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
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
    </div>
  )
}
