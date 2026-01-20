'use client'

import { Card } from '@/components/ui/card'
import { MapPin, Map, Users } from 'lucide-react'
import Link from 'next/link'

const stats = [
  {
    title: 'Lokasi Usaha',
    count: 0,
    icon: MapPin,
    href: '/admin/usaha',
    color: 'bg-blue-500',
  },
  {
    title: 'Wilayah',
    count: 0,
    icon: Map,
    href: '/admin/wilayah',
    color: 'bg-green-500',
  },
  {
    title: 'Users/Admin',
    count: 0,
    icon: Users,
    href: '/admin/users',
    color: 'bg-purple-500',
  },
]

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{stat.count}</p>
                    </div>
                    <div className={`${stat.color} p-4 rounded-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Informasi Sistem</h2>
          <div className="space-y-3 text-gray-600">
            <p>Selamat datang di Admin Panel DPMPTSP Kabupaten Lombok Barat</p>
            <p>Gunakan menu di samping untuk mengelola:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Lokasi Usaha - Tambah, edit, dan hapus lokasi usaha beserta foto</li>
              <li>Wilayah - Kelola data wilayah, RDTR, dan rekomendasi usaha</li>
              <li>Users/Admin - Kelola akun pengguna dan admin sistem</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
