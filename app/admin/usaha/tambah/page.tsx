'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import BusinessForm from "@/components/business-form"

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

export default function TambahUsahaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setFormData((prev) => ({ ...prev, gambar: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/usaha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push('/admin/usaha')
      }
    } catch (error) {
      console.error('Error creating usaha:', error)
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-3xl font-bold text-gray-800">Tambah Lokasi Usaha</h1>
          <p className="text-gray-600 mt-2">Menambahkan lokasi usaha baru ke sistem</p>
        </div>
      </div>

      <Card className="p-8">
        <BusinessForm
          onSuccess={() => router.push('/admin/usaha')}
        />
      </Card>
    </div>
  )
}
