'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Building2, Edit3, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import BusinessForm from '@/components/business-form'

export default function EditUsahaPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [initialData, setInitialData] = useState<any>(null)

  useEffect(() => {
    const fetchUsaha = async () => {
      try {
        const res = await fetch(`/api/usaha/${params.id}`)
        if (!res.ok) throw new Error('Gagal mengambil data')
        const data = await res.json()
        setInitialData(data)
      } catch (error) {
        console.error('Error fetching usaha:', error)
        toast.error('Gagal Memuat Data', {
          description: 'Data usaha tidak ditemukan atau terjadi kesalahan server.',
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) fetchUsaha()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sinkronisasi Data...</p>
      </div>
    )
  }

  if (!initialData) return null

  return (
    <div className="font-poppins pb-10 w-full max-w-[1400px] mx-auto animate-in fade-in duration-500 text-left">
      <div className="flex items-center justify-between px-2 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200 shrink-0">
            <Edit3 className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">
              Edit Usaha
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
              Update data usaha berbasis wilayah desa/kelurahan
            </p>
          </div>
        </div>
        <Link href="/admin/usaha">
          <Button
            variant="outline"
            className="border-2 border-slate-200 rounded-xl px-5 py-5 font-black uppercase tracking-widest text-[10px] hover:bg-slate-900 hover:text-white transition-all flex gap-2"
          >
            <ArrowLeft size={16} /> Kembali
          </Button>
        </Link>
      </div>

      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white p-0">
        <div className="bg-slate-900 px-8 py-6 flex items-center justify-between relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Building2 size={20} />
            </div>
            <div className="text-left">
              <h2 className="text-white font-black uppercase tracking-widest text-[10px] md:text-xs leading-none">
                Koreksi Data Unit
              </h2>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-tighter mt-1 italic">
                ID: {params.id?.toString().toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8 bg-slate-50/30">
          <div className="w-full bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
            <BusinessForm initialData={initialData} onSuccess={() => router.push('/admin/usaha')} />
          </div>
        </div>
      </Card>
    </div>
  )
}
