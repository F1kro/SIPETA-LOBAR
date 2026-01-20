'use client'

import Image from 'next/image'

interface Business {
  id: string
  name: string
  description?: string
  sector: string
  status: string
  badge?: string
  investment_amount?: number
  image_url?: string
  address?: string
  village?: string
  district?: string
  business_type?: string
  owner_name?: string
  year_established?: number
}

interface BusinessDetailCardProps {
  business: Business | null
}

export default function BusinessDetailCard({ business }: BusinessDetailCardProps) {
  if (!business) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-8 text-center">
        <div className="text-4xl mb-3">🗺️</div>
        <p className="text-slate-600 font-medium">Pilih pin usaha di peta</p>
        <p className="text-slate-500 text-sm mt-2">untuk melihat detail lengkap usaha</p>
      </div>
    )
  }

  const formatRupiah = (amount?: number) => {
    if (!amount) return '-'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {business.image_url && (
        <div className="relative h-48 w-full bg-slate-200">
          <Image
            src={business.image_url || "/placeholder.svg"}
            alt={business.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-slate-900">{business.name}</h3>
          {business.badge && (
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">
              {business.badge}
            </span>
          )}
        </div>

        <p className="text-sm text-slate-600 mb-4">{business.business_type || business.sector}</p>

        {business.description && (
          <p className="text-slate-700 text-sm mb-4">{business.description}</p>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-slate-200">
          <div>
            <p className="text-xs text-slate-600 uppercase font-semibold">Lokasi</p>
            <p className="text-sm text-slate-900">
              {business.village}, {business.district}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600 uppercase font-semibold">Sektor</p>
            <p className="text-sm text-slate-900">{business.sector}</p>
          </div>
          {business.investment_amount && (
            <div>
              <p className="text-xs text-slate-600 uppercase font-semibold">Investasi</p>
              <p className="text-sm text-slate-900">{formatRupiah(business.investment_amount)}</p>
            </div>
          )}
          {business.year_established && (
            <div>
              <p className="text-xs text-slate-600 uppercase font-semibold">Tahun Berdiri</p>
              <p className="text-sm text-slate-900">{business.year_established}</p>
            </div>
          )}
        </div>

        {business.address && (
          <div className="pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-600 uppercase font-semibold mb-2">Alamat Lengkap</p>
            <p className="text-sm text-slate-700">{business.address}</p>
          </div>
        )}

        {business.owner_name && (
          <div className="pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-600 uppercase font-semibold">Pemilik</p>
            <p className="text-sm text-slate-900">{business.owner_name}</p>
          </div>
        )}

        <button className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition">
          Hubungi Pemilik
        </button>
      </div>
    </div>
  )
}
