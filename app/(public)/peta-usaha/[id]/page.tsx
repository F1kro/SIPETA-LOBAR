'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Coins, Phone, MessageCircle, User, Building2 } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function DetailUsahaPage() {
  const { id } = useParams()
  const router = useRouter()
  const [usaha, setUsaha] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const formatRupiah = (angka: any) => {
    if (!angka) return '0'
    const val = typeof angka === 'string' ? angka.replace(/[^0-9]/g, '') : angka
    return new Intl.NumberFormat('id-ID').format(val)
  }

  useEffect(() => {
    fetch(`/api/usaha/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUsaha(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white font-poppins">
        <div className="animate-pulse text-blue-600 font-black tracking-widest uppercase text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          Memuat Detail Usaha...
        </div>
      </div>
    )
  }

  if (!usaha || usaha.error) {
    return (
      <div className="h-screen flex items-center justify-center bg-white font-poppins text-center px-4">
        <div>
          <p className="text-gray-500 font-bold mb-4 uppercase tracking-tight">Data usaha tidak ditemukan.</p>
          <button
            onClick={() => router.push('/peta-usaha')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-200"
          >
            Kembali ke Peta
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 font-poppins text-slate-900 pb-20 text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        <button
          onClick={() => router.push('/peta-usaha')}
          className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-black text-[10px] md:text-xs uppercase tracking-[0.2em]"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Kembali Ke Peta
        </button>

        <Card className="bg-white rounded-[2.2rem] p-8 md:p-12 shadow-xl border border-slate-100">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 shrink-0">
              <Building2 size={28} />
            </div>
            <div>
              <span className="inline-flex bg-blue-50 text-blue-700 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-blue-100 mb-3">
                {usaha.sektor}
              </span>
              <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-tight">{usaha.nama}</h1>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mt-2">Detail Proyek / Kegiatan Usaha</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Perusahaan / Pemilik</p>
              <div className="flex items-center gap-2 text-slate-900 font-black">
                <User size={16} className="text-amber-500" />
                <span>{usaha.namaPemilik || '-'}</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Wilayah</p>
              <div className="flex items-center gap-2 text-slate-900 font-black">
                <MapPin size={16} className="text-blue-600" />
                <span>{usaha.desa}, {usaha.kecamatan}</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Nilai Investasi</p>
              <div className="flex items-center gap-2 text-slate-900 font-black">
                <Coins size={16} className="text-emerald-600" />
                <span>Rp {formatRupiah(usaha.investasi)}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white rounded-[2.2rem] p-8 md:p-12 shadow-xl border border-slate-100">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-5">Ringkasan Usaha</h2>
          <p className="text-slate-600 leading-8 whitespace-pre-line">
            {usaha.deskripsi || 'Ringkasan detail belum tersedia.'}
          </p>

          <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Kontak</p>
              <p className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Phone size={18} className="text-slate-500" /> {usaha.nomerTelp || '-'}
              </p>
            </div>
            {usaha.nomerTelp && usaha.nomerTelp !== '-' && (
              <a
                href={`https://wa.me/${usaha.nomerTelp?.replace(/[^0-9]/g, '')}`}
                target="_blank"
                className="bg-green-500 text-white px-8 py-4 rounded-2xl font-black text-xs hover:bg-green-600 transition-all shadow-lg shadow-green-200 flex items-center gap-3 uppercase tracking-[0.2em]"
              >
                <MessageCircle size={20} /> Hubungi WhatsApp
              </a>
            )}
          </div>
        </Card>
      </div>
    </main>
  )
}
